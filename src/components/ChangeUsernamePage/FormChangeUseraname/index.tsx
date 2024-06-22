"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import Inputs from "./Inputs";
import { changeUsernameAction } from "./action";
import { useRouter } from "next/navigation";

const initialState = {
  type: "",
  message: "",
  errors: {} as any,
};

const FormChangeUsername = () => {
  const { data, update } = useSession();
  const act = changeUsernameAction.bind(null, data?.user.id ?? "");
  const [state, action] = useFormState(act, initialState);
  const currUsernameErrMessage = state.errors?.currentUsername;
  const newUsernameErrMessage = state.errors?.newUsername;
  const [mid, setMid] = useState(0);
  const { theme } = useTheme();
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message, { theme });
      formRef.current?.reset();
      const result = state.data;
      update({
        id: result?.id,
        username: result?.username,
        name: result?.name,
        image: result?.avatar,
      }).then(() => {
        router.refresh();
      });
    }
    if (state.type === "error") {
      toast.error(state.message, { theme });
    }
  }, [mid]);

  return (
    <form
      ref={formRef}
      className="flex w-full max-w-md flex-col gap-4"
      action={(data) => {
        setMid(new Date().getTime());
        action(data);
      }}
    >
      <Inputs
        newUsernameErrMessage={
          newUsernameErrMessage && newUsernameErrMessage[0]
        }
        currUsernameErrMessage={
          currUsernameErrMessage && currUsernameErrMessage[0]
        }
      />
    </form>
  );
};

export default FormChangeUsername;
