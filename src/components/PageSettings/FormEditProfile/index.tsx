"use client";

import { TProfile } from "@/fetchings/type";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import AvatarProfile from "../../PageProfile/AvatarProfile";
import Inputs from "./Inputs";
import { editProfile } from "./action";

type Props = {
  user: TProfile;
  callback?: VoidFunction;
};

const initialState = {
  type: "",
  message: "",
  errors: {} as any,
  data: {} as any,
};

const FormEditProfile = ({ user, callback }: Props) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const editProfileAction = editProfile.bind(null, {
    userId: session?.user.id ?? "",
  });

  const [state, action] = useFormState(editProfileAction, initialState);
  const [mid, setMid] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (state.type === "success") {
      const { name } = state.data;
      toast.success(state.message, { theme });
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
  }, [mid]);
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
      <form
        action={(data) => {
          setMid(new Date().getTime());
          action(data);
        }}
      >
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
