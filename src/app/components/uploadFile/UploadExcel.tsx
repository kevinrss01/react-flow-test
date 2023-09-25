import { Text, Title, Button } from "@tremor/react";
import React, { useState } from "react";
//import { FileInput } from "flowbite-react";
//import { AiFillFileAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  ExcelConvertedJson,
  ExcelConvertedJsonEdge,
  ExcelConvertedJsonNode,
} from "@/app/types/interface";
import { UploadExcelFileProps } from "@/app/types/interface";

const exampleData: {
  nodes: ExcelConvertedJsonNode[];
  edges: ExcelConvertedJsonEdge[];
} = {
  nodes: [
    {
      "Node ID": 1,
      "Node name": "Asset Management",
      "Node Group": "AssetTraceability",
      "Node color": "orange",
    },
    {
      "Node ID": 2,
      "Node name": "Asset V0",
      "Node Group": "AssetTraceability",
      "Node color": "orange",
    },
    {
      "Node ID": 3,
      "Node name": "BIM authoring",
      "Node Group": "ProjectManagement",
      "Node color": "green",
    },
    {
      "Node ID": 4,
      "Node name": "Maintenance",
      "Node Group": "Operation&Maintenance",
      "Node color": "black",
    },
  ],
  edges: [
    {
      "Use case": "Impact analysis",
      NodeUpstream: 2,
      NodeDownstream: 1,
      Label: "Shared",
    },
    {
      "Use case": "Impact analysis",
      NodeUpstream: 1,
      NodeDownstream: 4,
      Label: "Shared",
    },
    {
      "Use case": "New PIM integration",
      NodeUpstream: 2,
      NodeDownstream: 1,
      Label: "Shared",
    },
    {
      "Use case": "New PIM integration",
      NodeUpstream: 3,
      NodeDownstream: 2,
      Label: "Shared",
    },
    {
      "Use case": "New PIM integration",
      NodeUpstream: 1,
      NodeDownstream: 4,
      Label: "Shared",
    },
  ],
};

export const UploadExcel: React.FC<UploadExcelFileProps> = ({
  closeModal,
  setJsonData,
}) => {
  const [isValidUpload, setIsValidUpload] = useState<boolean>(false);
  const [data, setData] = useState<ExcelConvertedJson>({
    nodes: [],
    edges: [],
  });
  const handleFileChange = async (event: any) => {
    if (event.target.files.length === 0) {
      toast.error("Please select a file");
    }
    try {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(event.target.files[0]);
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;
        const workbook = XLSX.read(bufferArray, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheetName2 = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[worksheetName];
        const worksheet2 = workbook.Sheets[worksheetName2];

        const JsonData: ExcelConvertedJson = {
          nodes: XLSX.utils.sheet_to_json(worksheet),
          edges: XLSX.utils.sheet_to_json(worksheet2),
        };

        setData(JsonData);
        setIsValidUpload(true);
      };
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, please try again");
    }
  };

  const handleFileUpload = (exampleFile: ExcelConvertedJson) => {
    if (!exampleFile) {
      if (!isValidUpload || !data) {
        toast.error("Please select a files");
        return;
      }
    }

    setJsonData(exampleFile ? exampleFile : data);
    closeModal();
    toast.success("File uploaded successfully !");
  };

  return (
    <>
      <Title className="mb-5">Add an excel file to create a new Flow</Title>
      <div className="flex items-center flex-col justify-between h-[150px] ">
        <Text>Not available for the moment.</Text>
        {/*<FileInput*/}
        {/*  aria-describedby="file_input_help"*/}
        {/*  className="text-[#3b82f6]"*/}
        {/*  helperText="Unavailable for the moment"*/}
        {/*  id="file"*/}
        {/*  accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"*/}
        {/*  onChange={handleFileChange}*/}
        {/*/>*/}
        {/*<Button*/}
        {/*  icon={AiFillFileAdd}*/}
        {/*  onClick={() => handleFileUpload(exampleData)}*/}
        {/*  disabled={!isValidUpload}*/}
        {/*>*/}
        {/*  Add this file*/}
        {/*</Button>*/}
      </div>
    </>
  );
};
