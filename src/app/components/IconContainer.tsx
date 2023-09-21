import React, { ReactNode } from "react";
import { BsKeyboardFill, BsFiletypeJson } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";
import { AiOutlineDownload } from "react-icons/ai";
import UploadFile from "@/app/components/UploadFile";

import { Icon, Title, List, ListItem } from "@tremor/react";
import { IconContainerProps } from "../types/interface";

const shortcutsList = [{ action: "Delete Node", shortcut: "Backspace" }];

const ShortcutsList = () => {
  return (
    <div className="flex flex-col items-center w-[100%]">
      <div className="w-[50%] flex flex-col items-center">
        <Title>List of all shortcuts :</Title>
        <br />
        <List>
          {shortcutsList.map((shortcut) => (
            <ListItem key={shortcut.action}>
              <span className="">{shortcut.action}</span> :
              <span className="font-bold">{shortcut.shortcut}</span>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

const IconContainer: React.FC<IconContainerProps> = ({
  openModal,
  setChildrenModal,
  setJsonData,
  closeModal,
}) => {
  const openNewModal = (component: ReactNode) => {
    setChildrenModal(component);
    openModal();
  };

  return (
    <div className="icon-container gap-1">
      <Icon
        size="md"
        icon={AiOutlineDownload}
        variant="solid"
        tooltip="Download Model"
        className="cursor-pointer"
      />
      <Icon
        size="md"
        icon={BsFiletypeJson}
        variant="solid"
        tooltip="import JSON file"
        className="cursor-pointer"
      />
      <Icon
        size="md"
        icon={RiFileExcel2Fill}
        variant={"solid"}
        tooltip={"import Excel files"}
        className="cursor-pointer"
        onClick={() =>
          openNewModal(
            <UploadFile setJsonData={setJsonData} closeModal={closeModal} />,
          )
        }
      />
      <Icon
        size="md"
        icon={BsKeyboardFill}
        variant="solid"
        tooltip="See keyboard shortcuts"
        className="cursor-pointer"
        onClick={() => openNewModal(<ShortcutsList />)}
      />
    </div>
  );
};

export default IconContainer;
