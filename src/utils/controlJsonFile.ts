const requiredNodesFields = ["id", "position", "data"];
const optionalNodesFields = [
  "type",
  "style",
  "className",
  "sourcePosition",
  "targetPosition",
  "hidden",
  "selected",
  "dragging",
  "draggable",
  "selectable",
  "connectable",
  "deletable",
  "dragHandle",
  "width",
  "height",
  "parentNode",
  "zIndex",
  "extent",
  "expandParent",
  "positionAbsolute",
  "ariaLabel",
  "focusable",
  "resizing",
];

const requiredEdgesFields = ["id", "source", "target"];
const optionalEdgesFields = [
  "type",
  "sourceHandle",
  "targetHandle",
  "style",
  "animated",
  "hidden",
  "deletable",
  "data",
  "className",
  "sourceNode",
  "targetNode",
  "selected",
  "markerStart",
  "markerEnd",
  "zIndex",
  "ariaLabel",
  "interactionWidth",
  "focusable",
  "updatable",
];

const controlJsonFile = (json: any): void => {
  if (!json.nodes || !json.edges) {
    throw new Error("Your file should have a nodes and edges key");
  }

  json.nodes.forEach((node: { [key: string]: any }) => {
    const nodesKeys = Object.keys(node);

    if (nodesKeys.length < 3) {
      throw new Error("Please provide a valid json file.");
    }

    checkFields(nodesKeys, "nodes");
  });

  json.edges.forEach((edge: { [key: string]: any }) => {
    const edgesKeys = Object.keys(edge);

    if (edgesKeys.length < 3) {
      throw new Error("Please provide a valid json file.");
    }

    checkFields(edgesKeys, "edges");
  });
};

const checkFields = (keys: string[], typeObj: "nodes" | "edges") => {
  const requiredFields =
    typeObj === "nodes" ? requiredNodesFields : requiredEdgesFields;

  const optionalFields =
    typeObj === "nodes" ? optionalNodesFields : optionalEdgesFields;

  requiredFields.forEach((field) => {
    if (!keys.includes(field)) {
      throw new Error(
        `Your file should have a "${field}" key for each ${typeObj} object`
      );
    }
  });

  keys.forEach((key) => {
    if (!optionalFields.includes(key) && !requiredFields.includes(key)) {
      throw new Error(`${typeObj} object contains an invalid key: ${key}`);
    }
  });
};
export default controlJsonFile;
