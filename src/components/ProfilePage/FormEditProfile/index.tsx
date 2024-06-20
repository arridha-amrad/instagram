"use client";

import Button from "@/components/core/Button";
import Wrapper from "@/components/core/Modals/Wrapper";
import { useEffect, useRef, useState } from "react";
import AvatarProfile from "../AvatarProfile";
import { TProfile } from "@/fetchings/type";
import Inputs from "./Inputs";
import { signOut, useSession } from "next-auth/react";
import { editProfile } from "./action";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

type Props = {
  user: TProfile;
};

const initialState = {
  type: "",
  message: "",
  errors: {} as any,
  data: {} as any,
};

const EditProfile = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: session, update } = useSession();
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
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
      console.log(state.message);

      const { name } = state.data;
      toast.success(state.message, { theme });
      update({
        id: session?.user.id,
        image: session?.user.image,
        username: session?.user.username,
        name,
      }).then(() => {
        closeModal();
        router.refresh();
      });
    }
    if (state.type === "error") {
      toast.error(state.message, { theme });
    }
  }, [mid]);
  return (
    <>
      <Button onClick={openModal}>Edit Profile</Button>
      {open && (
        <Wrapper closeModal={closeModal}>
          <div className="relative w-full max-w-md space-y-6 rounded-md border border-skin bg-background p-10">
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
                closeModal={closeModal}
              />
            </form>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default EditProfile;
