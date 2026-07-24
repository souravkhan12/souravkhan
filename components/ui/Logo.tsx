/**
 * Vector rebuild of the "S" sunburst mark: a hairline ring with radial ticks
 * around a monogram. Uses currentColor so it inherits the theme (no baked-in
 * white background like the old raster) and stays crisp at any size.
 */
export function Logo({
  className = "",
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  const TICKS = 44;
  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
    const r1 = 35;
    const r2 = 42;
    return {
      x1: 50 + Math.cos(a) * r1,
      y1: 50 + Math.sin(a) * r1,
      x2: 50 + Math.cos(a) * r2,
      y2: 50 + Math.sin(a) * r2,
    };
  });

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
      {/* outer hairline ring */}
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="2" />
      {/* radial ticks just inside the ring */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>
      {/* monogram */}
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="42"
        fontWeight={700}
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        style={{ fontFeatureSettings: '"ss01"' }}
      >
        s
      </text>
    </svg>
  );
}
