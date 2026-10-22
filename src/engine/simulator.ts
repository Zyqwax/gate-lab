import { CircuitModel, SimulationResult, ComponentDef } from './types';
import { Signal, resolveSignals, normalizeToBus } from './signal';
import { buildNetlist, Netlist } from './netlist';
import { REGISTRY, getComponentPins } from '../components-lib/registry';

export interface SimulatorOptions {
  maxIterations?: number;
  customRegistry?: Map<string, ComponentDef>;
}

export class Simulator {
  private registry: Map<string, ComponentDef>;
  private maxIterations: number;

  constructor(options?: SimulatorOptions) {
    this.registry = options?.customRegistry ?? REGISTRY;
    this.maxIterations = options?.maxIterations ?? 50;
  }

  /**
   * Evaluates the circuit until all combinational signals settle or max iterations reached.
   */
  evaluate(
    circuit: CircuitModel,
    previousStates: Record<string, any> = {}
  ): SimulationResult {
    const netlist = buildNetlist(circuit.components, circuit.wires, this.registry);

    // Track states of each component
    const componentStates: Record<string, any> = { ...previousStates };

    // Pin output values map: `${compId}:${pinId}` -> Signal
    const pinOutputs = new Map<string, Signal>();
    // Pin input values map: `${compId}:${pinId}` -> Signal
    const pinInputs = new Map<string, Signal>();
    // Net signal values map: net.id -> Signal
    const netSignals = new Map<string, Signal>();

    // Initialize component states if missing
    for (const comp of circuit.components) {
      if (componentStates[comp.id] === undefined) {
        const def = this.registry.get(comp.type);
        componentStates[comp.id] = comp.state ?? def?.defaultState ?? {};
      }
    }

    let iterations = 0;
    let oscillating = false;

    // Helper to settle combinational logic to steady state
    const settle = (): number => {
      let iters = 0;
      let hasChanged = true;

      while (hasChanged && iters < this.maxIterations) {
        hasChanged = false;
        iters++;

        // 1. Evaluate all components using current inputs and internal state
        for (const comp of circuit.components) {
          const def = this.registry.get(comp.type);
          if (!def) continue;

          // For D_FLIP_FLOP during combinational settling:
          // It holds its current Q/Qbar output and does NOT prematurely sample unpropagated glitches!
          if (comp.type === 'D_FLIP_FLOP') {
            const state = componentStates[comp.id] ?? { q: 0, lastClk: 0 };
            const qSig: Signal = state.q === 1 ? 1 : 0;
            const qbarSig: Signal = state.q === 1 ? 0 : 1;

            if (pinOutputs.get(`${comp.id}:q`) !== qSig) {
              pinOutputs.set(`${comp.id}:q`, qSig);
              hasChanged = true;
            }
            if (pinOutputs.get(`${comp.id}:qbar`) !== qbarSig) {
              pinOutputs.set(`${comp.id}:qbar`, qbarSig);
              hasChanged = true;
            }
            continue;
          }

          const pins = getComponentPins(def, comp.params);

          // Gather current input pin values for this component
          const compInputs: Record<string, Signal> = {};
          for (const pin of pins) {
            if (pin.dir === 'in' || pin.dir === 'io') {
              const key = `${comp.id}:${pin.id}`;
              compInputs[pin.id] = pinInputs.get(key) ?? 'Z';
            }
          }

          const currentState = componentStates[comp.id];
          const res = def.eval(compInputs, currentState, comp.params);

          if (res.state !== undefined) {
            componentStates[comp.id] = res.state;
          }

          // Store outputs and check if anything changed
          for (const [pinId, sig] of Object.entries(res.outputs)) {
            const key = `${comp.id}:${pinId}`;
            const oldSig = pinOutputs.get(key);
            if (oldSig !== sig) {
              pinOutputs.set(key, sig);
              hasChanged = true;
            }
          }
        }

        // 2. Propagate pin outputs to nets and then from nets to pin inputs
        for (const net of netlist.nets) {
          const drivers: Signal[] = [];

          for (const pinKey of net.pins) {
            const [compId, pinId] = pinKey.split(':');
            const comp = circuit.components.find((c) => c.id === compId);
            if (!comp) continue;
            const def = this.registry.get(comp.type);
            const pinDef = def ? getComponentPins(def, comp.params).find((p) => p.id === pinId) : undefined;

            if (pinDef && (pinDef.dir === 'out' || pinDef.dir === 'io')) {
              const outSig = pinOutputs.get(pinKey) ?? 'Z';
              drivers.push(outSig);
            }
          }

          // Resolve all drivers on this net
          const resolved = resolveSignals(drivers);
          const oldNetSig = netSignals.get(net.id);
          if (oldNetSig !== resolved) {
            netSignals.set(net.id, resolved);
            hasChanged = true;
          }

          // Propagate resolved signal to all receiver pins on this net
          for (const pinKey of net.pins) {
            const [compId, pinId] = pinKey.split(':');
            const comp = circuit.components.find((c) => c.id === compId);
            if (!comp) continue;
            const def = this.registry.get(comp.type);
            const pinDef = def ? getComponentPins(def, comp.params).find((p) => p.id === pinId) : undefined;

            if (pinDef && (pinDef.dir === 'in' || pinDef.dir === 'io')) {
              const oldInSig = pinInputs.get(pinKey);
              if (oldInSig !== resolved) {
                pinInputs.set(pinKey, resolved);
                hasChanged = true;
              }
            }
          }
        }
      }

      if (iters >= this.maxIterations && hasChanged) {
        oscillating = true;
      }
      return iters;
    };

    // Phase 1: Combinational signals settle to steady state
    iterations += settle();

    // Phase 2: Edge-triggered sequential sampling (D_FLIP_FLOP, D_FF_RESET, D_FF_ENABLE, REGISTER_8)
    // Supports synchronous clocking, asynchronous reset, and ripple clock chains
    let anySeqTriggered = true;
    let seqPass = 0;
    while (anySeqTriggered && seqPass < 10) {
      anySeqTriggered = false;
      seqPass++;

      const seqUpdates: {
        compId: string;
        nextState: any;
        outputs: Record<string, Signal>;
      }[] = [];

      for (const comp of circuit.components) {
        if (
          comp.type === 'D_FLIP_FLOP' ||
          comp.type === 'D_FF_RESET' ||
          comp.type === 'D_FF_ENABLE'
        ) {
          const state = componentStates[comp.id] ?? { q: 0, lastClk: 0 };
          const lastClk = (seqPass === 1 && previousStates[comp.id]?.lastClk !== undefined)
            ? previousStates[comp.id].lastClk
            : state.lastClk ?? 0;
          const currentClk = pinInputs.get(`${comp.id}:clk`) === 1 ? 1 : 0;
          const currentD = pinInputs.get(`${comp.id}:d`) === 1 ? 1 : 0;
          const currentClr = pinInputs.get(`${comp.id}:clr`) === 1 ? 1 : 0;
          const currentEn = pinInputs.get(`${comp.id}:en`) === 0 ? 0 : 1;

          let nextQ = state.q ?? 0;
          if (comp.type === 'D_FF_RESET' && currentClr === 1) {
            // Asynchronous clear overrides clock
            nextQ = 0;
          } else if (lastClk === 0 && currentClk === 1) {
            // Rising edge detection (0 -> 1)
            if (comp.type === 'D_FF_ENABLE') {
              if (currentEn === 1) nextQ = currentD;
            } else {
              nextQ = currentD;
            }
          }

          seqUpdates.push({
            compId: comp.id,
            nextState: { q: nextQ, lastClk: currentClk },
            outputs: {
              q: nextQ === 1 ? 1 : 0,
              qbar: nextQ === 1 ? 0 : 1,
            },
          });
        } else if (comp.type === 'REGISTER_8') {
          const defaultQ = [0, 0, 0, 0, 0, 0, 0, 0];
          const state = componentStates[comp.id] ?? { q: defaultQ, lastClk: 0 };
          const lastClk = (seqPass === 1 && previousStates[comp.id]?.lastClk !== undefined)
            ? previousStates[comp.id].lastClk
            : state.lastClk ?? 0;
          const currentClk = pinInputs.get(`${comp.id}:clk`) === 1 ? 1 : 0;
          const currentClr = pinInputs.get(`${comp.id}:clr`) === 1 ? 1 : 0;
          const currentLoad = pinInputs.get(`${comp.id}:load`) === 0 ? 0 : 1;
          const currentD = normalizeToBus(pinInputs.get(`${comp.id}:d`), 8, 0);

          let nextQ = Array.isArray(state.q) ? [...state.q] : defaultQ;
          if (currentClr === 1) {
            // Asynchronous clear overrides clock
            nextQ = [0, 0, 0, 0, 0, 0, 0, 0];
          } else if (lastClk === 0 && currentClk === 1) {
            // Rising edge on clock
            if (currentLoad === 1) {
              nextQ = currentD;
            }
          }

          seqUpdates.push({
            compId: comp.id,
            nextState: { q: nextQ, lastClk: currentClk },
            outputs: { q: nextQ },
          });
        }
      }

      // Commit states
      for (const up of seqUpdates) {
        const oldState = componentStates[up.compId];
        const stateDiff = JSON.stringify(oldState) !== JSON.stringify(up.nextState);
        if (stateDiff) {
          anySeqTriggered = true;
        }
        componentStates[up.compId] = up.nextState;
        for (const [pinId, sig] of Object.entries(up.outputs)) {
          pinOutputs.set(`${up.compId}:${pinId}`, sig);
        }
      }

      // If any sequential component changed output, settle downstream logic
      if (anySeqTriggered) {
        iterations += settle();
      }
    }

    // Prepare unified pin values map
    const finalPinValues: Record<string, Signal> = {};
    for (const comp of circuit.components) {
      const def = this.registry.get(comp.type);
      if (!def) continue;
      const pins = getComponentPins(def, comp.params);
      for (const p of pins) {
        const key = `${comp.id}:${p.id}`;
        if (p.dir === 'out') {
          finalPinValues[key] = pinOutputs.get(key) ?? 'Z';
        } else {
          finalPinValues[key] = pinInputs.get(key) ?? 'Z';
        }
      }
    }

    // Map wire values from their corresponding nets
    const finalWireValues: Record<string, Signal> = {};
    for (const wire of circuit.wires) {
      const net = netlist.wireToNet.get(wire.id);
      finalWireValues[wire.id] = net ? netSignals.get(net.id) ?? 'Z' : 'Z';
    }

    return {
      pinValues: finalPinValues,
      wireValues: finalWireValues,
      componentStates,
      oscillating,
      settleSteps: iterations,
    };
  }
}

export const defaultSimulator = new Simulator();
