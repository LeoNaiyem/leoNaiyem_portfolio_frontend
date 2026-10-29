import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/api";
import { FALLBACK_NAME, SITE_URL } from "@/lib/site";

export const alt = "Naiyem, web developer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const settings = await getSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#edf2f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", width: 120, height: 12, borderRadius: 6, background: "#ec3600" }} />
        <div style={{ display: "flex", marginTop: 40, fontSize: 96, fontWeight: 800, color: "#030303" }}>
          {settings.name ?? FALLBACK_NAME}
        </div>
        {settings.title && (
          <div style={{ display: "flex", marginTop: 16, fontSize: 44, color: "#ec3600", textTransform: "uppercase" }}>
            {settings.title}
          </div>
        )}
        <div style={{ display: "flex", marginTop: "auto", fontSize: 28, color: "#6b7688" }}>
          {new URL(SITE_URL).host}
        </div>
      </div>
    ),
    size,
  );
}
