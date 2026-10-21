import { Wire, ComponentInstance, ComponentDef } from './types';

export interface Net {
  id: string;
  pins: string[]; // array of "compId:pinId"
  wireIds: string[]; // array of wire ids
}

export interface Netlist {
  nets: Net[];
  pinToNet: Map<string, Net>;
  wireToNet: Map<string, Net>;
}

class UnionFind {
  private parent = new Map<string, string>();

  find(item: string): string {
    if (!this.parent.has(item)) {
      this.parent.set(item, item);
      return item;
    }
    const root = this.parent.get(item)!;
    if (root !== item) {
      const actualRoot = this.find(root);
      this.parent.set(item, actualRoot);
      return actualRoot;
    }
    return item;
  }

  union(a: string, b: string): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent.set(rootB, rootA);
    }
  }
}

/**
 * Extracts electrical nets from components and wires using Union-Find.
 */
export function buildNetlist(
  components: ComponentInstance[],
  wires: Wire[],
  registry: Map<string, ComponentDef>
): Netlist {
  const uf = new UnionFind();

  // Register all valid pins
  const allPins = new Set<string>();
  for (const comp of components) {
    const def = registry.get(comp.type);
    if (def) {
      for (const pin of def.pins) {
        const pinKey = `${comp.id}:${pin.id}`;
        allPins.add(pinKey);
        uf.find(pinKey);
      }
    }
  }

  // Connect pins via wires
  for (const wire of wires) {
    const fromKey = `${wire.from.comp}:${wire.from.pin}`;
    const toKey = `${wire.to.comp}:${wire.to.pin}`;
    uf.union(fromKey, toKey);
  }

  // Group pins by net root
  const groups = new Map<string, string[]>();
  for (const pinKey of allPins) {
    const root = uf.find(pinKey);
    let list = groups.get(root);
    if (!list) {
      list = [];
      groups.set(root, list);
    }
    list.push(pinKey);
  }

  // Group wires by root
  const wireGroups = new Map<string, string[]>();
  for (const wire of wires) {
    const fromKey = `${wire.from.comp}:${wire.from.pin}`;
    const root = uf.find(fromKey);
    let list = wireGroups.get(root);
    if (!list) {
      list = [];
      wireGroups.set(root, list);
    }
    list.push(wire.id);
  }

  const nets: Net[] = [];
  const pinToNet = new Map<string, Net>();
  const wireToNet = new Map<string, Net>();

  let netCounter = 0;
  for (const [root, pins] of groups.entries()) {
    const wireIds = wireGroups.get(root) || [];
    const net: Net = {
      id: `net_${netCounter++}`,
      pins,
      wireIds,
    };
    nets.push(net);
    for (const p of pins) {
      pinToNet.set(p, net);
    }
    for (const w of wireIds) {
      wireToNet.set(w, net);
    }
  }

  return {
    nets,
    pinToNet,
    wireToNet,
  };
}
