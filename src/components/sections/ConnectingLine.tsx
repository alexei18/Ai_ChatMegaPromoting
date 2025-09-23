"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface ConnectingLineProps {
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  containerRef: React.RefObject<HTMLElement>;
  isActive: boolean;
  cornerPreference?: 'horizontal-first' | 'vertical-first';
  cornerRadius?: number;
}

const ConnectingLine: React.FC<ConnectingLineProps> = ({
  fromRef,
  toRef,
  containerRef,
  isActive,
  cornerPreference = 'horizontal-first',
  cornerRadius = 10,
}) => {
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (fromRef.current && toRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const endX = toRect.left + toRect.width / 2 - containerRect.left;
      const endY = toRect.top + toRect.height / 2 - containerRect.top;

      const tolerance = 1;
      const isAlignedHorizontally = Math.abs(startY - endY) < tolerance;
      const isAlignedVertically = Math.abs(startX - endX) < tolerance;

      if (isAlignedHorizontally || isAlignedVertically) {
        setPath(`M ${startX} ${startY} L ${endX} ${endY}`);
      } else {
        const corner = cornerPreference === 'horizontal-first' ? { x: endX, y: startY } : { x: startX, y: endY };
        
        const pathData = [
          `M ${startX} ${startY}`, // Move to start
        ];

        if (cornerPreference === 'horizontal-first') {
          const point1X = endX - cornerRadius * Math.sign(endX - startX);
          pathData.push(`L ${point1X} ${startY}`); // Line to before corner
          pathData.push(`Q ${corner.x} ${corner.y} ${corner.x} ${corner.y + cornerRadius * Math.sign(endY - startY)}`); // Curve at corner
        } else { // vertical-first
          const point1Y = endY - cornerRadius * Math.sign(endY - startY);
          pathData.push(`L ${startX} ${point1Y}`); // Line to before corner
          pathData.push(`Q ${corner.x} ${corner.y} ${corner.x + cornerRadius * Math.sign(endX - startX)} ${corner.y}`); // Curve at corner
        }
        
        pathData.push(`L ${endX} ${endY}`); // Line to end
        setPath(pathData.join(' '));
      }
    }
  }, [fromRef, toRef, containerRef, cornerPreference, cornerRadius]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <motion.path
        d={path}
        stroke="url(#grad-line-dynamic)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isActive ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      />
    </svg>
  );
};

export default ConnectingLine;