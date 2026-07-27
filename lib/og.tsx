import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Palette lifted from styles/globals.css so cards match the site. */
const PAPER = "#fcfcf9";
const INK = "#181818";
const MUTED = "#909090";
const ACCENT = "#5b5bd6";
const HAIRLINE = "#e5e5e0";

/**
 * Shared social-card layout: hairline frame, accent tick, big title, and a
 * footer meta row. Keeps every OG image on the site visually identical.
 */
export function OgCard({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: string[];
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
        <div style={{ display: "flex", color: INK, fontWeight: 600 }}>
          Sourav Khan
        </div>
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
