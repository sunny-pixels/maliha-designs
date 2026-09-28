"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Diameter in px. */
  size?: number;
};

/**
 * Circular cursor that inverts whatever's beneath it (mix-blend-mode:
 * difference) and eases toward the pointer instead of tracking it 1:1,
 * replacing the native cursor. Target position is kept in a ref (not
 * state) so mousemove never triggers a re-render — only `visible`
 * (entering/leaving the window) does.
 */
export function Cursor({ size = 60 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -size, y: -size });
  const current = useRef({ x: -size, y: -size });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const animate = () => {
      const el = ref.current;
      if (el) {
        current.current.x += (target.current.x - current.current.x) * 0.2;
        current.current.y += (target.current.y - current.current.y) * 0.2;
        el.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }
      frame = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      setVisible(true);
      target.current = { x: e.clientX - size / 2, y: e.clientY - size / 2 };
    };
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.body.style.cursor = "none";
    frame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(frame);
      document.body.style.cursor = "";
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#fff",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
        willChange: "transform",
      }}
    />
  );
}
