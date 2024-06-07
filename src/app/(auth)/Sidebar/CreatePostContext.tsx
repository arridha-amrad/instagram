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
};

const Context = createContext<State>({
  files: [],
  preview: [],
  step: 0,
  setFiles: () => {},
  setPreview: () => {},
  setStep: () => {},
});

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
  const [preview, setPreview] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(0);
  return (
    <Context.Provider
      value={{ files, preview, step, setFiles, setPreview, setStep }}
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
