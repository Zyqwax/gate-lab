import { create } from 'zustand';
import { CircuitModel, ComponentInstance, Wire, SimulationResult, PinRef } from '../engine/types';
import { defaultSimulator } from '../engine/simulator';
import { getComponentDef } from '../components-lib/registry';
import { TEMPLATES } from '../templates/circuits';
import { saveCircuit } from '../lib/circuitStorage';

interface CircuitState {
  // Circuit data
  components: ComponentInstance[];
  wires: Wire[];
  selectedComponentId: string | null;
  selectedWireId: string | null;

  // Simulation execution
  isRunning: boolean;
  tickRateHz: number;
  stepCount: number;
  simResult: SimulationResult;

  // History for Undo/Redo
  historyPast: { components: ComponentInstance[]; wires: Wire[] }[];
  historyFuture: { components: ComponentInstance[]; wires: Wire[] }[];

  // Project metadata
  currentProjectId: string | null;
  currentProjectName: string;
  isSaved: boolean;

  // UI Settings
  showMinimap: boolean;
  toggleMinimap: () => void;

  // Actions
  setProject: (id: string, name: string, model: CircuitModel) => void;
  setProjectName: (name: string) => void;
  saveCurrentProject: () => boolean;

  addComponent: (type: string, pos: { x: number; y: number }) => void;
  duplicateComponent: (id: string) => string | null;
  disconnectComponent: (id: string) => void;
  updateComponentPosition: (id: string, pos: { x: number; y: number }) => void;
  updateComponentParams: (id: string, params: Record<string, any>) => void;
  removeComponent: (id: string) => void;
  addWire: (from: PinRef, to: PinRef) => void;
  removeWire: (id: string) => void;

  toggleSwitch: (compId: string) => void;
  setButtonPressed: (compId: string, pressed: boolean) => void;

  step: () => void;
  togglePlay: () => void;
  setTickRate: (hz: number) => void;
  resetSimulation: () => void;

  loadTemplate: (templateId: string) => void;
  clearCircuit: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;

  undo: () => void;
  redo: () => void;

  selectComponent: (id: string | null) => void;
  selectWire: (id: string | null) => void;

  evaluateCircuit: () => void;
}

// Initial full adder circuit loaded by default!
const initialTemplate = TEMPLATES[0]; // Full Adder!

