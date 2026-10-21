import { CircuitModel } from '../engine/types';
import { TEMPLATES } from '../templates/circuits';

export interface SavedCircuit {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  circuit: CircuitModel;
}

const STORAGE_KEY = 'gate_lab_circuits_v1';

export function getSavedCircuits(): SavedCircuit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization: populate default starter projects!
      const defaultProject: SavedCircuit = {
        id: 'circuit_starter_full_adder',
        name: 'Full Adder (Varsayılan Proje)',
        description: '2x XOR, 2x AND, 1x OR kapıları ile oluşturulmuş 1-bit tam toplayıcı referans devresi.',
        createdAt: Date.now() - 3600000,
        updatedAt: Date.now(),
        circuit: JSON.parse(JSON.stringify(TEMPLATES[0].circuit)),
      };
      saveCircuit(defaultProject);
      return [defaultProject];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read saved circuits from localStorage', e);
    return [];
  }
}

export function getCircuitById(id: string): SavedCircuit | null {
  const circuits = getSavedCircuits();
  return circuits.find((c) => c.id === id) || null;
}

export function saveCircuit(circuit: SavedCircuit): void {
  if (typeof window === 'undefined') return;
  try {
    const circuits = getSavedCircuits();
    const existingIndex = circuits.findIndex((c) => c.id === circuit.id);
    const updated = {
      ...circuit,
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      circuits[existingIndex] = updated;
    } else {
      circuits.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
  } catch (e) {
    console.error('Failed to save circuit to localStorage', e);
  }
}

export function deleteCircuit(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const circuits = getSavedCircuits().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
  } catch (e) {
    console.error('Failed to delete circuit from localStorage', e);
  }
}

export function createBlankCircuit(name?: string): SavedCircuit {
  const id = `circuit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newCircuit: SavedCircuit = {
    id,
    name: name?.trim() || 'İsimsiz Devre Projesi',
    description: 'Boş tuval ile oluşturulmuş devre tasarımı.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [],
      wires: [],
    },
  };
  saveCircuit(newCircuit);
  return newCircuit;
}

export function createCircuitFromTemplate(templateId: string, customName?: string): SavedCircuit {
  const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  const id = `circuit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newCircuit: SavedCircuit = {
    id,
    name: customName?.trim() || `${tpl.name} Projesi`,
    description: tpl.description,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    circuit: JSON.parse(JSON.stringify(tpl.circuit)),
  };
  saveCircuit(newCircuit);
  return newCircuit;
}

export function createCircuitFromJSON(jsonStr: string, customName?: string): SavedCircuit | null {
  try {
    let parsed = JSON.parse(jsonStr);
    if (parsed.circuit) parsed = parsed.circuit;

    if (!Array.isArray(parsed.components) || !Array.isArray(parsed.wires)) {
      return null;
    }

    const id = `circuit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newCircuit: SavedCircuit = {
      id,
      name: customName?.trim() || 'İçe Aktarılan Devre',
      description: 'JSON dosyasından içeri aktarıldı.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      circuit: {
        version: 1,
        mode: parsed.mode || 'sandbox',
        components: parsed.components,
        wires: parsed.wires,
      },
    };
    saveCircuit(newCircuit);
    return newCircuit;
  } catch (e) {
    console.error('Invalid JSON in createCircuitFromJSON', e);
    return null;
  }
}
