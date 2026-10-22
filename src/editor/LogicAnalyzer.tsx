'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useTranslation } from '../i18n';
import { formatSample, WaveformChannel, SampledValue } from '../engine/waveform';
import {
  Activity,
  Trash2,
  ZoomIn,
  ZoomOut,
  X,
  Play,
  Pause,
  Plus,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const LogicAnalyzer: React.FC = () => {
  const { t, locale } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const waveformEngine = useCircuitStore((state) => state.waveformEngine);
  const waveformTick = useCircuitStore((state) => state.waveformTick);
  const isAnalyzerOpen = useCircuitStore((state) => state.isAnalyzerOpen);
  const setAnalyzerOpen = useCircuitStore((state) => state.setAnalyzerOpen);
  const removeWaveformChannel = useCircuitStore((state) => state.removeWaveformChannel);
  const addWaveformChannel = useCircuitStore((state) => state.addWaveformChannel);
  const clearWaveform = useCircuitStore((state) => state.clearWaveform);
  const toggleWaveformRecording = useCircuitStore((state) => state.toggleWaveformRecording);
  const components = useCircuitStore((state) => state.components);

  const [zoomLevel, setZoomLevel] = useState<number>(20); // pixels per tick
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [hoverTick, setHoverTick] = useState<number | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Available signals from circuit components that can be added as channels
  const availableSignals = useMemo(() => {
    const list: { id: string; name: string; width: number; type: string }[] = [];
    for (const comp of components) {
      const label = comp.params.label || comp.type;
      if (comp.type === 'CLOCK') {
        list.push({ id: `comp:${comp.id}:out`, name: `${label} (CLK)`, width: 1, type: comp.type });
      } else if (comp.type === 'SWITCH' || comp.type === 'BUTTON') {
        list.push({ id: `comp:${comp.id}:out`, name: `${label} (OUT)`, width: 1, type: comp.type });
      } else if (comp.type === 'REGISTER_8') {
        list.push({ id: `comp:${comp.id}:q`, name: `${label} (Q[7:0])`, width: 8, type: comp.type });
        list.push({ id: `comp:${comp.id}:load`, name: `${label} (LOAD)`, width: 1, type: comp.type });
        list.push({ id: `comp:${comp.id}:clr`, name: `${label} (CLR)`, width: 1, type: comp.type });
      } else if (comp.type === 'ADDER_8') {
        list.push({ id: `comp:${comp.id}:s`, name: `${label} (S[7:0])`, width: 8, type: comp.type });
        list.push({ id: `comp:${comp.id}:cout`, name: `${label} (COUT)`, width: 1, type: comp.type });
        list.push({ id: `comp:${comp.id}:ovf`, name: `${label} (OVF)`, width: 1, type: comp.type });
      } else if (comp.type === 'BYTE_INPUT' || comp.type === 'BUS_CONST') {
        list.push({ id: `comp:${comp.id}:out`, name: `${label} (BUS)`, width: 8, type: comp.type });
      } else if (comp.type === 'D_FLIP_FLOP' || comp.type === 'D_FF_RESET' || comp.type === 'D_FF_ENABLE') {
        list.push({ id: `comp:${comp.id}:q`, name: `${label} (Q)`, width: 1, type: comp.type });
      } else if (comp.type === 'PROBE') {
        list.push({ id: `comp:${comp.id}:in`, name: `${label} (IN)`, width: 1, type: comp.type });
      } else {
        list.push({ id: `comp:${comp.id}:out`, name: `${label}`, width: 1, type: comp.type });
      }
    }
    return list;
  }, [components]);

  // Color palette for newly added channels
  const channelColors = ['#38bdf8', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4', '#84cc16'];

  const channels = waveformEngine.getAllChannels();

  // If no channels exist, automatically add CLOCK or primary components if available
  useEffect(() => {
    if (channels.length === 0 && components.length > 0) {
      const clk = components.find((c) => c.type === 'CLOCK');
      if (clk) {
        addWaveformChannel({
          id: `comp:${clk.id}:out`,
          name: clk.params.label || 'CLOCK',
          width: 1,
          color: '#38bdf8',
        });
      }
      const reg = components.find((c) => c.type === 'REGISTER_8');
      if (reg) {
        addWaveformChannel({
          id: `comp:${reg.id}:q`,
          name: reg.params.label || 'REG_Q[7:0]',
          width: 8,
          color: '#10b981',
          format: 'HEX',
        });
      }
    }
  }, [components, channels.length, addWaveformChannel]);

  // Auto-scroll timeline to right edge as new ticks arrive
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 180; // minus sidebar width
    const totalContentWidth = (waveformTick + 2) * zoomLevel;
    if (totalContentWidth > containerWidth) {
      setScrollOffset(totalContentWidth - containerWidth);
    }
  }, [waveformTick, zoomLevel]);

  // Canvas drawing loop
  const drawWaveforms = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const rulerHeight = 24;
    const trackHeight = 36;
    const visibleStartX = scrollOffset;
    const visibleEndX = scrollOffset + width;
    const startTick = Math.max(0, Math.floor(visibleStartX / zoomLevel));
    const endTick = Math.ceil(visibleEndX / zoomLevel);

    // 1. Draw Background grid & Ruler
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Ruler bar background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, rulerHeight);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, rulerHeight);
    ctx.lineTo(width, rulerHeight);
    ctx.stroke();

    // Time ticks and grid lines
    const tickStep = zoomLevel < 10 ? 10 : zoomLevel < 25 ? 5 : 2;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let t = Math.floor(startTick / tickStep) * tickStep; t <= endTick; t += tickStep) {
      const x = t * zoomLevel - scrollOffset;
      if (x < 0 || x > width) continue;

      // Vertical grid line
      ctx.strokeStyle = t % (tickStep * 2) === 0 ? 'rgba(51, 65, 85, 0.4)' : 'rgba(51, 65, 85, 0.2)';
      ctx.beginPath();
      ctx.moveTo(x, rulerHeight);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Tick mark in ruler
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(x, rulerHeight - 6);
      ctx.lineTo(x, rulerHeight);
      ctx.stroke();

      // Tick number label
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${t}`, x, rulerHeight / 2);
    }

    // 2. Draw Each Channel
    channels.forEach((channel, index) => {
      const trackY = rulerHeight + index * trackHeight;
      const isBus = channel.width > 1;

      // Track separator line
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, trackY + trackHeight);
      ctx.lineTo(width, trackY + trackHeight);
      ctx.stroke();

      const topY = trackY + 8;
      const bottomY = trackY + trackHeight - 8;
      const midY = (topY + bottomY) / 2;

      ctx.strokeStyle = channel.color;
      ctx.lineWidth = 2;

      if (!isBus) {
        // --- 1-BIT DIGITAL SQUARE WAVE ---
        let currentX = Math.max(0, -scrollOffset);
        let currentVal = channel.getValueAt(startTick);

        const getSignalY = (s: SampledValue | null) => {
          if (!s) return bottomY;
          if (s.xMask & 1) return midY;
          if (s.zMask & 1) return midY;
          return (s.value & 1) === 1 ? topY : bottomY;
        };

        let lastY = getSignalY(currentVal);
        ctx.beginPath();
        ctx.moveTo(0, lastY);

        const { transitions } = channel.getVisibleSlice(startTick, endTick);

        for (const trans of transitions) {
          const transX = trans.tick * zoomLevel - scrollOffset;
          const nextY = getSignalY(trans.sample);

          // Horizontal line up to transition point
          ctx.lineTo(transX, lastY);
          // Vertical edge
          ctx.lineTo(transX, nextY);

          lastY = nextY;
        }

        // Draw to right edge of visible canvas
        ctx.lineTo(width, lastY);
        ctx.stroke();
      } else {
        // --- MULTI-BIT BUS ENVELOPE (ModelSim/GTKWave style) ---
        const { initialSample, transitions } = channel.getVisibleSlice(startTick, endTick);
        const segments: { startTick: number; endTick: number; sample: SampledValue | null }[] = [];

        let currentTick = startTick;
        let currentSample = initialSample;

        for (const trans of transitions) {
          segments.push({ startTick: currentTick, endTick: trans.tick, sample: currentSample });
          currentTick = trans.tick;
          currentSample = trans.sample;
        }
        segments.push({ startTick: currentTick, endTick, sample: currentSample });

        for (const seg of segments) {
          const x1 = seg.startTick * zoomLevel - scrollOffset;
          const x2 = seg.endTick * zoomLevel - scrollOffset;
          if (x2 <= 0 || x1 >= width) continue;

          const isIndeterminate = seg.sample ? seg.sample.xMask !== 0 : false;
          const isHighZ = seg.sample ? (seg.sample.zMask === ((1 << channel.width) - 1)) : false;

          const segLeft = Math.max(0, x1);
          const segRight = Math.min(width, x2);
          const segWidth = segRight - segLeft;

          // Bus envelope background
          ctx.fillStyle = isIndeterminate
            ? 'rgba(239, 68, 68, 0.25)'
            : isHighZ
            ? 'rgba(56, 189, 248, 0.15)'
            : 'rgba(16, 185, 129, 0.12)';
          ctx.fillRect(segLeft, topY, segWidth, bottomY - topY);

          // Top and Bottom boundary lines
          ctx.strokeStyle = isIndeterminate ? '#ef4444' : channel.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(segLeft, topY);
          ctx.lineTo(segRight, topY);
          ctx.moveTo(segLeft, bottomY);
          ctx.lineTo(segRight, bottomY);
          ctx.stroke();

          // Hexagonal transition cross lines at segment start
          if (x1 > 0 && x1 < width) {
            ctx.beginPath();
            ctx.moveTo(x1, topY);
            ctx.lineTo(x1, bottomY);
            ctx.stroke();
          }

          // Centered Text Label inside the bus envelope
          if (segWidth > 32) {
            const formatted = formatSample(seg.sample, channel.width, channel.format);
            ctx.fillStyle = isIndeterminate ? '#fca5a5' : '#f1f5f9';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(formatted, segLeft + segWidth / 2, midY);
          }
        }
      }
    });

    // 3. Draw Hover / Time Cursor Line
    if (hoverTick !== null) {
      const cursorX = hoverTick * zoomLevel - scrollOffset;
      if (cursorX >= 0 && cursorX <= width) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(cursorX, rulerHeight);
        ctx.lineTo(cursorX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cursor header badge on ruler
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cursorX - 22, 2, 44, rulerHeight - 4);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`t:${hoverTick}`, cursorX, rulerHeight / 2);
      }
    }
  }, [channels, scrollOffset, zoomLevel, hoverTick, waveformTick]);

  // Resize observer to keep canvas full width
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const clientWidth = containerRef.current.clientWidth - 180;
        const totalHeight = Math.max(160, 24 + channels.length * 36 + 20);
        canvasRef.current.width = Math.max(300, clientWidth);
        canvasRef.current.height = totalHeight;
        drawWaveforms();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [channels.length, drawWaveforms]);

  useEffect(() => {
    drawWaveforms();
  }, [drawWaveforms]);

  // Mouse hover listener on canvas to calculate tick position
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const tick = Math.max(0, Math.round((x + scrollOffset) / zoomLevel));
    setHoverTick(tick);
  };

  const handleMouseLeave = () => {
    setHoverTick(null);
  };

  if (!isAnalyzerOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`bg-slate-900 border-t border-slate-800 shadow-2xl flex flex-col select-none transition-all duration-150 z-20 ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-64'
      }`}
    >
      {/* Top Header / Control Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>{locale === 'tr' ? 'Lojik Analizör & Zaman Diyagramı' : 'Logic Analyzer & Timing'}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span className="text-slate-500">TICK:</span>
            <span className="text-emerald-400 font-bold">{waveformTick}</span>
          </div>

          {/* Recording Status Toggle Button */}
          <button
            onClick={toggleWaveformRecording}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
              waveformEngine.isRecording
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 text-amber-400 border-amber-700/60 hover:bg-amber-900/60'
            }`}
            title={waveformEngine.isRecording ? 'Recording Active' : 'Recording Paused'}
          >
            {waveformEngine.isRecording ? <Play className="w-3 h-3 fill-emerald-400" /> : <Pause className="w-3 h-3" />}
            <span>{waveformEngine.isRecording ? (locale === 'tr' ? 'Kayıt Açık' : 'REC') : (locale === 'tr' ? 'Duraklatıldı' : 'PAUSED')}</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Add Channel Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-sky-950/70 hover:bg-sky-900 text-sky-300 border border-sky-700/50 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{locale === 'tr' ? 'Kanal Ekle' : 'Add Channel'}</span>
            </button>

            {isAddMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-800">
                  {locale === 'tr' ? 'İzlenecek Sinyaller' : 'Available Signals'}
                </div>
                {availableSignals.length === 0 ? (
                  <div className="p-3 text-[11px] text-slate-500 text-center">
                    {locale === 'tr' ? 'Tuvalde bileşen bulunamadı.' : 'No components on canvas.'}
                  </div>
                ) : (
                  availableSignals.map((sig, i) => {
                    const alreadyAdded = channels.some((c) => c.id === sig.id);
                    return (
                      <button
                        key={sig.id}
                        disabled={alreadyAdded}
                        onClick={() => {
                          addWaveformChannel({
                            id: sig.id,
                            name: sig.name,
                            width: sig.width,
                            color: channelColors[channels.length % channelColors.length],
                          });
                          setIsAddMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          alreadyAdded
                            ? 'opacity-40 cursor-not-allowed text-slate-500'
                            : 'hover:bg-slate-800 text-slate-200 cursor-pointer'
                        }`}
                      >
                        <span className="truncate">{sig.name}</span>
                        <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                          {sig.width > 1 ? `${sig.width}-bit` : '1-bit'}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Zoom In / Out */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(60, z + 5))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(5, z - 5))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Clear Button */}
          <button
            onClick={clearWaveform}
            className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 cursor-pointer transition-colors"
            title={locale === 'tr' ? 'Dalga Formunu Temizle' : 'Clear Waveforms'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title={isFullscreen ? 'Restore' : 'Maximize'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Panel Button */}
          <button
            onClick={() => setAnalyzerOpen(false)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer ml-1"
            title={t('close')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Body: Left Channels Sidebar + Right Canvas Waveforms */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Fixed Channel Headers List (Width: 180px) */}
        <div className="w-[180px] bg-slate-950/95 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Header ruler placeholder */}
          <div className="h-6 bg-slate-900 border-b border-slate-800 px-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>{locale === 'tr' ? 'KANALLAR' : 'CHANNELS'}</span>
            <span className="font-mono text-slate-500">
              {hoverTick !== null ? `@t=${hoverTick}` : ''}
            </span>
          </div>

          {/* Channels rows */}
          <div className="flex-1 divide-y divide-slate-800/40">
            {channels.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">
                {locale === 'tr' ? 'İzleme kanalı ekleyin' : 'No channels added'}
              </div>
            ) : (
              channels.map((ch) => {
                const effectiveSample = hoverTick !== null ? ch.getValueAt(hoverTick) : ch.getLastSample();
                const displayVal = formatSample(effectiveSample, ch.width, ch.format);

                return (
                  <div key={ch.id} className="h-9 px-2 flex items-center justify-between group hover:bg-slate-900/60">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                      <div className="truncate">
                        <div className="text-[11px] font-semibold text-slate-200 truncate">{ch.name}</div>
                        <div className="text-[9px] font-mono text-emerald-400 font-bold truncate">{displayVal}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {/* Bus format toggle (HEX / DEC / BIN) */}
                      {ch.width > 1 && (
                        <button
                          onClick={() => {
                            const nextFmt = ch.format === 'HEX' ? 'DEC' : ch.format === 'DEC' ? 'BIN' : 'HEX';
                            ch.format = nextFmt;
                            drawWaveforms();
                          }}
                          className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 cursor-pointer"
                          title="Toggle display format"
                        >
                          {ch.format}
                        </button>
                      )}

                      {/* Remove channel button */}
                      <button
                        onClick={() => removeWaveformChannel(ch.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-500 hover:text-rose-400 cursor-pointer transition-opacity"
                        title="Remove channel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Scrollable Canvas Timeline */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-950">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="block cursor-crosshair"
          />
        </div>
      </div>
    </div>
  );
};
