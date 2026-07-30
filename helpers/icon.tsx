export function Icon({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}