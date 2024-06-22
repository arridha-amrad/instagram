"use client";

import Avatar from "../Avatar";
import {
  HTMLAttributes,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import { changeAvatar } from "./changeAvatar";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadIndicator from "./UploadIndicator";
import Picker from "./Picker";
import { cn } from "@/lib/utils";

type Props = {
  avatar?: string | null;
} & HTMLAttributes<HTMLDivElement>;

const initialState = {
  type: "",
  message: "",
  data: {} as any,
};

const AvatarProfile = (
  { avatar, ...props }: Props,
  ref: Ref<HTMLInputElement>,
) => {
  const { data, update } = useSession();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const { theme } = useTheme();
  const [mid, setMid] = useState(0);

  const ca = changeAvatar.bind(null, data?.user.id ?? "");
  const [state, action] = useFormState(ca, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.type === "error") {
      toast.error(state.message, { theme });
    }
    if (state.type === "success") {
      const user = state.data;
      if (user) {
        if (user.image) {
          setPreview(user.image);
        }
        update({
          id: user.id,
          username: user.username,
          image: user.image,
          name: user.name,
        }).then(() => {
          router.refresh();
        });
      }
    }
  }, [mid]);

  useEffect(() => {
    if (isSubmit) {
      btnRef.current?.click();
    }
  }, [isSubmit]);

  return (
    <form
      action={(data) => {
        setMid(new Date().getTime());
        action(data);
      }}
      className="group relative cursor-pointer"
    >
      <UploadIndicator />
      <Picker ref={ref} setIsSubmit={setIsSubmit} />
      <Avatar
        url={!!preview ? preview : avatar}
        className={cn("w-24 sm:w-40", props.className)}
      />
      <button hidden type="submit" ref={btnRef}></button>
    </form>
  );
};

export default forwardRef(AvatarProfile);
