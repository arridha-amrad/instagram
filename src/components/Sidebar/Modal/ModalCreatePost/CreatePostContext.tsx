"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type State = {
  preview: string[];
  setPreview: Dispatch<SetStateAction<string[]>>;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  isSubmitSuccessful: boolean;
  setSubmitSuccessful: Dispatch<SetStateAction<boolean>>;
};

const Context = createContext<State>({
  files: [],
  preview: [],
  step: 0,
  setFiles: () => {},
  setPreview: () => {},
  setStep: () => {},
  isSubmitSuccessful: false,
  setSubmitSuccessful: () => {},
});

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
  const [preview, setPreview] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(0);
  const [isSubmitSuccessful, setSubmitSuccessful] = useState(false);
  return (
    <Context.Provider
      value={{
        files,
        preview,
        step,
        setFiles,
        setPreview,
        setStep,
        isSubmitSuccessful,
        setSubmitSuccessful,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCreatePost = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Provider not found");
  }
  return context;
};
