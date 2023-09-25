import { Button, Title } from "@tremor/react";
import { FileInput } from "flowbite-react";
import { AiFillFileAdd } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import controlJsonFile from "@/utils/controlJsonFile";
import { Edge, Node } from "reactflow";
import { UploadJsonFileProps } from "@/app/types/interface";

export const UploadJson: React.FC<UploadJsonFileProps> = ({
  setJsonFormattedData,
  closeModal,
}) => {
  const [isValidJsonUpload, setIsValidJsonUpload] = useState<boolean>(false);
  const [unverifiedJson, setUnverifiedJson] = useState<{}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleJsonFileChange = (event: any) => {
    const jsonFile = event.target.files[0];

    if (event.target.files.length === 0) {
      toast.error("Please select a file");
    }

    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        const parsedJson = JSON.parse(event.target?.result as string);
        setUnverifiedJson(parsedJson);
      };

      reader.readAsText(jsonFile);
      setIsValidJsonUpload(true);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, please try again later.");
    }
  };

  const handleJsonFileUpload = () => {
    try {
      controlJsonFile(unverifiedJson);
      const verifiedJson = unverifiedJson as {
        nodes: Node[];
        edges: Edge[];
      };
      setJsonFormattedData(verifiedJson);

      closeModal();
      toast.success("File uploaded successfully !");
    } catch (err) {
      console.error(err);
      toast.error(`An error occurred, please try again : ${err}`);
    }
  };

  const handleDeleteJsonFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.files = null;

      setIsValidJsonUpload(false);
      setUnverifiedJson({});
    }
  };

  return (
    <>
      <Title className="mb-5">Add JSON file to create a new Flow</Title>
      <div className="flex items-center flex-col justify-between h-[150px] ">
        <FileInput
          aria-describedby="file_input_help"
          className="text-[#3b82f6]"
          helperText="Accepts only .json file"
          id="file"
          accept=".json"
          onChange={handleJsonFileChange}
          ref={fileInputRef}
        />

        <div>
          <Button
            icon={AiFillFileAdd}
            disabled={!isValidJsonUpload}
            onClick={handleJsonFileUpload}
            className="m-1"
          >
            Add this file
          </Button>
          <Button
            icon={BsFillTrashFill}
            disabled={!isValidJsonUpload}
            onClick={handleDeleteJsonFile}
            className="m-1"
            color={"red"}
          >
            Delete This file
          </Button>
        </div>
      </div>
    </>
  );
};
