import { Signal } from './signal';
export type { Signal };

export type PinDirection = 'in' | 'out' | 'io';

export interface PinDef {
  id: string;
  dir: PinDirection;
  label?: string;
  description?: string;
}

export interface ComponentDef<TParams = any, TState = any> {
  type: string;
  category: 'gate' | 'io' | 'display' | 'sequential' | 'block';
  name: string;
  description?: string;
  pins: PinDef[];
  eval: (
    inputs: Record<string, Signal>,
    state: TState,
    params: TParams
  ) => {
    outputs: Record<string, Signal>;
    state?: TState;
  };
  defaultParams?: TParams;
  defaultState?: TState;
  ui?: {
    width?: number;
    height?: number;
    color?: string;
  };
}

export interface ComponentInstance {
  id: string;
  type: string;
  x: number;
  y: number;
  params: Record<string, any>;
  state?: any;
}

export interface PinRef {
  comp: string;
  pin: string;
}

export interface Wire {
  id: string;
  from: PinRef;
  to: PinRef;
}

export interface CircuitModel {
  version: 1;
  mode: 'sandbox' | 'realistic';
  components: ComponentInstance[];
  wires: Wire[];
  customDefs?: ComponentDef[];
}

export interface SimulationResult {
  // pin key is `${compId}:${pinId}`
  pinValues: Record<string, Signal>;
  // wire id -> signal
  wireValues: Record<string, Signal>;
  // component states
  componentStates: Record<string, any>;
  oscillating?: boolean;
  settleSteps: number;
}
