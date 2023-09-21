import { Edge, Node } from "reactflow";
import {
  ColorType,
  ExcelConvertedJson,
  ExcelConvertedJsonEdge,
  ExcelConvertedJsonNode,
} from "@/app/types/interface";
import { toast } from "react-toastify";

//TODO : Create a function to adapt the group position depending of the group number and the number of nodes in the group
//TODO : Create a function to adapt the node position in the group depending of the group number and the number of nodes in the group

export const getReactFlowFromJson = (
  jsonData: ExcelConvertedJson,
):
  | {
      formattedNodes: Node[];
      formattedEdges: Edge[];
    }
  | undefined => {
  const { nodes, edges } = jsonData;
  try {
    const formattedEdges: Edge[] = getEdgesData(edges);
    const formattedNodes: Node[] = createNodesData(nodes, formattedEdges);

    return {
      formattedNodes,
      formattedEdges,
    };
  } catch (error) {
    console.error(error);
    toast.error("Error while converting JSON to ReactFlow.");
  }
};

export const createNodesData = (
  jsonDataNode: ExcelConvertedJsonNode[],
  edgesData: Edge[],
) => {
  const formattedNodes: Node[] = [];
  const numberNodeByGroup = getNumberNodeByGroup(jsonDataNode);
  const sizeByGroup = setSizeByGroup(numberNodeByGroup, edgesData);
  //const groupPosition = getGroupPosition(sizeByGroup, edgesData);

  let indexGroup = 0;
  let nodePositionInGroup: {
    [key: string]: {
      x: number;
      y: number;
    };
  } = {};
  let indexNodeInGroup: {
    [key: string]: number;
  } = {};

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

    !indexNodeInGroup[nodeGroup]
      ? (indexNodeInGroup[nodeGroup] = 0)
      : indexNodeInGroup[nodeGroup]++;

    if (!nodePositionInGroup[nodeGroup]) {
      nodePositionInGroup[nodeGroup] = {
        x: 25,
        y: 50,
      };
    } else {
      const spaceBetweenNodes = 165;
      const nodePerRow = 3;
      nodePositionInGroup[nodeGroup].x += spaceBetweenNodes;

      nodePositionInGroup[nodeGroup].y =
        Math.floor(indexNodeInGroup[nodeGroup] / nodePerRow + 1) + 50;
    }

    formattedNodes.push({
      id: nodeId.toString(),
      position: {
        x: nodePositionInGroup[nodeGroup].x,
        y: nodePositionInGroup[nodeGroup].y,
      },
      data: { label: `${nodeName} (${nodeId})` },
      type: "",
      extent: "parent",
      parentNode: nodeGroup,
      style: {
        backgroundColor: getTransparentBackgroundColor(nodeColor),
      },
    });
  });

  return formattedNodes;
};

function getTransparentBackgroundColor(color: ColorType): string {
  let rgbaColor: string;

  switch (color) {
    case "orange":
      rgbaColor = "rgba(255, 165, 0, 0.5)"; // Orange avec une transparence de 0.5
      break;
    case "green":
      rgbaColor = "rgba(0, 128, 0, 0.5)"; // Green avec une transparence de 0.5
      break;
    case "black":
      rgbaColor = "rgba(0, 0, 0, 0.5)"; // Black avec une transparence de 0.5
      break;
    default:
      throw new Error("Invalid color type");
  }

  return rgbaColor;
}

export const getNumberNodeByGroup = (nodes: ExcelConvertedJsonNode[]) => {
  let groupData: {
    [key: string]: {
      nodesNumber: number;
      nodes: number[];
    };
  } = {};

  nodes.forEach((node, index) => {
    const {
      "Node ID": nodeId,
      "Node Group": nodeGroup,
      "Node color": nodeColor,
      "Node name": nodeName,
    } = node;

    if (!groupData[nodeGroup]) {
      groupData[nodeGroup] = {
        nodesNumber: 0,
        nodes: [],
      };
    }

    groupData[nodeGroup].nodesNumber++;
    groupData[nodeGroup].nodes.push(nodeId);
  });

  return groupData;
};

interface NumberNodeByGroup {
  [key: string]: {
    nodesNumber: number;
    nodes: number[];
    width?: number;
    height?: number;
  };
}

interface SizeByGroup {
  [key: string]: {
    nodesNumber: number;
    nodes: number[];
    width: number;
    height: number;
  };
}

export const setSizeByGroup = (
  numberNodeByGroup: NumberNodeByGroup,
  edgesData: Edge[],
): SizeByGroup => {
  const numberOfNodesPerRow = 3;

  const getGroupHeight = (nodesNumber: number) =>
    Math.floor(nodesNumber / numberOfNodesPerRow + 1);

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
      nodes: number[];
      width: number;
      height: number;
    };
  } = {};

  Object.keys(numberNodeByGroup).forEach((group) => {
    let groupDetail = numberNodeByGroup[group];
    const { nodesNumber } = groupDetail;

    sizeByGroup[group] = {
      nodesNumber,
      nodes: groupDetail.nodes,
      height: getGroupHeight(nodesNumber) * 120,
      width: getGroupWidth(nodesNumber),
    };
  });

  return sizeByGroup;
};

interface GroupTree {
  top: any[];
  base:
    | {
        name: string;
        width: number;
        height: number;
      }
    | undefined;
  bottom: any[];
}

const getGroupPosition = (
  sizeAndNodesDataByGroup: SizeByGroup,
  edgeData: Edge[],
) => {
  //
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
