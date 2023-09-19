export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

export interface IconContainerProps {
  openModal: () => void;
  setChildrenModal: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setJsonData: React.Dispatch<React.SetStateAction<{}[]>>;
  closeModal: () => void;
}

export interface UploadFileProps {
  setJsonData: React.Dispatch<React.SetStateAction<{}[]>>;
  closeModal: () => void;
}
