"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { useSessionStore } from "@/stores/SessionStore";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { changeUsernameAction } from "./actionChangeUsername";

const FormChangeUsername = () => {
  const { update } = useSession();
  const { session } = useSessionStore();
  const action = changeUsernameAction.bind(null, session?.user.id ?? "");

  const { execute, result, hasErrored, hasSucceeded, isExecuting } =
    useAction(action);

  const currUsernameErrValidation = result.validationErrors?.currentUsername;
  const newUsernameErrValidation = result.validationErrors?.newUsername;

  const { theme } = useTheme();
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (hasSucceeded && result.data?.message) {
      toast.success(result.data?.message, { theme });
      formRef.current?.reset();
      const user = result.data.data;
      update({
        id: user?.id,
        username: user?.username,
        name: user?.name,
        image: user?.avatar,
      }).then(() => {
        router.refresh();
      });
    }
  }, [hasSucceeded]);

  useEffect(() => {
    if (hasErrored) {
      toast.error(result.serverError, { theme });
    }
  }, [hasErrored]);

  return (
    <form
      ref={formRef}
      className="flex w-full max-w-md flex-col gap-4"
      action={execute}
    >
      <fieldset className="space-y-3" disabled={isExecuting}>
        <TextInput
          errorMessage={
            currUsernameErrValidation && currUsernameErrValidation[0]
          }
          name="currentUsername"
          label="Current username"
        />
        <TextInput
          errorMessage={newUsernameErrValidation && newUsernameErrValidation[0]}
          name="newUsername"
          label="New username"
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

export default FormChangeUsername;
