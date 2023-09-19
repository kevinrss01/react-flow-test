import { Edge, Node } from "reactflow";

// const initialNodes = [
//   {
//     id: "1",
//     position: { x: 0, y: 0 },
//     data: { label: "Node 1" },
//     type: "input",
//   },
//   {
//     id: "2",
//     position: { x: 0, y: 100 },
//     data: { label: "Node 2" },
//   },
//   {
//     id: "3",
//     position: { x: 0, y: 200 },
//     data: { label: "Node 3" },
//   },
//   {
//     id: "4",
//     type: "group",
//     position: { x: 170, y: 100 },
//     data: { label: "group 1" },
//     style: {
//       width: 280,
//       height: 160,
//     },
//   },
//   {
//     id: "4A",
//     position: { x: 60, y: 10 },
//     data: { label: "Node A" },
//     parentNode: "4",
//     extent: "parent",
//   },
//   {
//     id: "4B",
//     position: { x: 60, y: 70 },
//     data: { label: "Node AB" },
//     parentNode: "4",
//     extent: "parent",
//   },
//   {
//     id: "5",
//     type: "output",
//     position: { x: 0, y: 300 },
//     data: null,
//     style: {
//       width: 170,
//       height: 160,
//       backgroundColor: "rgba(240,240,240,0.25)",
//     },
//   },
//   {
//     id: "5A",
//     data: { label: "Child 1" },
//     position: { x: 50, y: 10 },
//     parentNode: "5",
//     extent: "parent",
//     draggable: false,
//     style: {
//       width: 60,
//     },
//   },
//   {
//     id: "5B",
//     data: { label: "Child 2" },
//     position: { x: 10, y: 90 },
//     parentNode: "5",
//     extent: "parent",
//     draggable: false,
//     style: {
//       width: 60,
//     },
//   },
//   {
//     id: "5C",
//     data: { label: "Child 3" },
//     position: { x: 100, y: 90 },
//     parentNode: "5",
//     extent: "parent",
//     draggable: false,
//     style: {
//       width: 60,
//     },
//   },
// ];
//
// const initialEdges = [
//   { id: "e1-2", source: "1", target: "2" },
//   { id: "e2-3", source: " 2", target: "3", animated: true },
//   { id: "e3-5", source: "3", target: "5" },
// ];

export const getReactFlowFromJson = (
  json: {}[],
): {
  nodes: Node[];
  edges: Edge[];
} => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  Object.entries(json[0]).forEach(([key, value], index) => {
    nodes.push({
      id: index.toString(),
      data: { label: key },
      position: { x: 0, y: index * 100 },
    });
  });

  return {
    nodes: nodes,
    edges: edges,
  };
};
