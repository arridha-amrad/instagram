"use client";

import MySpinner from "@/components/Spinner";
import Button from "@/components/core/Button";
import { useFormStatus } from "react-dom";

const ButtonSubmitComment = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="inline-flex justify-center"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <>
          <MySpinner />
          loading...
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
};

export default ButtonSubmitComment;
