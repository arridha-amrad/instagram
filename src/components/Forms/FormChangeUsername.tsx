"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { actionChangeUsername } from "@/lib/next-safe-action/actionChangeUsername";
import { useSessionStore } from "@/stores/Session";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const FormChangeUsername = () => {
  const { update } = useSession();
  const { theme } = useTheme();
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const { session } = useSessionStore();

  const { execute, result, hasSucceeded, isExecuting } = useAction(
    actionChangeUsername,
    {
      onError: ({ error: { serverError } }) => {
        toast.error(serverError, { theme });
      },
      async onSuccess({ data }) {
        toast.success("Username changed", { theme });
        if (!data || !session) return;
        await update({
          ...session.user,
          username: data,
        });
        router.refresh();
      },
    },
  );

  const currUsernameErrValidation = result.validationErrors?.currentUsername;
  const newUsernameErrValidation = result.validationErrors?.newUsername;

  // useEffect(() => {
  //   if (hasSucceeded && result.data) {
  //     toast.success("Username changed", { theme });
  //     formRef.current?.reset();
  //     update({
  //       ...session?.user,
  //       username: result.data,
  //     }).then(() => {
  //       router.refresh();
  //     });
  //   }
  // }, [hasSucceeded]);

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
