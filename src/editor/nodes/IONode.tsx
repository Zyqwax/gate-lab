import React, { useRef, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getSignalColor, isBusSignal, busToString, busToNumber } from '../../engine/signal';
import { Plus, Minus } from 'lucide-react';

export const IONode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const compType = (data?.type as string) || 'SWITCH';
  const params = (data?.params as any) || {};
  const label = params.label || compType;

  const toggleSwitch = useCircuitStore((state) => state.toggleSwitch);
  const setButtonPressed = useCircuitStore((state) => state.setButtonPressed);
  const updateComponentParams = useCircuitStore((state) => state.updateComponentParams);
  const pinValues = useCircuitStore((state) => state.simResult.pinValues);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  const isMultiOutput = compType === 'DIP_SWITCH_4' || compType === 'DECIMAL_INPUT';
  const isBusOutput = compType === 'DIP_SWITCH_8' || compType === 'BYTE_INPUT';
  const outSignal = pinValues[`${id}:out`] ?? (compType === 'CONST_HIGH' ? 1 : 0);
  const isHigh = outSignal === 1;

  // Push Button timing & gesture handling (supports hold and single-click pulse on touch & mouse)
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPointerDownRef = useRef(false);
  const pressStartTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);

  const handleButtonPressStart = useCallback(
    (e?: React.SyntheticEvent) => {
      if (e) {
        e.stopPropagation();
      }
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = null;
      }
      isPointerDownRef.current = true;
      pressStartTimeRef.current = Date.now();
      setButtonPressed(id, true);
    },
    [id, setButtonPressed]
  );

  const handleButtonPressEnd = useCallback(
    (e?: React.SyntheticEvent) => {
      if (e) {
        e.stopPropagation();
      }
      isPointerDownRef.current = false;
      const elapsed = Date.now() - pressStartTimeRef.current;
      // Guarantee a minimum pulse duration of 220ms so a quick click / tap ("tek basım")
      // produces a clearly visible signal on the canvas wires and downstream LEDs,
      // while releasing immediately if the user was holding it for longer.
      const remaining = Math.max(0, 220 - elapsed);
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
      if (remaining > 0) {
        pulseTimeoutRef.current = setTimeout(() => {
          if (!isPointerDownRef.current) {
            setButtonPressed(id, false);
          }
        }, remaining);
      } else {
        setButtonPressed(id, false);
      }
    },
    [id, setButtonPressed]
  );

  // DIP Switch 4-bit state: params.bits = [b0, b1, b2, b3] (0=LSB, 3=MSB)
  const dipBits: number[] = Array.isArray(params.bits) ? params.bits : [0, 0, 0, 0];
  const toggleDipBit = (index: number) => {
    const nextBits = [...dipBits];
    while (nextBits.length < 4) nextBits.push(0);
    nextBits[index] = nextBits[index] === 1 ? 0 : 1;
    updateComponentParams(id, { bits: nextBits });
  };
  const dipDecVal =
    (dipBits[3] === 1 ? 8 : 0) +
    (dipBits[2] === 1 ? 4 : 0) +
    (dipBits[1] === 1 ? 2 : 0) +
    (dipBits[0] === 1 ? 1 : 0);

  // DIP Switch 8-bit state: params.bits = [b0..b7] (0=LSB, 7=MSB)
  const dip8Bits: number[] = Array.isArray(params.bits) ? params.bits : [0, 0, 0, 0, 0, 0, 0, 0];
  const toggleDip8Bit = (index: number) => {
    const nextBits = [...dip8Bits];
    while (nextBits.length < 8) nextBits.push(0);
    nextBits[index] = nextBits[index] === 1 ? 0 : 1;
    updateComponentParams(id, { bits: nextBits });
  };
  const dip8DecVal = dip8Bits.reduce((acc, bit, i) => acc + (bit === 1 ? (1 << i) : 0), 0);

  // Byte Input state (0..255)
  const byteInputVal = Math.max(0, Math.min(255, Number(params.value) || 0));
  const changeByteInput = (delta: number) => {
    const next = Math.max(0, Math.min(255, byteInputVal + delta));
    updateComponentParams(id, { value: next });
  };

  // Decimal Input state
  const decInputVal = Math.max(0, Math.min(15, Number(params.value) || 0));
  const changeDecInput = (delta: number) => {
    const next = Math.max(0, Math.min(15, decInputVal + delta));
    updateComponentParams(id, { value: next });
  };
  const decBinStr = decInputVal.toString(2).padStart(4, '0');

  // Badge text for header
  let badgeText: string = String(outSignal);
  if (isMultiOutput) {
    badgeText = compType === 'DIP_SWITCH_4' ? `DEC: ${dipDecVal}` : `VAL: ${decInputVal}`;
  } else if (compType === 'DIP_SWITCH_8') {
    badgeText = `0x${dip8DecVal.toString(16).toUpperCase().padStart(2, '0')}`;
  } else if (compType === 'BYTE_INPUT') {
    badgeText = `0x${byteInputVal.toString(16).toUpperCase().padStart(2, '0')}`;
  } else if (isBusSignal(outSignal)) {
    badgeText = busToString(outSignal, 'hex');
  }

  return (
    <div
      className={`relative rounded-xl border bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl transition-all duration-150 ${
        compType === 'DIP_SWITCH_8'
          ? 'min-w-[270px]'
          : compType === 'BYTE_INPUT'
          ? 'min-w-[210px]'
          : isMultiOutput
          ? 'min-w-[190px]'
          : 'min-w-[120px]'
      } ${
        selected
          ? 'border-sky-400 ring-2 ring-sky-500/30 shadow-sky-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-800/80 pb-1">
        <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-300 truncate max-w-[110px]">
          {label}
        </span>
        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
            isBusOutput
              ? 'bg-sky-950 text-sky-400 border border-sky-800'
              : !isMultiOutput && isHigh
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {badgeText}
        </span>
      </div>

      <div className="flex items-center justify-center my-1">
        {compType === 'SWITCH' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSwitch(id);
            }}
            className={`nodrag nopan select-none touch-none w-14 h-7 rounded-full p-1 transition-colors duration-200 flex items-center shadow-inner cursor-pointer ${
              isHigh ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold ${
                isHigh ? 'translate-x-7 text-emerald-600' : 'translate-x-0 text-slate-600'
              }`}
            >
              {isHigh ? '1' : '0'}
            </div>
          </button>
        )}

        {compType === 'BUTTON' && (
          <button
            type="button"
            className={`nodrag nopan select-none touch-none w-12 h-12 rounded-full border-2 font-mono font-bold text-xs shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center cursor-pointer ${
              params.pressed || isHigh
                ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-500/50 scale-95'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-750'
            }`}
            onPointerDown={(e) => {
              e.stopPropagation();
              try {
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              } catch {}
              handleButtonPressStart(e);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {}
              handleButtonPressEnd(e);
            }}
            onPointerCancel={(e) => {
              e.stopPropagation();
              handleButtonPressEnd(e);
            }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleButtonPressStart(e);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleButtonPressEnd(e);
              }
            }}
          >
            <span>PUSH</span>
            <span className="text-[8px] font-mono opacity-80 leading-none mt-0.5">
              {params.pressed || isHigh ? '1' : '0'}
            </span>
          </button>
        )}

        {compType === 'CLOCK' && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">
            <div
              className={`w-3.5 h-3.5 rounded-full border transition-all shrink-0 ${
                isHigh
                  ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#10b981]'
                  : 'bg-slate-700 border-slate-600'
              }`}
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="50"
                step="0.5"
                value={params.frequency ?? 1}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateComponentParams(id, {
                    frequency: isNaN(val) ? 1 : Math.max(0.1, Math.min(50, val)),
                  });
                }}
                className="nodrag nopan w-12 px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs font-bold text-center focus:outline-none focus:border-emerald-500 transition-colors cursor-text"
                title="Saat Frekansı (Hz)"
              />
              <span className="text-[10px] font-mono font-bold text-slate-400 select-none">
                Hz
              </span>
            </div>
          </div>
        )}

        {compType === 'CONST_HIGH' && (
          <div className="px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-mono text-xs font-bold">
            +5V (HIGH)
          </div>
        )}

        {compType === 'CONST_LOW' && (
          <div className="px-3 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-xs font-bold">
            0V (GND)
          </div>
        )}

        {/* Manual Step Clock Pulse Button */}
        {compType === 'MANUAL_CLOCK' && (
          <button
            type="button"
            className="nodrag nopan select-none touch-none px-3.5 py-2 rounded-xl bg-slate-800 border-2 border-sky-500/60 hover:border-sky-400 hover:bg-slate-750 active:scale-95 text-sky-400 font-mono font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            onClick={(e) => {
              e.stopPropagation();
              updateComponentParams(id, { high: true });
              setTimeout(() => {
                updateComponentParams(id, { high: false });
              }, 120);
            }}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                params.high
                  ? 'bg-sky-400 border-white shadow-[0_0_8px_#38bdf8]'
                  : 'bg-slate-700 border-slate-600'
              }`}
            />
            <span>STEP CLK ⤊</span>
          </button>
        )}

        {/* 8-Bit DIP Switch interactive display */}
        {compType === 'DIP_SWITCH_8' && (
          <div className="flex flex-col gap-1.5 w-full py-0.5">
            <div className="flex items-center gap-1 justify-center bg-slate-950 p-2 rounded-lg border border-slate-800">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
                const isActive = dip8Bits[bitIdx] === 1;
                return (
                  <button
                    key={bitIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDip8Bit(bitIdx);
                    }}
                    className={`nodrag nopan select-none touch-none flex flex-col items-center justify-center w-7 h-12 rounded border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                    }`}
                    title={`Bit ${bitIdx} (${1 << bitIdx})`}
                  >
                    <span className="text-[7px] font-mono font-bold leading-none mb-1">
                      {bitIdx}
                    </span>
                    <div
                      className={`w-3.5 h-5 rounded-sm flex items-center justify-center font-mono font-black text-[11px] ${
                        isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {isActive ? '1' : '0'}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-1 text-[9px] font-mono text-slate-400">
              <span>HEX: 0x{dip8DecVal.toString(16).toUpperCase().padStart(2, '0')}</span>
              <span className="text-emerald-400 font-bold">DEC: {dip8DecVal}</span>
            </div>
          </div>
        )}

        {/* 8-Bit Byte Input interactive display */}
        {compType === 'BYTE_INPUT' && (
          <div className="flex flex-col gap-1.5 w-full py-0.5">
            <div className="flex items-center justify-center gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeByteInput(-10);
                }}
                disabled={byteInputVal <= 0}
                className="nodrag nopan px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px] font-mono text-slate-300 cursor-pointer"
                title="-10"
              >
                -10
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeByteInput(-1);
                }}
                disabled={byteInputVal <= 0}
                className="nodrag nopan w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 flex items-center justify-center cursor-pointer"
                title="-1"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="w-16 h-10 flex flex-col items-center justify-center rounded bg-slate-900 border border-slate-800">
                <span className="font-mono text-lg font-black text-emerald-400 leading-none">
                  {byteInputVal}
                </span>
                <span className="text-[9px] font-mono text-sky-400 mt-0.5 leading-none">
                  0x{byteInputVal.toString(16).toUpperCase().padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeByteInput(1);
                }}
                disabled={byteInputVal >= 255}
                className="nodrag nopan w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 flex items-center justify-center cursor-pointer"
                title="+1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeByteInput(10);
                }}
                disabled={byteInputVal >= 255}
                className="nodrag nopan px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px] font-mono text-slate-300 cursor-pointer"
                title="+10"
              >
                +10
              </button>
            </div>
            <div className="flex items-center justify-between px-1 text-[9px] font-mono text-slate-400">
              <span>BIN: {byteInputVal.toString(2).padStart(8, '0')}</span>
              <span className="text-emerald-400 font-bold">8-Bit BUS</span>
            </div>
          </div>
        )}

        {/* 4-Bit DIP Switch interactive display */}
        {compType === 'DIP_SWITCH_4' && (
          <div className="flex items-center justify-between gap-3 w-full py-0.5">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-1.5 justify-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                {[3, 2, 1, 0].map((bitIdx) => {
                  const isActive = dipBits[bitIdx] === 1;
                  return (
                    <button
                      key={bitIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDipBit(bitIdx);
                      }}
                      className={`nodrag nopan select-none touch-none flex flex-col items-center justify-center w-8 h-12 rounded border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                      }`}
                      title={`Bit ${bitIdx} (${1 << bitIdx})`}
                    >
                      <span className="text-[8px] font-mono font-bold leading-none mb-1">
                        B{bitIdx}
                      </span>
                      <div
                        className={`w-4 h-5 rounded-sm flex items-center justify-center font-mono font-black text-xs ${
                          isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-900 text-slate-500'
                        }`}
                      >
                        {isActive ? '1' : '0'}
                      </div>
                      <span className="text-[7px] font-mono mt-0.5 opacity-80 leading-none">
                        {1 << bitIdx}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between px-1 text-[9px] font-mono text-slate-400">
                <span>BIN: {dipBits[3]}{dipBits[2]}{dipBits[1]}{dipBits[0]}</span>
                <span className="text-emerald-400 font-bold">= {dipDecVal}</span>
              </div>
            </div>

            {/* Right Handles for B3..B0 */}
            <div className="flex flex-col gap-1.5 -mr-3.5">
              {[
                { id: 'out3', label: 'B3', weight: '8' },
                { id: 'out2', label: 'B2', weight: '4' },
                { id: 'out1', label: 'B1', weight: '2' },
                { id: 'out0', label: 'B0', weight: '1' },
              ].map((pin) => {
                const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
                const isPinHigh = pinVal === 1;
                return (
                  <div key={pin.id} className="relative flex items-center justify-end">
                    <span
                      className={`text-[9px] font-mono font-bold mr-2 select-none ${
                        isPinHigh ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {pin.label}
                    </span>
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={pin.id}
                      className="!w-3 !h-3 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
                      style={{ backgroundColor: getSignalColor(pinVal) }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Decimal Input Generator interactive display */}
        {compType === 'DECIMAL_INPUT' && (
          <div className="flex items-center justify-between gap-3 w-full py-0.5">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeDecInput(-1);
                  }}
                  disabled={decInputVal <= 0}
                  className="nodrag nopan select-none touch-none w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                  title="-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-12 h-10 flex flex-col items-center justify-center rounded bg-slate-900 border border-slate-800">
                  <span className="font-mono text-xl font-black text-emerald-400 leading-none">
                    {decInputVal}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5 leading-none">
                    0x{decInputVal.toString(16).toUpperCase()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeDecInput(1);
                  }}
                  disabled={decInputVal >= 15}
                  className="nodrag nopan select-none touch-none w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                  title="+1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between px-1 text-[9px] font-mono text-slate-400">
                <span>BIN: {decBinStr}</span>
                <span className="text-emerald-400 font-bold">4-Bit</span>
              </div>
            </div>

            {/* Right Handles for B3..B0 */}
            <div className="flex flex-col gap-1.5 -mr-3.5">
              {[
                { id: 'out3', label: 'B3', weight: '8' },
                { id: 'out2', label: 'B2', weight: '4' },
                { id: 'out1', label: 'B1', weight: '2' },
                { id: 'out0', label: 'B0', weight: '1' },
              ].map((pin) => {
                const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
                const isPinHigh = pinVal === 1;
                return (
                  <div key={pin.id} className="relative flex items-center justify-end">
                    <span
                      className={`text-[9px] font-mono font-bold mr-2 select-none ${
                        isPinHigh ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {pin.label}
                    </span>
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={pin.id}
                      className="!w-3 !h-3 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
                      style={{ backgroundColor: getSignalColor(pinVal) }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle for single-output IO nodes */}
      {!isMultiOutput && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -right-[7px] flex items-center">
          {isBusOutput && (
            <span className="text-[8px] font-mono font-bold text-sky-400 mr-2.5 select-none pointer-events-none">
              [7:0]
            </span>
          )}
          <Handle
            type="source"
            position={Position.Right}
            id="out"
            className={`${
              isBusOutput ? '!w-4 !h-4 !rounded-md' : '!w-3.5 !h-3.5 !rounded-full'
            } !border-2 !border-slate-900 hover:!scale-125 !transition-transform`}
            style={{ backgroundColor: getSignalColor(outSignal) }}
          />
        </div>
      )}

      {selected && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(id);
          }}
          className="nodrag nopan select-none touch-none absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-md cursor-pointer"
          title="Sil"
        >
          ×
        </button>
      )}
    </div>
  );
};
