"use client";

import { TProfile } from "@/fetchings/type";
import { useSessionStore } from "@/stores/SessionStore";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Inputs from "./Inputs";
import { editProfileAction } from "./actionEditProfile";
import EditableAvatar from "@/components/EditableAvatar";

type Props = {
  user: TProfile;
};

const FormEditProfile = ({ user }: Props) => {
  const { update } = useSession();
  const { session } = useSessionStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const epa = editProfileAction.bind(null, session?.user.id ?? "");
  const { execute, isExecuting, hasErrored, hasSucceeded, result } =
    useAction(epa);
  const { theme } = useTheme();

  useEffect(() => {
    if (hasSucceeded && result.data?.message) {
      const { name } = result.data.data;
      toast.success(result.data.message, { theme });
      if (name !== user?.name) {
        update({
          id: session?.user.id,
          image: session?.user.image,
          username: session?.user.username,
          name,
        }).then(() => {
          router.refresh();
        });
      }
    }
  }, [hasSucceeded]);

  useEffect(() => {
    if (hasErrored) {
      toast.error("Something went wrong", { theme });
    }
  }, [hasErrored]);

  return (
    <div className="relative w-full max-w-md space-y-6">
      <div className="flex items-center justify-center gap-6">
        <div className="">
          <EditableAvatar
            ref={inputRef}
            className="w-20 lg:w-20"
            avatar={user?.avatar}
          />
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="font-semibold text-skin-inverted"
        >
          Change Avatar
        </button>
      </div>
      <form action={execute}>
        <Inputs
          isExecuting={isExecuting}
          name={user?.name ?? ""}
          userInfo={user?.userInfo ?? null}
        />
      </form>
    </div>
  );
};

export default FormEditProfile;
