import { ImageResponse } from "next/og";
import { profile } from "@/content/resume";

// Next reuses this for twitter:image too, so there's no separate twitter-image file.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.roles[0]}`;

// Hex, not the CSS custom properties: ImageResponse resolves a Satori subset that has no var()
// support and no cascade to inherit them from.
const BG = "#0a0a0a";
const FG = "#e9e9e4";
const AC = "#cdff57";
const MUTED = "#9a9a92";

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
          background: BG,
          padding: 72,
          position: "relative",
        }}
      >
        {/* Same accent bloom as the hero, flattened to a radial gradient. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -160,
            width: 900,
            height: 900,
            background: `radial-gradient(circle, rgba(205,255,87,0.26) 0%, rgba(205,255,87,0.08) 45%, rgba(10,10,10,0) 70%)`,
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
            background: `radial-gradient(circle, rgba(233,233,228,0.10) 0%, rgba(10,10,10,0) 68%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: AC, display: "flex" }} />
          <div style={{ fontSize: 22, letterSpacing: 8, color: MUTED, textTransform: "uppercase" }}>
            {profile.availability}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1,
              color: FG,
              display: "flex",
            }}
          >
            {profile.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 28 }}>
            <div style={{ fontSize: 34, color: AC, display: "flex" }}>&gt;</div>
            <div style={{ fontSize: 34, color: FG, display: "flex" }}>
              {profile.roles.join("  ·  ")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", height: 4, background: AC, width: 240 }} />
      </div>
    ),
    size
  );
}
