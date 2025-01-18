"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { showToast } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { changeUsername } from "./action";

const FormChangeUsername = () => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const pathname = usePathname();
  const [state, setState] = useState({
    currentUsername: "",
    newUsername: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const { execute, result, isPending } = useAction(
    changeUsername.bind(null, pathname),
    {
      async onSuccess({ data }) {
        if (data) {
          showToast(data, "success");
        }
      },
    },
  );

  const currUsernameErrValidation =
    result.validationErrors?.currentUsername?._errors;
  const newUsernameErrValidation =
    result.validationErrors?.newUsername?._errors;
  const actionError = result.serverError;

  return (
    <form ref={formRef} className="w-full max-w-md" action={execute}>
      <fieldset className="space-y-3" disabled={isPending}>
        {actionError && <p className="text-sm text-red-500">{actionError}</p>}
        <TextInput
          onChange={handleChange}
          value={state.currentUsername}
          errorMessage={
            currUsernameErrValidation && currUsernameErrValidation[0]
          }
          name="currentUsername"
          label="Current username"
        />
        <TextInput
          onChange={handleChange}
          value={state.newUsername}
          errorMessage={newUsernameErrValidation && newUsernameErrValidation[0]}
          name="newUsername"
          label="New username"
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

export default FormChangeUsername;
