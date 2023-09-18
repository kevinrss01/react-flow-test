import React from "react";
import { BsKeyboardFill } from "react-icons/bs";

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
              <span className="">{shortcut.action}</span> :{" "}
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
}) => {
  const openNewModal = () => {
    setChildrenModal(<ShortcutsList />);
    openModal();
  };

  return (
    <div className="icon-container">
      <Icon
        size="md"
        icon={BsKeyboardFill}
        variant="solid"
        tooltip="See keyboard shortcuts"
        className="cursor-pointer"
        onClick={() => openNewModal()}
      />
    </div>
  );
};

export default IconContainer;
