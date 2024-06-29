"use client";

import { useFormStatus } from "react-dom";
import MySpinner from "../../../../../components/Spinner";

const UploadIndicator = () => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-500/50">
        <MySpinner />
      </div>
    );
  }
  return null;
};

export default UploadIndicator;
