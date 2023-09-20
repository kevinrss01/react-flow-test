import { Edge, Node } from "reactflow";
import {
  ExcelConvertedJson,
  ExcelConvertedJsonNode,
  ExcelConvertedJsonEdge,
} from "@/app/types/interface";

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

//TODO : Create a function to adapt the group position depending of the group number and the number of nodes in the group
//TODO : Create a function to adapt the node position in the group depending of the group number and the number of nodes in the group

export const getReactFlowFromJson = (
  jsonData: ExcelConvertedJson,
): {
  formattedNodes: Node[];
  formattedEdges: Edge[];
} => {
  const { nodes, edges } = jsonData;

  const formattedNodes: Node[] = createNodesData(nodes);
  const formattedEdges: Edge[] = getEdgesData(edges);

  return {
    formattedNodes,
    formattedEdges,
  };
};

export const createNodesData = (jsonDataNode: ExcelConvertedJsonNode[]) => {
  const formattedNodes: Node[] = [];
  const numberNodeByGroup = getNumberNodeByGroup(jsonDataNode);
  const sizeByGroup = setSizeByGroup(numberNodeByGroup);
  let indexGroup = 0;

  jsonDataNode.forEach((node, index) => {
    const {
      "Node ID": nodeId,
      "Node Group": nodeGroup,
      "Node color": nodeColor,
      "Node name": nodeName,
    } = node;

    if (!formattedNodes.some((n) => n.data.label === nodeGroup)) {
      indexGroup++;
      formattedNodes.push({
        id: nodeGroup,
        position: { x: 0, y: indexGroup * 200 },
        data: { label: nodeGroup },
        type: "Group",
        style: {
          width: sizeByGroup[nodeGroup]?.width,
          height: sizeByGroup[nodeGroup]?.height,
          backgroundColor: "rgba(240,240,240,0.25)",
        },
      });
    }

    formattedNodes.push({
      id: nodeId.toString(),
      position: {
        x: numberNodeByGroup[nodeGroup].nodesNumber * 25,
        y: 50,
      },
      data: { label: nodeName },
      type: "",
      extent: "parent",
      parentNode: nodeGroup,
    });
  });

  console.log(formattedNodes);

  return formattedNodes;
};

export const getNumberNodeByGroup = (nodes: ExcelConvertedJsonNode[]) => {
  let groupData: {
    [key: string]: {
      nodesNumber: number;
    };
  } = {};

  nodes.forEach((node, index) => {
    const {
      "Node ID": nodeId,
      "Node Group": nodeGroup,
      "Node color": nodeColor,
      "Node name": nodeName,
    } = node;

    groupData[nodeGroup] = {
      nodesNumber: groupData[nodeGroup]?.nodesNumber + 1 || 1,
    };
  });

  return groupData;
};

export const setSizeByGroup = (numberNodeByGroup: {
  [key: string]: {
    nodesNumber: number;
    width?: number;
    height?: number;
  };
}): {
  [key: string]: {
    nodesNumber: number;
    width: number;
    height: number;
  };
} => {
  console.log(numberNodeByGroup);
  //Each group has three nodes per row (120px per row)
  const getGroupHeight = (nodesNumber: number) =>
    Math.floor(nodesNumber / 3 + 1);

  const getGroupWidth = (nodesNumber: number) => {
    const widthPerNode: { [f: string]: number } = {
      1: 200,
      2: 500,
    };

    return nodesNumber < 3 ? widthPerNode[nodesNumber] : 750;
  };

  let sizeByGroup: {
    [key: string]: {
      nodesNumber: number;
      width: number;
      height: number;
    };
  } = {};

  Object.keys(numberNodeByGroup).forEach((group) => {
    let groupDetail = numberNodeByGroup[group];
    const { nodesNumber } = groupDetail;

    sizeByGroup[group] = {
      nodesNumber,
      height: getGroupHeight(nodesNumber) * 120,
      width: getGroupWidth(nodesNumber),
    };
  });

  console.log(sizeByGroup);

  return sizeByGroup;
};

export const getEdgesData = (jsonDataEdge: ExcelConvertedJsonEdge[]) => {
  const formattedEdges: Edge[] = [];

  jsonDataEdge.forEach((edge) => {
    const { NodeUpstream, NodeDownstream, Label, "Use case": useCase } = edge;

    formattedEdges.push({
      id: `e${NodeDownstream}-${NodeUpstream}`,
      source: NodeDownstream?.toString(),
      target: NodeUpstream?.toString(),
      animated: false,
      data: { label: Label },
    });
  });

  return formattedEdges;
};
