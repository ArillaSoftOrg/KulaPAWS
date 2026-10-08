import { cn } from "@/lib/cn";
import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";
import { CheckIcon } from "@/components/ui/CheckIcon";

interface StepIndicatorProps {
  titles: string[];
  currentIndex: number;
  furthestIndex: number;
  onSelect: (index: number) => void;
  copy?: AppointmentCopy;
}

// Compact "Step n of N" + progress bar on phones; the full numbered list
// with a connecting line from sm up, where already-reached steps are
// buttons to jump back to and steps before the current one show a
// checkmark instead of their number. Same reachable/current/furthest
// mechanics as before — only the visual treatment changed.
export function StepIndicator({ titles, currentIndex, furthestIndex, onSelect, copy = appointmentCopy }: StepIndicatorProps) {
  const progress = `${((currentIndex + 1) / titles.length) * 100}%`;
  // Each step's circle sits centered in its 1/N-wide column, so its center
  // is `50%/N` in from either edge — inset the connecting line by the same
  // amount on both sides so it runs exactly from the first circle's center
  // to the last one's.
  const edgeInset = 50 / titles.length;

  return (
    <nav aria-label={copy.progressLabel}>
      <div className="sm:hidden">
        <p className="text-[14px] font-medium text-muted-foreground">
          <span className="font-semibold text-primary">{copy.stepProgress(currentIndex + 1, titles.length)}</span>
          <span aria-hidden="true"> · </span>
          <span className="text-foreground">{titles[currentIndex]}</span>
        </p>
        <div className="mt-2.5 h-2 overflow-hidden rounded-pill bg-muted" aria-hidden="true">
          <div
            className="h-full rounded-pill bg-primary transition-[width] duration-300 ease-out"
            style={{ width: progress }}
          />
        </div>
      </div>

      <div className="relative hidden sm:block">
        <div
          className="absolute top-6 h-px bg-border"
          style={{ left: `${edgeInset}%`, right: `${edgeInset}%` }}
          aria-hidden="true"
        />

        <ol className="relative grid sm:gap-2" style={{ gridTemplateColumns: `repeat(${titles.length}, minmax(0, 1fr))` }}>
          {titles.map((title, index) => {
            const current = index === currentIndex;
            const completed = index < currentIndex;
            const reachable = index <= furthestIndex && !current;
            const content = (
              <>
                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-pill text-[14px] font-semibold transition-colors duration-200",
                    current && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                    !current && completed && "bg-primary/15 text-primary",
                    !current && !completed && reachable && "bg-secondary text-secondary-foreground",
                    !current && !completed && !reachable && "border border-border bg-surface text-muted-foreground",
                  )}
                >
                  {completed ? <CheckIcon className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-[13px] leading-tight",
                    current ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {title}
                </span>
              </>
            );
            const itemClassName = "flex w-full flex-col items-center gap-2 rounded-md px-1 py-2 text-center";

            return (
              <li key={title}>
                {reachable ? (
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    className={cn(
                      itemClassName,
                      "transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    {content}
                  </button>
                ) : (
                  <span aria-current={current ? "step" : undefined} className={itemClassName}>
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
