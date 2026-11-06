"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { Wind } from "lucide-react";

export default function SteamCore({ active, compact = false }: { active: boolean; compact?: boolean }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 65, damping: 22 });
  const rotateX = useSpring(pointerY, { stiffness: 65, damping: 22 });

  return <div className={`steam-core ${compact ? "steam-core-compact" : ""} ${active ? "" : "steam-core-paused"}`}
    onPointerMove={event => {
      if (event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
      pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -12);
    }}
    onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
    <motion.div className="core-instrument" style={{ rotateX, rotateY, transformPerspective: 900 }} aria-hidden="true">
      <svg className="core-rings" viewBox="0 0 440 440" fill="none">
        <circle cx="220" cy="220" r="207" stroke="currentColor" strokeOpacity=".12" />
        <circle cx="220" cy="220" r="193" stroke="currentColor" strokeOpacity=".2" strokeDasharray="1 11" />
        <g className="core-orbit"><circle cx="220" cy="220" r="173" stroke="currentColor" strokeOpacity=".35" strokeDasharray="180 900" strokeWidth="1.5" /><circle cx="393" cy="220" r="4" fill="currentColor" /></g>
        <circle cx="220" cy="220" r="148" stroke="currentColor" strokeOpacity=".14" />
        <g className="core-orbit core-orbit-reverse"><circle cx="220" cy="220" r="125" stroke="currentColor" strokeOpacity=".45" strokeDasharray="80 40 5 660" /><circle cx="95" cy="220" r="2.5" fill="currentColor" /></g>
        <path d="M220 1v16m0 406v16M1 220h16m406 0h16" stroke="currentColor" strokeOpacity=".5" />
      </svg>
      <div className="core-center"><Wind strokeWidth={.8} /><span>ЖАР</span><small>THE ART OF STEAM</small></div>
      <span className="core-coordinate core-coordinate-top">BANYA / 01</span>
      <span className="core-coordinate core-coordinate-bottom">{active ? "RITUAL IN MOTION" : "A MOMENT OF STILLNESS"}</span>
    </motion.div>
    {!compact && <div className="core-caption"><span className="live-dot" /> A TRADITION. A DIFFERENT FREQUENCY.</div>}
  </div>;
}
