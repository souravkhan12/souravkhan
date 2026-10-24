import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Palette lifted from styles/globals.css so cards match the site. */
const PAPER = "#fcfcf9";
const INK = "#181818";
const MUTED = "#909090";
const ACCENT = "#5b5bd6";
const HAIRLINE = "#e5e5e0";

/** Tint behind snippet panels — the OG equivalent of the site's gray-50. */
const PANEL = "#f4f4ef";

/** The S mark — same drawing as public/icon.svg and the navbar's BrandMark. */
function Mark({ size = 44 }: { size?: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect width="100" height="100" rx="42" fill={INK} />
      <g transform="translate(19 19) scale(0.62)">
        <path
          d="M76 26C76 14 24 14 24 36C24 54 76 46 76 66C76 88 24 88 24 74"
          fill="none"
          stroke={PAPER}
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Byline for every card's footer: the mark, the name, and optionally the photo. */
function Byline({ avatar }: { avatar?: string }): ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          width={56}
          height={56}
          alt=""
          style={{ borderRadius: 999, objectFit: "cover" }}
        />
      ) : (
        <Mark />
      )}
      <div style={{ display: "flex", color: INK, fontWeight: 600 }}>
        Sourav Khan
      </div>
    </div>
  );
}

/**
 * Social card for one quiz puzzle: the snippet *is* the hook, so it gets the
 * centre of the card instead of a headline. A card that shows the code gets
 * read and quoted; a card that shows "Guess the Output" gets scrolled past.
 *
 * No custom font is registered, so this deliberately styles a panel rather
 * than asking for `monospace` — Satori would silently fall back anyway, and
 * the tinted frame is what reads as "code" at thumbnail size.
 */
export function OgCodeCard({
  eyebrow,
  snippet,
  meta,
  avatar,
}: {
  eyebrow: string;
  snippet: string;
  meta?: string[];
  avatar?: string;
}): ReactElement {
  // Long snippets need to step down or they overflow the panel.
  const lines = snippet.split("\n");
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = longest > 56 || lines.length > 5 ? 30 : 38;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPER,
        padding: 72,
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 6, height: 30, background: ACCENT }} />
        <div
          style={{
            fontSize: 26,
            color: MUTED,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: PANEL,
          border: `1px solid ${HAIRLINE}`,
          padding: 36,
          fontSize,
          lineHeight: 1.45,
          color: INK,
          letterSpacing: -0.5,
        }}
      >
        {lines.map((line, i) => (
          // Satori has no `white-space: pre`, so each line is its own flex row
          // and leading indentation is re-added as explicit padding.
          <div
            key={i}
            style={{
              display: "flex",
              paddingLeft: (line.length - line.trimStart().length) * 12,
            }}
          >
            {line.trim() || " "}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 28,
          fontSize: 26,
          color: MUTED,
        }}
      >
        <Byline avatar={avatar} />
        {meta && meta.length > 0 && (
          <div style={{ display: "flex", gap: 14 }}>
            {meta.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14 }}>
                {i > 0 && <span style={{ color: HAIRLINE }}>·</span>}
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Shared social-card layout: hairline frame, accent tick, big title, and a
 * footer meta row. Keeps every OG image on the site visually identical.
 */
export function OgCard({
  eyebrow,
  title,
  meta,
  avatar,
}: {
  eyebrow: string;
  title: string;
  meta?: string[];
  /** A data: URL of the photo — only the homepage card uses it. */
  avatar?: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPER,
        padding: 72,
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 6, height: 30, background: ACCENT }} />
        <div
          style={{
            fontSize: 26,
            color: MUTED,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: title.length > 70 ? 62 : 76,
          lineHeight: 1.12,
          fontWeight: 700,
          letterSpacing: -2,
          color: INK,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 28,
          fontSize: 26,
          color: MUTED,
        }}
      >
        <Byline avatar={avatar} />
        {meta && meta.length > 0 && (
          <div style={{ display: "flex", gap: 14 }}>
            {meta.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14 }}>
                {i > 0 && <span style={{ color: HAIRLINE }}>·</span>}
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