export const useCircuitStore = create<CircuitState>((set, get) => {
  // Helper to run simulation against current state
  const runSim = (
    components: ComponentInstance[],
    wires: Wire[],
    prevStates: Record<string, any> = {}
  ): SimulationResult => {
    const model: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components,
      wires,
    };
    return defaultSimulator.evaluate(model, prevStates);
  };

  const initialSim = runSim([], []);

  const pushHistory = (state: CircuitState) => {
    const snapshot = {
      components: JSON.parse(JSON.stringify(state.components)),
      wires: JSON.parse(JSON.stringify(state.wires)),
    };
    return {
      historyPast: [...state.historyPast.slice(-20), snapshot],
      historyFuture: [],
    };
  };

  return {
    components: [],
    wires: [],
    selectedComponentId: null,
    selectedWireId: null,
    isRunning: false,
    tickRateHz: 2,
    stepCount: 0,
    simResult: initialSim,
    historyPast: [],
    historyFuture: [],

    currentProjectId: null,
    currentProjectName: 'İsimsiz Devre Projesi',
    isSaved: true,
    showMinimap: true,
    toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),

    setProject: (id, name, model) => {
      const simResult = runSim(model.components, model.wires);
      set({
        currentProjectId: id,
        currentProjectName: name,
        components: model.components,
        wires: model.wires,
        selectedComponentId: null,
        selectedWireId: null,
        simResult,
        stepCount: 0,
        isSaved: true,
        historyPast: [],
        historyFuture: [],
      });
    },

    setProjectName: (name) => {
      set({ currentProjectName: name, isSaved: false });
    },

    saveCurrentProject: () => {
      const { currentProjectId, currentProjectName, components, wires } = get();
      if (typeof window === 'undefined') return false;

      const id = currentProjectId || `circuit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      saveCircuit({
        id,
        name: currentProjectName || 'İsimsiz Devre Projesi',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        circuit: {
          version: 1,
          mode: 'sandbox',
          components,
          wires,
        },
      });

      set({ currentProjectId: id, isSaved: true });
      return true;
    },

    evaluateCircuit: () => {
      const { components, wires, simResult } = get();
      const newResult = runSim(components, wires, simResult.componentStates);
      set({ simResult: newResult });
    },

    addComponent: (type, pos) => {
      const def = getComponentDef(type);
      if (!def) return;

      const newId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newComp: ComponentInstance = {
        id: newId,
        type,
        x: Math.round(pos.x / 10) * 10,
        y: Math.round(pos.y / 10) * 10,
        params: { ...(def.defaultParams || {}) },
        state: def.defaultState ? JSON.parse(JSON.stringify(def.defaultState)) : {},
      };

      set((state) => {
        const historyUpdate = pushHistory(state);
        const components = [...state.components, newComp];
        const simResult = runSim(components, state.wires, state.simResult.componentStates);
        return {
          ...historyUpdate,
          components,
          simResult,
          selectedComponentId: newId,
          isSaved: false,
        };
      });
    },

    duplicateComponent: (id) => {
      const comp = get().components.find((c) => c.id === id);
      if (!comp) return null;

      const newId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const duplicatedComp: ComponentInstance = {
        id: newId,
        type: comp.type,
        x: comp.x + 40,
        y: comp.y + 40,
        params: JSON.parse(JSON.stringify(comp.params || {})),
        state: comp.state ? JSON.parse(JSON.stringify(comp.state)) : {},
      };

      set((state) => {
        const historyUpdate = pushHistory(state);
        const components = [...state.components, duplicatedComp];
        const simResult = runSim(components, state.wires, state.simResult.componentStates);
        return {
          ...historyUpdate,
          components,
          simResult,
          selectedComponentId: newId,
          isSaved: false,
        };
      });

      return newId;
    },

    disconnectComponent: (id) => {
      set((state) => {
        const historyUpdate = pushHistory(state);
        const wires = state.wires.filter(
          (w) => w.from.comp !== id && w.to.comp !== id
        );
        const simResult = runSim(state.components, wires, state.simResult.componentStates);
        return {
          ...historyUpdate,
          wires,
          simResult,
          isSaved: false,
        };
      });
    },

    updateComponentPosition: (id, pos) => {
      set((state) => ({
        isSaved: false,
        components: state.components.map((c) =>
          c.id === id ? { ...c, x: pos.x, y: pos.y } : c
        ),
      }));
    },

    updateComponentParams: (id, newParams) => {
      set((state) => {
        const historyUpdate = pushHistory(state);
        const components = state.components.map((c) =>
          c.id === id ? { ...c, params: { ...c.params, ...newParams } } : c
        );
        const simResult = runSim(components, state.wires, state.simResult.componentStates);
        return {
          ...historyUpdate,
          components,
          simResult,
          isSaved: false,
        };
      });
    },

    removeComponent: (id) => {
      set((state) => {
        const historyUpdate = pushHistory(state);
        const components = state.components.filter((c) => c.id !== id);
        // Remove connected wires as well
        const wires = state.wires.filter(
          (w) => w.from.comp !== id && w.to.comp !== id
        );
        const simResult = runSim(components, wires, state.simResult.componentStates);
        return {
          ...historyUpdate,
          components,
          wires,
          selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
          simResult,
          isSaved: false,
        };
      });
    },

    addWire: (from, to) => {
      // Avoid duplicate wires
      const exists = get().wires.some(
        (w) =>
          (w.from.comp === from.comp && w.from.pin === from.pin && w.to.comp === to.comp && w.to.pin === to.pin) ||
          (w.from.comp === to.comp && w.from.pin === to.pin && w.to.comp === from.comp && w.to.pin === from.pin)
      );
      if (exists) return;

      const newWire: Wire = {
        id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        from,
        to,
      };

      set((state) => {
        const historyUpdate = pushHistory(state);
        const wires = [...state.wires, newWire];
        const simResult = runSim(state.components, wires, state.simResult.componentStates);
        return {
          ...historyUpdate,
          wires,
          simResult,
          isSaved: false,
        };
      });
    },

    removeWire: (id) => {
      set((state) => {
        const historyUpdate = pushHistory(state);
        const wires = state.wires.filter((w) => w.id !== id);
        const simResult = runSim(state.components, wires, state.simResult.componentStates);
        return {
          ...historyUpdate,
          wires,
          selectedWireId: state.selectedWireId === id ? null : state.selectedWireId,
          simResult,
          isSaved: false,
        };
      });
    },

    toggleSwitch: (compId) => {
      set((state) => {
        const components = state.components.map((c) => {
          if (c.id === compId && c.type === 'SWITCH') {
            const current = c.params.state === 1 ? 1 : 0;
            return {
              ...c,
              params: { ...c.params, state: current === 1 ? 0 : 1 },
            };
          }
          return c;
        });
        const simResult = runSim(components, state.wires, state.simResult.componentStates);
        return { components, simResult };
      });
    },

    setButtonPressed: (compId, pressed) => {
      set((state) => {
        const components = state.components.map((c) => {
          if (c.id === compId && c.type === 'BUTTON') {
            return {
              ...c,
              params: { ...c.params, pressed },
            };
          }
          return c;
        });
        const simResult = runSim(components, state.wires, state.simResult.componentStates);
        return { components, simResult };
      });
    },

    step: () => {
      const { components, wires, simResult, stepCount } = get();

      // Invert CLOCK outputs on step
      const updatedComponents = components.map((c) => {
        if (c.type === 'CLOCK') {
          return {
            ...c,
            params: { ...c.params, high: !c.params.high },
          };
        }
        return c;
      });

      const newSim = runSim(updatedComponents, wires, simResult.componentStates);
      set({
        components: updatedComponents,
        simResult: newSim,
        stepCount: stepCount + 1,
      });
    },

    togglePlay: () => {
      set((state) => ({ isRunning: !state.isRunning }));
    },

    setTickRate: (hz) => {
      set({ tickRateHz: Math.max(0.5, Math.min(60, hz)) });
    },

    resetSimulation: () => {
      set((state) => {
        const components = state.components.map((c) => {
          const def = getComponentDef(c.type);
          return {
            ...c,
            params: { ...(def?.defaultParams || {}), ...(c.params || {}) },
            state: def?.defaultState ? JSON.parse(JSON.stringify(def.defaultState)) : {},
          };
        });
        const simResult = runSim(components, state.wires);
        return { components, simResult, stepCount: 0 };
      });
    },

    loadTemplate: (templateId) => {
      const tpl = TEMPLATES.find((t) => t.id === templateId);
      if (!tpl) return;

      const newComps = JSON.parse(JSON.stringify(tpl.circuit.components));
      const newWires = JSON.parse(JSON.stringify(tpl.circuit.wires));
      const simResult = runSim(newComps, newWires);

      set((state) => ({
        ...pushHistory(state),
        components: newComps,
        wires: newWires,
        selectedComponentId: null,
        selectedWireId: null,
        simResult,
        stepCount: 0,
      }));
    },

    clearCircuit: () => {
      set((state) => ({
        ...pushHistory(state),
        components: [],
        wires: [],
        selectedComponentId: null,
        selectedWireId: null,
        simResult: runSim([], []),
        stepCount: 0,
      }));
    },

    exportJSON: () => {
      const { components, wires } = get();
      const model: CircuitModel = {
        version: 1,
        mode: 'sandbox',
        components,
        wires,
      };
      return JSON.stringify(model, null, 2);
    },

    importJSON: (jsonStr) => {
      try {
        let parsed = JSON.parse(jsonStr);

        // Support both direct CircuitModel and wrapped template format
        if (parsed.circuit) {
          parsed = parsed.circuit;
        }

        if (!parsed || !Array.isArray(parsed.components) || !Array.isArray(parsed.wires)) {
          console.error('Invalid circuit JSON: components or wires is not an array');
          return false;
        }

        const simResult = runSim(parsed.components, parsed.wires);
        set((state) => ({
          ...pushHistory(state),
          components: parsed.components,
          wires: parsed.wires,
          selectedComponentId: null,
          selectedWireId: null,
          simResult,
          stepCount: 0,
        }));
        return true;
      } catch (e) {
        console.error('Invalid circuit JSON', e);
        return false;
      }
    },

    undo: () => {
      const { historyPast, historyFuture, components, wires } = get();
      if (historyPast.length === 0) return;

      const previous = historyPast[historyPast.length - 1];
      const newPast = historyPast.slice(0, -1);
      const current = {
        components: JSON.parse(JSON.stringify(components)),
        wires: JSON.parse(JSON.stringify(wires)),
      };

      const simResult = runSim(previous.components, previous.wires);
      set({
        components: previous.components,
        wires: previous.wires,
        historyPast: newPast,
        historyFuture: [current, ...historyFuture],
        simResult,
      });
    },

    redo: () => {
      const { historyPast, historyFuture, components, wires } = get();
      if (historyFuture.length === 0) return;

      const next = historyFuture[0];
      const newFuture = historyFuture.slice(1);
      const current = {
        components: JSON.parse(JSON.stringify(components)),
        wires: JSON.parse(JSON.stringify(wires)),
      };

      const simResult = runSim(next.components, next.wires);
      set({
        components: next.components,
        wires: next.wires,
        historyPast: [...historyPast, current],
        historyFuture: newFuture,
        simResult,
      });
    },

    selectComponent: (id) => set({ selectedComponentId: id, selectedWireId: null }),
    selectWire: (id) => set({ selectedWireId: id, selectedComponentId: null }),
  };
});
