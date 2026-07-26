import { ImageResponse } from "next/og";
import { profile } from "@/content/resume";

// Next reuses this for twitter:image too, so there's no separate twitter-image file.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.roles[0]}`;

// Hex, not the CSS custom properties: ImageResponse resolves a Satori subset that has no var()
// support and no cascade to inherit them from.
const VOID = "#070c0c";
const CREAM = "#efe7d7";
const AMBER = "#ffb627";
const SAGE = "#7d908c";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: VOID,
          padding: 72,
          position: "relative",
        }}
      >
        {/* Same amber bloom as the hero spotlight, flattened to a radial gradient. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -160,
            width: 900,
            height: 900,
            background: `radial-gradient(circle, rgba(255,182,39,0.30) 0%, rgba(255,122,24,0.10) 45%, rgba(7,12,12,0) 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -320,
            right: -200,
            width: 760,
            height: 760,
            background: `radial-gradient(circle, rgba(47,158,147,0.22) 0%, rgba(7,12,12,0) 68%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: AMBER, display: "flex" }} />
          <div style={{ fontSize: 22, letterSpacing: 8, color: SAGE, textTransform: "uppercase" }}>
            {profile.availableForWork ? "Available for work" : "Portfolio"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1,
              color: CREAM,
              display: "flex",
            }}
          >
            {profile.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 28 }}>
            <div style={{ fontSize: 34, color: AMBER, display: "flex" }}>&gt;</div>
            <div style={{ fontSize: 34, color: CREAM, display: "flex" }}>
              {profile.roles.join("  ·  ")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", height: 4, background: AMBER, width: 240 }} />
      </div>
    ),
    size
  );
}
