"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { showToast } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { ChangeEvent, useRef, useState } from "react";
import { changePassword } from "./action";

const FormChangePassword = () => {
  const ref = useRef<HTMLFormElement | null>(null);

  const [state, setState] = useState({
    newPassword: "",
    oldPassword: "",
  });

  const { execute, isPending, result } = useAction(changePassword, {
    onError: ({ error: { serverError } }) => {
      if (serverError) {
        showToast(serverError, "error");
      }
    },
    onSuccess: ({ data }) => {
      ref.current?.reset();
      if (data) {
        showToast(data, "success");
      }
      setState({
        ...state,
        newPassword: "",
        oldPassword: "",
      });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const newPasswordError = result.validationErrors?.newPassword?._errors;
  const oldPasswordError = result.validationErrors?.oldPassword?._errors;

  return (
    <form ref={ref} className="flex w-full max-w-md" action={execute}>
      <fieldset disabled={isPending} className="flex w-full flex-col gap-3">
        <TextInput
          errorMessage={oldPasswordError && oldPasswordError[0]}
          onChange={handleChange}
          value={state.oldPassword}
          name="oldPassword"
          label="Current password"
          type="password"
        />
        <TextInput
          errorMessage={newPasswordError && newPasswordError[0]}
          onChange={handleChange}
          value={state.newPassword}
          name="newPassword"
          label="New password"
          type="password"
        />
        <div className="self-end">
          <Button isLoading={isPending} type="submit" className="h-10 w-24">
            Update
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default FormChangePassword;
