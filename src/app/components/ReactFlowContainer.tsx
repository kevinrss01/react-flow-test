"use client";

import React, { useCallback, Fragment, useState } from "react";
import IconContainer from "./IconContainer";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  addEdge,
  MiniMap,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  Panel,
} from "reactflow";
import Modal from "./Modal";

import "reactflow/dist/style.css";
import { Modern_Antiqua } from "next/font/google";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "Node 2" },
  },
  {
    id: "3",
    position: { x: 0, y: 200 },
    data: { label: "Node 3" },
  },
  {
    id: "4",
    type: "group",
    position: { x: 170, y: 100 },
    data: { label: "group 1" },
    style: {
      width: 280,
      height: 160,
    },
  },
  {
    id: "4A",
    position: { x: 60, y: 10 },
    data: { label: "Node A" },
    parentNode: "4",
    extent: "parent",
  },
  {
    id: "4B",
    position: { x: 60, y: 70 },
    data: { label: "Node AB" },
    parentNode: "4",
    extent: "parent",
  },
  {
    id: "5",
    type: "output",
    position: { x: 0, y: 300 },
    data: null,
    style: {
      width: 170,
      height: 160,
      backgroundColor: "rgba(240,240,240,0.25)",
    },
  },
  {
    id: "5A",
    data: { label: "Child 1" },
    position: { x: 50, y: 10 },
    parentNode: "5",
    extent: "parent",
    draggable: false,
    style: {
      width: 60,
    },
  },
  {
    id: "5B",
    data: { label: "Child 2" },
    position: { x: 10, y: 90 },
    parentNode: "5",
    extent: "parent",
    draggable: false,
    style: {
      width: 60,
    },
  },
  {
    id: "5C",
    data: { label: "Child 3" },
    position: { x: 100, y: 90 },
    parentNode: "5",
    extent: "parent",
    draggable: false,
    style: {
      width: 60,
    },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-5", source: "3", target: "5" },
];

const ReactFlowContainer = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [childrenModal, setChildrenModal] = useState<React.ReactNode>(null);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      className="react-flow-container"
    >
      <IconContainer
        openModal={openModal}
        setChildrenModal={setChildrenModal}
      />
      <Modal isOpen={isOpen} closeModal={closeModal}>
        {childrenModal}
      </Modal>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowContainer;
