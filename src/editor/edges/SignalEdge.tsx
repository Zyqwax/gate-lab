import React from 'react';
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
  const color = getSignalColor(wireSignal);
  const glow = getSignalGlow(wireSignal);
  const isHigh = wireSignal === 1;

  return (
    <>
      {/* Background thicker hit-area / glow */}
      <path
        d={edgePath}
        fill="none"
        stroke={selected ? '#38bdf8' : color}
        strokeWidth={selected ? 6 : isHigh ? 4 : 2.5}
        strokeOpacity={selected ? 0.9 : isHigh ? 0.4 : 0.2}
        style={{ filter: glow }}
        className="transition-colors duration-150"
      />

      {/* Main Signal Wire */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#38bdf8' : color,
          strokeWidth: selected ? 3 : isHigh ? 2.5 : 2,
          filter: glow,
          transition: 'stroke 0.15s ease',
        }}
      />

      {/* High Signal Flowing Animation */}
      {isHigh && (
        <path
          d={edgePath}
          fill="none"
          stroke="#a7f3d0"
          strokeWidth={1.5}
          strokeDasharray="4, 10"
          className="animate-[dash_1s_linear_infinite]"
        />
      )}
    </>
  );
};
