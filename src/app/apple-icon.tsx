import { ImageResponse } from "next/og";

// Apple touch icon — Google Search ham bunga murojaat qiladi.
// Yumaloq kesish uchun logo katta padding bilan markazda joylashtirilgan,
// shunda doiraga to'liq sig'adi (qirralari kesilmaydi).

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // Logo o'lchami — square diagonali (rotated) 80px = doira (90px radius) ichiga sig'adi.
  // Padding 30% atrofida.
  const SQ = 56;          // har bir kvadrat tomoni
  const OFFSET = 12;      // stack offset

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#16181a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Eng orqa kvadrat (eng oqaribroq) */}
        <div
          style={{
            position: "absolute",
            width: SQ,
            height: SQ,
            background: "#7ea2d4",
            opacity: 0.2,
            transform: `translateX(-${OFFSET}px) rotate(45deg)`,
            borderRadius: 5,
          }}
        />
        {/* O'rta kvadrat */}
        <div
          style={{
            position: "absolute",
            width: SQ,
            height: SQ,
            background: "#7ea2d4",
            opacity: 0.5,
            transform: "rotate(45deg)",
            borderRadius: 5,
          }}
        />
        {/* Old kvadrat (to'liq rang) */}
        <div
          style={{
            position: "absolute",
            width: SQ,
            height: SQ,
            background: "#7ea2d4",
            transform: `translateX(${OFFSET}px) rotate(45deg)`,
            borderRadius: 5,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
