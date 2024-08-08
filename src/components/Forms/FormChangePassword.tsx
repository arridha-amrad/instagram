"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { actionChangePassword } from "@/lib/next-safe-action/actionChangePassword";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { toast } from "react-toastify";

const FormChangePassword = () => {
  const ref = useRef<HTMLFormElement | null>(null);
  const { theme } = useTheme();

  const { execute, isExecuting, result } = useAction(actionChangePassword, {
    onError: ({ error: { serverError } }) => {
      if (serverError) {
        toast.error(serverError, { theme });
      }
    },
    onSuccess: ({ data }) => {
      ref.current?.reset();
      if (data) {
        toast.success("Password change successfully", { theme });
      }
    },
  });

  const newPasswordError = result.validationErrors?.newPassword;
  const oldPasswordError = result.validationErrors?.oldPassword;

  return (
    <form ref={ref} className="flex w-full max-w-md" action={execute}>
      <fieldset disabled={isExecuting} className="flex w-full flex-col gap-3">
        <TextInput
          errorMessage={oldPasswordError && oldPasswordError[0]}
          name="oldPassword"
          label="Current password"
          type="password"
        />
        <TextInput
          errorMessage={newPasswordError && newPasswordError[0]}
          name="newPassword"
          label="New password"
          type="password"
        />
        <div className="self-end">
          <Button isLoading={isExecuting} type="submit" className="h-10 w-24">
            Update
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default FormChangePassword;
