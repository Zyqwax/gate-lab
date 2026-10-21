'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCircuitStore } from '../store/circuitStore';
import { GateNode } from './nodes/GateNode';
import { IONode } from './nodes/IONode';
import { DisplayNode } from './nodes/DisplayNode';
import { BlockNode } from './nodes/BlockNode';
import { SignalEdge } from './edges/SignalEdge';
import { getComponentDef } from '../components-lib/registry';

const nodeTypes = {
  gate: GateNode,
  io: IONode,
  display: DisplayNode,
  block: BlockNode,
};

const edgeTypes = {
  signal: SignalEdge,
};

const CanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const components = useCircuitStore((state) => state.components);
  const wires = useCircuitStore((state) => state.wires);
  const selectedComponentId = useCircuitStore((state) => state.selectedComponentId);
  const selectedWireId = useCircuitStore((state) => state.selectedWireId);

  const addComponent = useCircuitStore((state) => state.addComponent);
  const updateComponentPosition = useCircuitStore((state) => state.updateComponentPosition);
  const addWire = useCircuitStore((state) => state.addWire);
  const removeWire = useCircuitStore((state) => state.removeWire);
  const selectComponent = useCircuitStore((state) => state.selectComponent);
  const selectWire = useCircuitStore((state) => state.selectWire);

  // Convert components to ReactFlow Nodes
  const nodes: Node[] = useMemo(() => {
    return components.map((comp) => {
      const def = getComponentDef(comp.type);
      let nodeCategory = def?.category || 'gate';
      if (nodeCategory === 'sequential') nodeCategory = 'block';

      return {
        id: comp.id,
        type: nodeCategory,
        position: { x: comp.x, y: comp.y },
        data: {
          type: comp.type,
          params: comp.params,
        },
        selected: selectedComponentId === comp.id,
      };
    });
  }, [components, selectedComponentId]);

  // Convert wires to ReactFlow Edges
  const edges: Edge[] = useMemo(() => {
    return wires.map((wire) => ({
      id: wire.id,
      source: wire.from.comp,
      sourceHandle: wire.from.pin,
      target: wire.to.comp,
      targetHandle: wire.to.pin,
      type: 'signal',
      selected: selectedWireId === wire.id,
    }));
  }, [wires, selectedWireId]);

  // Handle new connection between pins
  const onConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.target ||
        !connection.sourceHandle ||
        !connection.targetHandle
      ) {
        return;
      }

      addWire(
        { comp: connection.source, pin: connection.sourceHandle },
        { comp: connection.target, pin: connection.targetHandle }
      );
    },
    [addWire]
  );

  // Drag and drop from Palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const compType = event.dataTransfer.getData('application/gate-lab-component');
      if (!compType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addComponent(compType, position);
    },
    [screenToFlowPosition, addComponent]
  );

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodesChange={(changes) => {
          for (const change of changes) {
            if (change.type === 'position' && change.position) {
              updateComponentPosition(change.id, change.position);
            }
          }
        }}
        onEdgesDelete={(deletedEdges) => {
          for (const edge of deletedEdges) {
            removeWire(edge.id);
          }
        }}
        onNodeClick={(_e, node) => selectComponent(node.id)}
        onEdgeClick={(_e, edge) => selectWire(edge.id)}
        onPaneClick={() => {
          selectComponent(null);
          selectWire(null);
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultViewport={{ x: 60, y: 40, zoom: 0.95 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#334155" />
        <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-300 [&>button]:!border-slate-800 [&>button]:!bg-slate-900 [&>button:hover]:!bg-slate-800" />
        <MiniMap
          nodeStrokeColor="#475569"
          nodeColor="#1e293b"
          maskColor="rgba(2, 6, 23, 0.7)"
          className="!bg-slate-950 !border !border-slate-800 !rounded-xl overflow-hidden shadow-2xl"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

export const Canvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};
