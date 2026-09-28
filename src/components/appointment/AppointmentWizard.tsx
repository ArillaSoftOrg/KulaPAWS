"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppointmentSuccess, SUCCESS_HEADING_ID } from "@/components/appointment/AppointmentSuccess";
import { AppointmentSummary } from "@/components/appointment/AppointmentSummary";
import { StepIndicator } from "@/components/appointment/StepIndicator";
import { SubmissionError } from "@/components/appointment/SubmissionError";
import { useBookedSlots } from "@/components/appointment/useBookedSlots";
import {
  buildAppointmentInput,
  createInitialWizardState,
  fieldId,
  REVIEW_STEP_INDEX,
  stepFields,
  stepIndexOf,
  validateForContinue,
  validateThrough,
  wizardReducer,
  wizardSteps,
} from "@/components/appointment/wizardState";
import type { WizardField, WizardStepId } from "@/components/appointment/wizardState";
import { ServiceStep } from "@/components/appointment/steps/ServiceStep";
import { PetStep } from "@/components/appointment/steps/PetStep";
import { AddressStep } from "@/components/appointment/steps/AddressStep";
import { DateStep } from "@/components/appointment/steps/DateStep";
import { TimeStep } from "@/components/appointment/steps/TimeStep";
import { CustomerStep } from "@/components/appointment/steps/CustomerStep";
import { appointmentCopy } from "@/data/appointment";
import type { Business } from "@/data/business";
import type { Service } from "@/data/services";
import { appointmentsRepository } from "@/lib/appointments/appointmentsRepository";
import { getAvailableSlots, getBookableDates } from "@/lib/appointments/availability";
import { isServiceBookable } from "@/lib/appointments/pricing";
import { isAppointmentError } from "@/lib/appointments/repository";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { servicesRepository, SERVICES_SYNC_PING_KEY } from "@/lib/content/servicesRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";

const SERVICES_KEYS = [SERVICES_SYNC_PING_KEY];
const BUSINESS_KEYS = [BUSINESS_SYNC_PING_KEY];
const HEADING_ID = "appointment-step-heading";

// Steps that need to know which slots are already taken: date and time to
// offer only free options, customer to re-check the chosen time. Final
// submission re-checks through the repository itself.
const AVAILABILITY_STEPS: WizardStepId[] = ["date", "time", "customer"];

// Returns false when the field isn't rendered (yet).
function focusField(field: WizardField): boolean {
  const element = document.getElementById(fieldId(field));
  // Radio groups are addressed by their fieldset; focus the chosen option
  // (or the first enabled one), matching where Tab would land.
  const target =
    element instanceof HTMLFieldSetElement
      ? (element.querySelector<HTMLInputElement>("input:checked") ??
        element.querySelector<HTMLInputElement>("input:not(:disabled)"))
      : element;
  target?.focus();
  return Boolean(target);
}

interface AppointmentWizardProps {
  defaultServices: Service[];
  defaultBusiness: Business;
}

