"use client";

import React, { useCallback, useState, useEffect } from "react";
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
  Edge,
  Node,
} from "reactflow";
import Modal from "./Modal";
import UploadFile from "@/app/components/UploadFile";
import { getReactFlowFromJson } from "@/utils/jsonToFlow";
import { ExcelConvertedJson } from "@/app/types/interface";

import "reactflow/dist/style.css";
import { ToastContainer } from "react-toastify";

const ReactFlowContainer = () => {
  // @ts-ignore
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const [isChildrenModelOpen, setChildrenModelIsOpen] =
    useState<boolean>(false);
  const [childrenModal, setChildrenModal] = useState<React.ReactNode>(null);
  const [jsonData, setJsonData] = useState<ExcelConvertedJson>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (nodes.length === 0) {
      setChildrenModelIsOpen(true);
      setChildrenModal(
        <UploadFile setJsonData={setJsonData} closeModal={closeModal} />,
      );
    }
  }, [nodes]);

  useEffect(() => {
    if (jsonData.nodes.length === 0) return;
    const formattedData = getReactFlowFromJson(jsonData);
    if (!formattedData) return;

    setNodes(formattedData?.formattedNodes);
    setEdges(formattedData?.formattedEdges);
  }, [jsonData, setNodes, setEdges]);

  const closeModal = () => setChildrenModelIsOpen(false);
  const openModal = () => setChildrenModelIsOpen(true);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      className="react-flow-container"
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <IconContainer
        openModal={openModal}
        setChildrenModal={setChildrenModal}
        setJsonData={setJsonData}
        closeModal={closeModal}
      />
      <Modal isOpen={isChildrenModelOpen} closeModal={closeModal}>
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
        {/*// @ts-ignore*/}
        <Background variant="lines" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowContainer;
