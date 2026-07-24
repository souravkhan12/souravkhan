/**
 * Monogram mark: an "S" drawn as a single geometric stroke — no ring, no box,
 * no font dependency. Deliberately quiet: it inherits the surrounding text
 * colour and only picks up the accent on hover, so it sits beside the
 * wordmark instead of competing with it.
 */
export function Logo({
  className = "",
  size = 26,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      role="img"
      aria-label="Sourav Khan logo"
    >
      <path
        d="M76 26C76 14 24 14 24 36C24 54 76 46 76 66C76 88 24 88 24 74"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
