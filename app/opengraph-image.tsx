import { ImageResponse } from "next/og";

export const alt =
  "Performance Interpreting — The UK and Ireland's largest, award-winning BSL & ISL provider for live events.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #020142 0%, #060F2E 60%, #0A1A4F 100%)",
          padding: "80px 88px",
          color: "white",
          fontFamily: '"Georgia", serif',
        }}
      >
        {/* Top eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.32em",
            color: "#EAB308",
            textTransform: "uppercase",
          }}
        >
          BSL &amp; ISL for Live Events
        </div>

        {/* Centre block */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              marginBottom: 28,
            }}
          >
            Performance Interpreting
          </div>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.3,
              maxWidth: 980,
              fontFamily: '"Helvetica", sans-serif',
            }}
          >
            The UK and Ireland&rsquo;s largest, award-winning performance
            interpreting provider. Festivals, sport, arenas, broadcast and
            beyond.
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(255,255,255,0.55)",
            fontFamily: '"Helvetica", sans-serif',
            letterSpacing: "0.04em",
          }}
        >
          <span>performanceinterpreting.co.uk</span>
          <span style={{ color: "rgba(234, 179, 8, 0.7)" }}>
            Signature Hall of Fame
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
