import { ImageResponse } from "next/og";
import { profile } from "@/content/resume";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.role}`;

const BG = "#0b0c0e";
const SURFACE = "#121417";
const FG = "#ecedef";
const ACCENT = "#a5b3ff";
const MUTED = "#a0a4ad";

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
          color: FG,
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 52,
            width: 260,
            height: 260,
            borderRadius: 999,
            background: SURFACE,
            border: "2px solid #2c3039",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 360,
            height: 16,
            background: ACCENT,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            color: ACCENT,
            textTransform: "uppercase",
          }}
        >
          Full-stack product development
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              maxWidth: 980,
              display: "flex",
              fontSize: 118,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 0.95,
            }}
          >
            {profile.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 30 }}>
            <div style={{ display: "flex", fontSize: 34, color: ACCENT }}>{profile.role}</div>
            <div
              style={{
                display: "flex",
                maxWidth: 850,
                fontSize: 26,
                lineHeight: 1.35,
                color: MUTED,
              }}
            >
              {profile.offer}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", width: 240, height: 4, background: ACCENT }} />
      </div>
    ),
    size
  );
}
