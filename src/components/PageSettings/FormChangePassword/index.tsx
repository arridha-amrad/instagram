"use client";

import { useSession } from "next-auth/react";
import Inputs from "./Inputs";
import { changePasswordAction } from "./action";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

const initialState = {
  type: "",
  message: "",
  errors: {} as any,
};

const FormChangePassword = () => {
  const { data: session } = useSession();
  const cp = changePasswordAction.bind(null, session?.user.id ?? "");
  const [state, action] = useFormState(cp, initialState);
  const [mid, setMid] = useState(0);
  const { theme } = useTheme();
  const ref = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message, { theme });
      ref.current?.reset();
    }
    if (state.type === "error") {
      toast.error(state.message, { theme });
    }
  }, [mid]);

  return (
    <form
      ref={ref}
      className="flex w-full max-w-md flex-col gap-4"
      action={(data) => {
        setMid(new Date().getTime());
        action(data);
      }}
    >
      <Inputs />
    </form>
  );
};

export default FormChangePassword;
