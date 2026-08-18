"use client";

import React, { ReactNode } from "react";

interface CRTContainerProps {
  children: ReactNode;
  crtEnabled: boolean;
}

export const CRTContainer: React.FC<CRTContainerProps> = ({ children, crtEnabled }) => {
  return (
    <div className={`min-h-screen relative bg-matrix-bg text-matrix-green overflow-x-hidden ${crtEnabled ? 'crt-rgb' : ''}`}>
      {/* CRT Scanline Overlay */}
      {crtEnabled && <div className="crt-overlay" aria-hidden="true" />}

      {/* CRT Vignette Shade */}
      {crtEnabled && <div className="crt-vignette" aria-hidden="true" />}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
