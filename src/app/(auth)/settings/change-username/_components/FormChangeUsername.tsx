"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { changeUsernameAction } from "./action";

const FormChangeUsername = () => {
  const { update } = useSession();
  const { theme } = useTheme();
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const { execute, result, hasSucceeded, isExecuting } = useAction(
    changeUsernameAction,
    {
      onError: ({ error: { serverError } }) => {
        toast.error(serverError, { theme });
      },
    },
  );

  const currUsernameErrValidation = result.validationErrors?.currentUsername;
  const newUsernameErrValidation = result.validationErrors?.newUsername;

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
