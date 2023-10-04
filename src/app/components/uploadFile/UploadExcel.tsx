import { Text, Title, Button } from "@tremor/react";
import React, { useState } from "react";
import { FileInput } from "flowbite-react";
import { AiFillFileAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  ExcelConvertedJson,
  ExcelConvertedJsonEdge,
  ExcelConvertedJsonNode,
} from "@/app/types/interface";
import { UploadExcelFileProps } from "@/app/types/interface";

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

  const handleFileUpload = () => {
    if (!isValidUpload || !data) {
      toast.error("Please select a files");
      return;
    }

    setJsonData(data);
    closeModal();
    toast.success("File uploaded successfully !");
  };

  return (
    <>
      <Title className="mb-5">Add an excel file to create a new Flow</Title>
      <div className="flex items-center flex-col justify-between h-[150px] ">
        <Text>Not available for the moment.</Text>
        <FileInput
          aria-describedby="file_input_help"
          className="text-[#3b82f6]"
          helperText="Unavailable for the moment"
          id="file"
          accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={handleFileChange}
        />
        <Button
          icon={AiFillFileAdd}
          onClick={() => handleFileUpload()}
          disabled={!isValidUpload}
        >
          Add this file
        </Button>
      </div>
    </>
  );
};
