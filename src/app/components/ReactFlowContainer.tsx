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
  Panel,
} from "reactflow";
import Modal from "./Modal";
import UploadFile from "@/app/components/UploadFile";
import { getReactFlowFromJson } from "@/utils/jsonToFlow";
import { ExcelConvertedJson } from "@/app/types/interface";

import "reactflow/dist/style.css";
import { ToastContainer } from "react-toastify";
import { Button, Select, SelectItem } from "@tremor/react";

type NodeType = "Group" | "input" | "output" | "default" | "resizeRotate";

const getId = (nodesLength: number, type: NodeType) => {
  return type === "Group"
    ? `Group ${nodesLength + 1}`
    : `Node ${nodesLength + 1}`;
};

const ReactFlowContainer = () => {
  // @ts-ignore
  const [nodes, setNodes] = useNodesState<Node[]>([]);
  const [edges, setEdges] = useEdgesState<Edge[]>([]);
  const [isChildrenModelOpen, setChildrenModelIsOpen] =
    useState<boolean>(false);
  const [childrenModal, setChildrenModal] = useState<React.ReactNode>(null);
  const [jsonData, setJsonData] = useState<ExcelConvertedJson>({
    nodes: [],
    edges: [],
  });
  const [jsonFormattedData, setJsonFormattedData] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (nodes.length === 0) {
      setChildrenModelIsOpen(true);
      setChildrenModal(
        <UploadFile
          setJsonData={setJsonData}
          closeModal={closeModal}
          setJsonFormattedData={setJsonFormattedData}
        />
      );
    }
  }, [nodes]);

  useEffect(() => {
    console.log("geg");
    if (jsonData.nodes.length === 0) return;
    const formattedData = getReactFlowFromJson(jsonData);
    if (!formattedData) return;

    setNodes(formattedData?.formattedNodes);
    setEdges(formattedData?.formattedEdges);
  }, [jsonData, setNodes, setEdges]);

  useEffect(() => {
    setNodes(jsonFormattedData?.nodes);
    setEdges(jsonFormattedData?.edges);
  }, [jsonFormattedData, setNodes, setEdges]);
  const closeModal = () => setChildrenModelIsOpen(false);
  const openModal = () => setChildrenModelIsOpen(true);

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

  const onAdd = useCallback(
    (type: NodeType) => {
      const newNodes = [...nodes];

      const newNode = {
        id: getId(nodes.length, type),
        data: { label: type === "Group" ? "" : getId(nodes.length, type) },
        type: type,
        position: {
          x: Math.random() * window.innerWidth - 500,
          y: Math.random() * window.innerHeight,
        },
        style: {},
      };

      if (type === "Group") {
        newNode.style = {
          backgroundColor: "rgba(240,240,240,0.25)",
          width: 300,
          height: 200,
          padding: 10,
        };
      }

      newNodes.push(newNode as Node);
      setNodes(newNodes);
    },
    [setNodes, nodes]
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
        setJsonFormattedData={setJsonFormattedData}
        nodes={nodes}
        edges={edges}
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
        <Panel position="top-left">
          <Select
            placeholder="Add node"
            onValueChange={(value) => onAdd(value as NodeType)}
          >
            <SelectItem value="default">Default Node</SelectItem>
            <SelectItem value="input">Input Node</SelectItem>
            <SelectItem value="output">Output Node</SelectItem>
            <SelectItem value="Group">Group</SelectItem>
          </Select>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ReactFlowContainer;
