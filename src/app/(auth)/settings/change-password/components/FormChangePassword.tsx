"use client";

import { useSession } from "next-auth/react";
import Inputs from "./Inputs";
import { changePasswordAction } from "./action";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import TextInput from "@/components/core/TextInput";
import Button from "@/components/core/Button";

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
      className="flex w-full max-w-md"
      action={(data) => {
        setMid(new Date().getTime());
        action(data);
      }}
    >
      <fieldset disabled={pending} className="flex w-full flex-col gap-3">
        <TextInput name="oldPassword" label="Current password" />
        <TextInput name="newPassword" label="New password" />
        <div className="self-end">
          <Button type="submit" className="h-10 w-24">
            Update
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default FormChangePassword;
