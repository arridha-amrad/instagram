"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { useSessionStore } from "@/stores/SessionStore";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { changePasswordAction } from "./action";

const FormChangePassword = () => {
  const { session } = useSessionStore();
  const cp = changePasswordAction.bind(null, session?.user.id ?? "");
  const { execute, hasErrored, hasSucceeded, isExecuting, result } =
    useAction(cp);
  const newPasswordError = result.validationErrors?.newPassword;
  const oldPasswordError = result.validationErrors?.oldPassword;
  const { theme } = useTheme();
  const ref = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (hasSucceeded) {
      if (result.data?.message) {
        toast.success(result.data.message, { theme });
        ref.current?.reset();
      }
      if (result.data?.err) {
        toast.error(result.data.err, { theme });
      }
    }
  }, [hasSucceeded]);

  useEffect(() => {
    if (hasErrored) {
      toast.error(result.serverError, { theme });
    }
  }, [hasErrored]);

  return (
    <form ref={ref} className="flex w-full max-w-md" action={execute}>
      <fieldset disabled={isExecuting} className="flex w-full flex-col gap-3">
        <TextInput
          errorMessage={oldPasswordError && oldPasswordError[0]}
          name="oldPassword"
          label="Current password"
        />
        <TextInput
          errorMessage={newPasswordError && newPasswordError[0]}
          name="newPassword"
          label="New password"
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
