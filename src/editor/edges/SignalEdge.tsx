import React, { useState } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getSignalColor, getSignalGlow } from '../../engine/signal';

export const SignalEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const wireSignal = useCircuitStore((state) => state.simResult.wireValues[id] ?? 'Z');
  const editorMode = useCircuitStore((state) => state.editorMode);
  const removeWire = useCircuitStore((state) => state.removeWire);

  const [isHovered, setIsHovered] = useState(false);
  const isCutMode = editorMode === 'cut';

  const color = getSignalColor(wireSignal);
  const glow = getSignalGlow(wireSignal);
  const isHigh = wireSignal === 1;

  const handleCut = (e: React.SyntheticEvent) => {
    if (isCutMode) {
      e.stopPropagation();
      removeWire(id);
    }
  };

  return (
    <g
      className={`group ${isCutMode ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background thicker glow / selection / cut highlight */}
      <path
        d={edgePath}
        fill="none"
        stroke={isCutMode && isHovered ? '#f43f5e' : selected ? '#38bdf8' : color}
        strokeWidth={isCutMode && isHovered ? 8 : selected ? 6 : isHigh ? 4 : 2.5}
        strokeOpacity={isCutMode && isHovered ? 0.8 : selected ? 0.9 : isHigh ? 0.4 : 0.2}
        style={{ filter: isCutMode && isHovered ? 'drop-shadow(0 0 8px #f43f5e)' : glow }}
        className="transition-all duration-150"
      />

      {/* Main Signal Wire */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isCutMode && isHovered ? '#f43f5e' : selected ? '#38bdf8' : color,
          strokeWidth: isCutMode && isHovered ? 3.5 : selected ? 3 : isHigh ? 2.5 : 2,
          strokeDasharray: isCutMode && !isHovered ? '5, 5' : undefined,
          filter: isCutMode && isHovered ? 'drop-shadow(0 0 6px #f43f5e)' : glow,
          transition: 'stroke 0.15s ease',
        }}
      />

      {/* High Signal Flowing Animation (when not in cut-hover) */}
      {isHigh && (!isCutMode || !isHovered) && (
        <path
          d={edgePath}
          fill="none"
          stroke="#a7f3d0"
          strokeWidth={1.5}
          strokeDasharray="4, 10"
          className="animate-[dash_1s_linear_infinite] pointer-events-none"
        />
      )}

      {/* Generous Hit-Area for Easy Touch and Click Cutting */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={isCutMode ? 28 : 16}
        className={isCutMode ? 'cursor-pointer' : 'cursor-pointer'}
        style={{ pointerEvents: 'stroke' }}
        onClick={handleCut}
        onTouchStart={handleCut}
        onPointerDown={(e) => {
          if (isCutMode) {
            handleCut(e);
          }
        }}
        onPointerEnter={(e) => {
          // Swipe to cut: if mouse button is held down while crossing wire in cut mode
          if (isCutMode && e.buttons === 1) {
            handleCut(e);
          }
        }}
      />
    </g>
  );
};
