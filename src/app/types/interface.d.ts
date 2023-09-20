import React from "react";

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

export interface IconContainerProps {
  openModal: () => void;
  setChildrenModal: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setJsonData: React.Dispatch<React.SetStateAction<ExcelConvertedJson>>;
  closeModal: () => void;
}

export interface UploadFileProps {
  setJsonData: React.Dispatch<React.SetStateAction<ExcelConvertedJson>>;
  closeModal: () => void;
}

export interface ExcelConvertedJsonNode {
  "Node ID": number;
  "Node Group": string;
  "Node color": string;
  "Node name": string;
}

export interface ExcelConvertedJsonEdge {
  NodeDownstream: number;
  NodeUpstream: number;
  "Use case": string;
  Label: string;
}

export interface ExcelConvertedJson {
  nodes: ExcelConvertedJsonNode[];
  edges: excelConvertedJsonEdge[];
}
