import { Button, Title } from "@tremor/react";
import { AiFillFileAdd } from "react-icons/ai";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { FileInput } from "flowbite-react";
import { UploadFileProps } from "@/app/types/interface";

const UploadFile: React.FC<UploadFileProps> = ({ setJsonData, closeModal }) => {
  const [isValidUpload, setIsValidUpload] = useState<boolean>(false);
  const [data, setData] = useState<{}[]>();

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
        const worksheet = workbook.Sheets[worksheetName];
        const data: {}[] = XLSX.utils.sheet_to_json(worksheet);

        setData(data);
        setIsValidUpload(true);
      };
    } catch (error) {
      toast.error("An error occured, please try again");
    }
  };

  const handleFileUpload = () => {
    if (!isValidUpload || !data) {
      toast.error("Please select a file");
      return;
    }

    setJsonData(data);
    closeModal();
    toast.success("File uploaded successfully !");
  };

  return (
    <div className="flex items-center flex-col justify-between h-[200px]">
      <Title className="mb-5">Add an excel file to create a new Flow </Title>
      <FileInput
        aria-describedby="file_input_help"
        className="text-[#3b82f6]"
        helperText='Accepts only ".xls", ".xlsx"'
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
  );
};

export default UploadFile;
