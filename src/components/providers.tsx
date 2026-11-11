"use client";

import { MotionConfig } from "motion/react";
import { ReactLenis } from "lenis/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {/* Scroll con inercia en escritorio; el táctil sigue nativo y Lenis se apaga solo con "reducir movimiento". */}
      <ReactLenis root options={{ lerp: 0.085, anchors: { offset: -88 }, stopInertiaOnNavigate: true }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
