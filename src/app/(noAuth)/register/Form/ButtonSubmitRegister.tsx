"use client";

import MySpinner from "@/components/Spinner";
import Button from "@/components/core/Button";
import { useFormStatus } from "react-dom";

const ButtonSubmitRegister = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full inline-flex justify-center"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <>
          <MySpinner />
          loading...
        </>
      ) : (
        "Register"
      )}
    </Button>
  );
};

export default ButtonSubmitRegister;
