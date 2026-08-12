import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const directions = [
  { at: 0, index: 0 },
  { at: 38, index: 4 },
  { at: 76, index: 5 },
  { at: 110, index: 7 },
  { at: 145, index: 9 },
  { at: 178, index: 11 },
  { at: 210, index: 1 },
  { at: 250, index: 0 },
];

const cursorPath = [
  { at: 0, x: 1510, y: 190 },
  { at: 34, x: 1054, y: 355 },
  { at: 66, x: 980, y: 288 },
  { at: 100, x: 905, y: 380 },
  { at: 133, x: 980, y: 450 },
  { at: 164, x: 1080, y: 420 },
  { at: 195, x: 1050, y: 305 },
  { at: 228, x: 985, y: 370 },
  { at: 278, x: 970, y: 850 },
  { at: 336, x: 1045, y: 660 },
  { at: 392, x: 1160, y: 678 },
  { at: 446, x: 1270, y: 690 },
  { at: 530, x: 1285, y: 760 },
];

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const PortraitFrame = ({ index, size = 182 }: { index: number; size?: number }) => {
  const column = index % 4;
  const row = Math.floor(index / 4);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        background: "#e8e7e4",
      }}
    >
      <Img
        src={staticFile("profile/portrait-directions.webp")}
        style={{
          width: "400%",
          height: "400%",
          maxWidth: "none",
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(${-column * 25}%, ${-row * 25}%)`,
        }}
      />
    </div>
  );
};

const Pointer = ({ frame }: { frame: number }) => {
  const x = interpolate(frame, cursorPath.map((point) => point.at), cursorPath.map((point) => point.x), {
    ...clamp,
    easing: easeOut,
  });
  const y = interpolate(frame, cursorPath.map((point) => point.at), cursorPath.map((point) => point.y), {
    ...clamp,
    easing: easeOut,
  });
  const click = interpolate(frame, [272, 278, 285, 523, 530, 537], [0, 1, 0, 0, 1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 30,
        scale: 1 - click * 0.12,
        filter: "drop-shadow(0 5px 5px rgba(0,0,0,.28))",
      }}
    >
      <svg width="48" height="62" viewBox="0 0 48 62" fill="none">
        <path d="M5 3 43 31 26 35l-8 20L5 3Z" fill="#fdfcf8" stroke="#151515" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 11,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "2px solid rgba(30, 30, 30, .45)",
          opacity: click,
          scale: 1 + click * 1.2,
        }}
      />
    </div>
  );
};

const Accordion = ({ label, open, children }: { label: string; open?: boolean; children?: React.ReactNode }) => (
  <div style={{ borderTop: "1px solid #e1e0dc", padding: "15px 0", color: "#3a3936" }}>
    <div style={{ display: "flex", gap: 12, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>
      <span style={{ color: "#8c8a84" }}>{open ? "⌄" : "›"}</span>
      {label.toUpperCase()}
    </div>
    {children}
  </div>
);

const HelpCharacter = ({ frame }: { frame: number }) => {
  const local = Math.max(0, frame - 310);
  const topic = local < 80 ? "code" : local < 160 ? "curious" : "patterns";
  const sprite = topic === "code" ? "help-code-sequence.png" : topic === "curious" ? "help-curious-sequence.png" : "help-patterns-sequence.png";
  const frameInTopic = Math.min(7, Math.max(0, Math.floor((local % 80) / 10)));
  const col = frameInTopic % 4;
  const row = Math.floor(frameInTopic / 4);
  const label = topic === "code" ? "I code with AI" : topic === "curious" ? "I stay curious" : "I decode viral patterns";
  const subline = topic === "code" ? "turning ideas into working websites" : topic === "curious" ? "asking sharper questions, testing faster" : "finding the signal in social attention";

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ width: 550, height: 550, position: "relative", overflow: "hidden", marginTop: -30 }}>
        <Img
          src={staticFile(`profile/${sprite}`)}
          style={{
            position: "absolute",
            width: "400%",
            height: "200%",
            maxWidth: "none",
            left: 0,
            top: 0,
            transform: `translate(${-col * 25}%, ${-row * 50}%)`,
          }}
        />
      </div>
      <div style={{ marginTop: -35, textAlign: "center" }}>
        <div style={{ fontFamily: "Georgia, serif", color: "#1c1b19", fontSize: 38, letterSpacing: "-0.035em" }}>{label}</div>
        <div style={{ color: "#77736b", fontSize: 15, letterSpacing: "0.02em", marginTop: 12 }}>{subline}</div>
      </div>
    </div>
  );
};

const HomePage = ({ frame }: { frame: number }) => {
  const directionIndex = Math.round(interpolate(frame, directions.map((point) => point.at), directions.map((point) => point.index), clamp));
  const openHelp = frame >= 286;
  const titleOpacity = interpolate(frame, [0, 18, 275, 292], [0, 1, 1, 0], { ...clamp, easing: easeOut });
  const helpOpacity = interpolate(frame, [286, 310], [0, 1], { ...clamp, easing: easeOut });
  const helpScale = interpolate(frame, [286, 310], [0.94, 1], { ...clamp, easing: easeOut });
  const homeOpacity = interpolate(frame, [280, 309], [1, 0], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#faf9f5" }}>
      <div style={{ position: "absolute", inset: 0, opacity: homeOpacity }}>
        <div style={{ position: "absolute", left: 90, top: 70, color: "#3d3b37", fontSize: 15, letterSpacing: "0.08em", fontWeight: 800 }}>SUHASSAI</div>
        <div style={{ position: "absolute", right: 90, top: 67, width: 34, height: 34, border: "1px solid #e3e0db", display: "grid", placeItems: "center", fontSize: 18, color: "#444" }}>◐</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 115, display: "flex", alignItems: "center", flexDirection: "column", opacity: titleOpacity }}>
          <PortraitFrame index={directionIndex} size={152} />
          <div style={{ fontFamily: "Georgia, serif", fontSize: 58, color: "#20201e", marginTop: 24, letterSpacing: "-0.045em" }}>Suhassai Masetty</div>
          <div style={{ color: "#76726c", fontSize: 16, marginTop: 14, letterSpacing: "0.01em" }}>I build with AI, stay curious, and decode attention.</div>
        </div>
        <div style={{ position: "absolute", left: 430, right: 430, top: 480, opacity: titleOpacity }}>
          <Accordion label="About" />
          <Accordion label="Experience" />
          <Accordion label="Selected work" />
          <Accordion label="Education" />
          <Accordion label="Links" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", opacity: titleOpacity }}>
          <div style={{ background: "#191918", color: "#fff", padding: "15px 22px", fontSize: 15, borderRadius: 3, fontWeight: 700 }}>How can I help?</div>
        </div>
        <div style={{ position: "absolute", left: 90, bottom: 62, color: "#87837c", fontSize: 14, letterSpacing: "0.06em" }}>INSTAGRAM&nbsp;&nbsp;&nbsp; LINKEDIN&nbsp;&nbsp;&nbsp; WHATSAPP</div>
      </div>
      {openHelp ? (
        <div style={{ position: "absolute", inset: 0, opacity: helpOpacity, scale: helpScale }}>
          <div style={{ position: "absolute", left: 74, top: 60, color: "#363430", fontSize: 34 }}>←</div>
          <HelpCharacter frame={frame} />
          <div style={{ position: "absolute", bottom: 72, left: 0, right: 0, textAlign: "center", color: "#55514b", fontSize: 15, letterSpacing: "0.1em" }}>WHATSAPP ME&nbsp;&nbsp; ↗</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const PortfolioMotionReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 200, mass: 0.8, stiffness: 90 } });
  const exit = interpolate(frame, [560, 620], [1, 0], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ background: "#171616", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 20% 15%, #e0d2ef 0, transparent 31%), radial-gradient(circle at 80% 75%, #768be7 0, transparent 37%), linear-gradient(130deg, #ba91d9 0%, #8d8ee0 47%, #425092 100%)",
          opacity: exit,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 92,
          bottom: 92,
          overflow: "hidden",
          borderRadius: 15,
          background: "#faf9f5",
          boxShadow: "0 38px 70px rgba(19, 18, 35, .42), 0 0 0 7px rgba(255,255,255,.44)",
          scale: 0.93 + entrance * 0.07,
          opacity: interpolate(frame, [0, 16, 620, 644], [0, 1, 1, 0], { ...clamp, easing: easeOut }),
        }}
      >
        <HomePage frame={frame} />
      </div>
      <Pointer frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 52,
          color: "rgba(255,255,255,.82)",
          fontSize: 16,
          letterSpacing: "0.16em",
          opacity: interpolate(frame, [0, 30, 590, 620], [0, 1, 1, 0], clamp),
        }}
      >
        INTERACTIVE PORTFOLIO
      </div>
      <div
        style={{
          position: "absolute",
          right: 76,
          bottom: 54,
          color: "rgba(255,255,255,.82)",
          fontSize: 16,
          letterSpacing: "0.1em",
          opacity: interpolate(frame, [540, 580, 610, 635], [0, 1, 1, 0], clamp),
        }}
      >
        suhassai.online
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return null;
};
