import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

export function Aurora() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // softer, fewer orbs — premium feels deliberate, not busy
  return (
    <div className="backdrop" aria-hidden="true">
      <motion.div
        className="orb"
        style={{
          width: 780, height: 780,
          top: -240, left: -160,
          background: `radial-gradient(circle, ${isLight ? "#b18cff" : "#9b6fff"} 0%, transparent 60%)`,
        }}
        animate={{ x: [0, 40, 0], y: [0, -22, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 44, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb"
        style={{
          width: 720, height: 720,
          top: "10%", right: -220,
          background: `radial-gradient(circle, ${isLight ? "#ff5d8a" : "#ff4d7d"} 0%, transparent 60%)`,
        }}
        animate={{ x: [0, -30, 0], y: [0, 26, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 50, repeat: Infinity, ease: "easeInOut", delay: -12 }}
      />
      <motion.div
        className="orb"
        style={{
          width: 660, height: 660,
          bottom: -260, left: "38%",
          background: `radial-gradient(circle, ${isLight ? "#4dd2ff" : "#3ec5ff"} 0%, transparent 60%)`,
          opacity: isLight ? 0.15 : 0.32,
        }}
        animate={{ x: [0, 36, 0], y: [0, -16, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 48, repeat: Infinity, ease: "easeInOut", delay: -22 }}
      />
      <div className="mesh" />
      <div className="vignette" />
    </div>
  );
}
