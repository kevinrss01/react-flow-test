import React from "react";
import { Title, Button } from "@tremor/react";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypeJson } from "react-icons/bs";
import { DownloadFlowProps } from "@/app/types/interface";
import * as XLSX from "xlsx";
import { Node, Edge } from "reactflow";

const downloadExcel = (nodes: Node[], edges: Edge[]) => {
  const flattenedNodes = nodes.map((node) => {
    return {
      id: node.id,
      position_x: node.position?.x,
      position_y: node.position?.y,
      label: node.data?.label,
      type: node.type,
      extent: node.extent,
      parentNode: node.parentNode,
      style: JSON.stringify(node.style),
    };
  });

  const nodesWorksheet = XLSX.utils.json_to_sheet(flattenedNodes);
  const edgesWorksheet = XLSX.utils.json_to_sheet(edges);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, nodesWorksheet, "Nodes");
  XLSX.utils.book_append_sheet(workbook, edgesWorksheet, "Edges");

  XLSX.writeFile(workbook, "data.xlsx");
};

const DownloadFlow: React.FC<DownloadFlowProps> = ({ nodes, edges }) => {
  const handleDownload = (fileType: "JSON" | "Excel") => {
    if (fileType === "Excel") {
      downloadExcel(nodes, edges);
    } else {
      let jsonData = JSON.stringify({
        nodes: nodes,
        edges: edges,
      });

      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const htmlAnchorElement = document.createElement("a");
      htmlAnchorElement.href = url;
      htmlAnchorElement.download = "data.json";
      htmlAnchorElement.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-[200px] flex flex-col items-center">
      <Title className="text-center">Download your Flow</Title>
      <div className="button-container gap-6 flex flex-col items-center justify-center h h-[100%]">
        <Button icon={BsFiletypeJson} onClick={() => handleDownload("JSON")}>
          Download in JSON format (recommended)
        </Button>
        <Button icon={SiMicrosoftexcel} onClick={() => handleDownload("Excel")}>
          Download in Excel format (xlsx)
        </Button>
      </div>
    </div>
  );
};

export default DownloadFlow;
