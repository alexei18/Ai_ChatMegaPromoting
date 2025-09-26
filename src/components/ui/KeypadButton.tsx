'use client';

import React from 'react';

interface KeypadButtonProps {
  label: string;
  subLabel?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  ariaLabel: string;
  className?: string;
}

const KeypadButton = React.memo(function KeypadButton({
  label,
  subLabel,
  onClick,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  ariaLabel,
  className = '',
}: KeypadButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={`group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white ${className}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
      <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
        <span className="text-3xl font-medium leading-none drop-shadow">{label}</span>
        {subLabel && <span className="text-[10px] tracking-widest mt-1 text-white/75">{subLabel}</span>}
      </span>
    </button>
  );
});

export default KeypadButton;