export function AppointmentWizard({ defaultServices, defaultBusiness }: AppointmentWizardProps) {
  const searchParams = useSearchParams();
  const liveServices = useLiveContent(defaultServices, servicesRepository.list, SERVICES_KEYS);
  const business = useLiveContent(defaultBusiness, businessRepository.get, BUSINESS_KEYS);
  const services = useMemo(() => liveServices.filter((service) => isServiceBookable(service.slug)), [liveServices]);

  const [state, dispatch] = useReducer(wizardReducer, null, () =>
    createInitialWizardState(
      searchParams.get("service"),
      defaultServices.filter((service) => isServiceBookable(service.slug)).map((service) => service.slug),
    ),
  );

  const stepId = wizardSteps[state.stepIndex];
  const { submission } = state;
  const submitting = submission.status === "submitting";
  const needsAvailability = AVAILABILITY_STEPS.includes(stepId) && submission.status !== "succeeded";

  const bookableDates = needsAvailability ? getBookableDates() : [];
  const [reloadToken, setReloadToken] = useState(0);
  const booked = useBookedSlots(
    needsAvailability ? `${stepId}:${reloadToken}` : null,
    bookableDates[0],
    bookableDates[bookableDates.length - 1],
  );
  const bookedSlots = booked.status === "ready" ? booked.slots : [];

  const dateOptions = bookableDates.map((date) => ({
    date,
    available: getAvailableSlots({ date, serviceSlug: state.serviceSlug, bookedSlots }).length > 0,
  }));
  const timeSlots =
    stepId === "time" && state.date
      ? getAvailableSlots({ date: state.date, serviceSlug: state.serviceSlug, bookedSlots })
      : [];

  // Move focus to the new step's heading on every step change (not on
  // first render), so keyboard and screen reader users land at the top of
  // the new content instead of on a button that may no longer exist.
  const previousStepIndex = useRef(state.stepIndex);
  const pendingFocusField = useRef<WizardField | null>(null);
  useEffect(() => {
    if (previousStepIndex.current === state.stepIndex) return;
    previousStepIndex.current = state.stepIndex;
    pendingFocusField.current = null;
    document.getElementById(HEADING_ID)?.focus();
  }, [state.stepIndex]);

  // After a failed "Continue"/submit, focus the first invalid field once
  // per attempt (its aria-describedby announces the error). Runs after the
  // heading effect, so it wins when a failure also changed the step. The
  // field may not exist yet — e.g. the time step is still loading
  // availability after a rejected submission — so the target is kept and
  // retried after each render until it appears or the step changes.
  const handledAttempt = useRef(state.attempt);
  useEffect(() => {
    if (handledAttempt.current !== state.attempt) {
      handledAttempt.current = state.attempt;
      pendingFocusField.current =
        stepFields[wizardSteps[state.stepIndex]].find((field) => state.errors[field]) ?? null;
    }
    if (pendingFocusField.current && focusField(pendingFocusField.current)) {
      pendingFocusField.current = null;
    }
  });

  // Announce the outcome of a submission by moving focus to it.
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (submission.status === "succeeded") document.getElementById(SUCCESS_HEADING_ID)?.focus();
    if (submission.status === "failed") errorRef.current?.focus();
  }, [submission.status]);

  // Guards against double submission within the same tick (two fast
  // clicks, Enter + click) before the "submitting" state has rendered.
  const submitLock = useRef(false);

  // Idempotency key for this booking attempt, reused by every retry of it
  // (so a retry after a lost response returns the appointment already
  // created instead of making a second one), and discarded by Start over.
  const requestId = useRef<string | null>(null);

  const context = { services, serviceAreas: business.serviceAreas, bookedSlots };

  async function submitAppointment() {
    if (submitLock.current || (submission.status !== "idle" && submission.status !== "failed")) return;

    // Re-check every answer before sending; the repository re-checks again
    // (including slot availability) as the final authority.
    const errors = validateThrough(state, REVIEW_STEP_INDEX - 1, context);
    const input = buildAppointmentInput(state, services);
    if (Object.keys(errors).length > 0 || !input) {
      dispatch({ type: "submitStep", errors });
      return;
    }

    submitLock.current = true;
    dispatch({ type: "submitStarted" });
    try {
      requestId.current ??= crypto.randomUUID();
      const appointment = await appointmentsRepository.create(input, { requestId: requestId.current });
      dispatch({ type: "submitSucceeded", appointment });
    } catch (err) {
      if (isAppointmentError(err) && err.code === "validation") {
        dispatch({ type: "submitRejected", fieldErrors: err.fieldErrors });
      } else {
        console.error("Failed to create appointment:", err);
        dispatch({
          type: "submitFailed",
          reason:
            isAppointmentError(err) && (err.code === "storage" || err.code === "rate-limited") ? err.code : "unexpected",
        });
      }
    } finally {
      submitLock.current = false;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stepId === "review") {
      void submitAppointment();
      return;
    }
    dispatch({ type: "submitStep", errors: validateForContinue(state, context) });
  }

  function errorFor(field: WizardField): string | undefined {
    const code = state.errors[field];
    return code ? appointmentCopy.validation[code] : undefined;
  }

  if (submission.status === "succeeded") {
    return (
      <Card>
        <AppointmentSuccess
          appointment={submission.appointment}
          business={business}
          onStartOver={() => {
            requestId.current = null;
            dispatch({ type: "reset" });
          }}
        />
      </Card>
    );
  }

  const reviewInput = stepId === "review" ? buildAppointmentInput(state, services) : null;
  const canContinue =
    !submitting &&
    (stepId !== "service" || services.length > 0) &&
    (!needsAvailability || booked.status === "ready");
  const stepCopy = appointmentCopy.steps[stepId];
  const stepProps = { state, dispatch, errorFor };
  const retry = () => setReloadToken((token) => token + 1);

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator
        titles={wizardSteps.map((step) => appointmentCopy.steps[step].title)}
        currentIndex={state.stepIndex}
        furthestIndex={state.furthestStepIndex}
        onSelect={(stepIndex) => dispatch({ type: "goTo", stepIndex })}
      />

      <Card>
        <form noValidate onSubmit={handleSubmit} aria-labelledby={HEADING_ID} className="flex flex-col gap-6">
          <div>
            <h2
              id={HEADING_ID}
              tabIndex={-1}
              className="text-[22px] font-semibold leading-[1.25] text-foreground focus:outline-none"
            >
              {stepCopy.title}
            </h2>
            <p className="mt-2 text-[15px] text-muted-foreground">{stepCopy.description}</p>
          </div>

          {stepId === "service" && <ServiceStep {...stepProps} services={services} />}
          {stepId === "pet" && <PetStep {...stepProps} />}
          {stepId === "address" && <AddressStep {...stepProps} serviceAreas={business.serviceAreas} />}
          {stepId === "date" && (
            <DateStep {...stepProps} dates={dateOptions} availabilityStatus={booked.status} onRetry={retry} />
          )}
          {stepId === "time" && (
            <TimeStep
              {...stepProps}
              slots={timeSlots}
              availabilityStatus={booked.status}
              onRetry={retry}
              onChangeDate={() => dispatch({ type: "goTo", stepIndex: stepIndexOf("date") })}
            />
          )}
          {stepId === "customer" && <CustomerStep {...stepProps} />}
          {stepId === "review" && reviewInput && (
            <AppointmentSummary
              input={reviewInput}
              onEdit={submitting ? undefined : (step) => dispatch({ type: "goTo", stepIndex: stepIndexOf(step) })}
              priceError={errorFor("price")}
            />
          )}

          {submission.status === "failed" && (
            <SubmissionError
              ref={errorRef}
              business={business}
              reason={submission.reason}
              onRetry={() => void submitAppointment()}
            />
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            {state.stepIndex > 0 ? (
              <Button type="button" variant="secondary" disabled={submitting} onClick={() => dispatch({ type: "back" })}>
                {appointmentCopy.actions.back}
              </Button>
            ) : (
              <span className="hidden sm:block" aria-hidden="true" />
            )}
            {stepId === "review" ? (
              <Button type="submit" size="lg" loading={submitting}>
                {submitting ? appointmentCopy.actions.submitting : appointmentCopy.actions.submit}
              </Button>
            ) : (
              <Button type="submit" disabled={!canContinue}>
                {appointmentCopy.actions.next}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
