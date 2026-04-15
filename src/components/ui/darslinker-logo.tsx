export function DarslinkerLogo({ size = 32 }: { size?: number }) {
  const layerSize = size * 0.7;
  const radius = size * 0.15;
  const offset = size * 0.15;

  return (
    <div className="dl-logo dl-anim" style={{ width: size, height: size, position: "relative" }}>
      <div
        className="dl-layer dl-back"
        style={{
          position: "absolute",
          width: layerSize,
          height: layerSize,
          borderRadius: radius,
          background: "#7ea2d4",
          top: "50%",
          marginTop: -layerSize / 2,
          left: 0,
          opacity: 0.2,
          transform: "rotate(45deg)",
        }}
      />
      <div
        className="dl-layer dl-mid"
        style={{
          position: "absolute",
          width: layerSize,
          height: layerSize,
          borderRadius: radius,
          background: "#7ea2d4",
          top: "50%",
          marginTop: -layerSize / 2,
          left: offset,
          opacity: 0.5,
          transform: "rotate(45deg)",
        }}
      />
      <div
        className="dl-layer dl-front"
        style={{
          position: "absolute",
          width: layerSize,
          height: layerSize,
          borderRadius: radius,
          background: "#7ea2d4",
          top: "50%",
          marginTop: -layerSize / 2,
          left: offset * 2,
          opacity: 1,
          transform: "rotate(45deg)",
        }}
      />
      <style>{`
        @keyframes dl-rot-f { 0%,100%{transform:rotate(45deg)} 4.5%{transform:rotate(135deg)} 9%{transform:rotate(45deg)} }
        @keyframes dl-rot-m { 0%,100%{transform:rotate(45deg)} 5%{transform:rotate(130deg)} 9.5%{transform:rotate(45deg)} }
        @keyframes dl-rot-b { 0%,100%{transform:rotate(45deg)} 5.5%{transform:rotate(125deg)} 10%{transform:rotate(45deg)} }
        .dl-anim .dl-front { animation: dl-rot-f 8s ease-in-out infinite; }
        .dl-anim .dl-mid   { animation: dl-rot-m 8s ease-in-out infinite 0.06s; }
        .dl-anim .dl-back  { animation: dl-rot-b 8s ease-in-out infinite 0.12s; }
      `}</style>
    </div>
  );
}
