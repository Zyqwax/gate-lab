import { CircuitModel, SimulationResult, ComponentDef } from './types';
import { Signal, resolveSignals } from './signal';
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
    let hasChanged = true;
    let oscillating = false;

    while (hasChanged && iterations < this.maxIterations) {
      hasChanged = false;
      iterations++;

      // 1. Evaluate all components using their current inputs and internal state
      for (const comp of circuit.components) {
        const def = this.registry.get(comp.type);
        if (!def) continue;

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

    if (iterations >= this.maxIterations && hasChanged) {
      oscillating = true;
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
