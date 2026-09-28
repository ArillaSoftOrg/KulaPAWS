import type { Dispatch } from "react";
import type { WizardAction, WizardField, WizardState } from "@/components/appointment/wizardState";

export interface StepProps {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
  // The copy message for a field's current error, if any.
  errorFor: (field: WizardField) => string | undefined;
}
