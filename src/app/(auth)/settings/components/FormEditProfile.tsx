"use client";

import { TProfile } from "@/fetchings/type";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import AvatarProfile from "../../[username]/components/EditableAvatar";
import Inputs from "./Inputs";
import { editProfileAction } from "./action";
import { useSessionStore } from "@/stores/SessionStore";
import { useAction } from "next-safe-action/hooks";

type Props = {
  user: TProfile;
  callback?: VoidFunction;
};

const FormEditProfile = ({ user, callback }: Props) => {
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
          callback && callback();
          router.refresh();
        });
      } else {
        callback && callback();
      }
    }
    if (state.type === "error") {
      toast.error(state.message, { theme });
    }
  }, [hasSucceeded]);
  return (
    <div className="relative w-full max-w-md space-y-6">
      <div className="flex items-center justify-center gap-6">
        <div className="">
          <AvatarProfile
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
          username={user?.username ?? ""}
          name={user?.name ?? ""}
          userInfo={user?.userInfo ?? null}
        />
      </form>
    </div>
  );
};

export default FormEditProfile;
