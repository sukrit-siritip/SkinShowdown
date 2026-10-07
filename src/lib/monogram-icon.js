import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export async function monogramIcon({ width, height }) {
  const font = await readFile(
    join(process.cwd(), "src/assets/cinzel-black-s.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0e12",
        color: "#e0a92a",
        fontFamily: "Cinzel",
        fontSize: height * 0.86,
        lineHeight: 1,
        paddingBottom: height * 0.04,
      }}
    >
      S
    </div>,
    {
      width,
      height,
      fonts: [{ name: "Cinzel", data: font, weight: 900, style: "normal" }],
    },
  );
}
