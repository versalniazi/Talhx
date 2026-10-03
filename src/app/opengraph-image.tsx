import { ImageResponse } from "next/og";

export const alt = "TALHX — Digital Marketing & SEO Services UK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#070b17",
          backgroundImage: "radial-gradient(circle at 15% 10%, #2140c4 0%, #070b17 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #3f6bff, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 6 }}>TALHX</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Digital Growth That Moves Your Business Forward
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
            SEO · Local SEO · Content · Social Media · Ads · Web — clear pricing from £15
          </div>
        </div>
      </div>
    ),
    size,
  );
}
