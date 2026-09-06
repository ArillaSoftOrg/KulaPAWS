interface AdminLoadingStateProps {
  label?: string;
}

// Single loading treatment reused across every admin form/list so waiting
// states look and behave the same everywhere (spinner + text, announced to
// assistive tech via aria-live rather than conveyed by appearance alone).
export function AdminLoadingState({ label = "Loading…" }: AdminLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 py-10 text-[14px] text-muted-foreground"
    >
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
