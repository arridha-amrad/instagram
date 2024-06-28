"use client";

import Avatar from "../../Avatar";
import { ChangeEvent, HTMLAttributes, Ref, forwardRef, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { changeAvatar, changeAvatarAction } from "./action";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadIndicator from "./UploadIndicator";
import Picker from "./Picker";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/SessionStore";
import { useAction } from "next-safe-action/hooks";
import MySpinner from "@/components/Spinner";
import { PhotoIcon } from "@heroicons/react/24/outline";
import mergeRefs from "merge-refs";

type Props = {
  avatar?: string | null;
} & HTMLAttributes<HTMLDivElement>;

const EditableAvatar = ({ avatar, ...props }: Props, ref: Ref<HTMLInputElement>) => {
  const { update } = useSession();
  const { session } = useSessionStore();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const { theme } = useTheme();
  const ca = changeAvatarAction.bind(null, session?.user.id ?? "");
  const { execute, result, isExecuting, hasSucceeded } = useAction(ca);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (result.data?.err) {
      toast.error(result.data.err, { theme });
    }
    if (result.data?.message && session?.user) {
      const user = result.data.data;
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
          setIsSubmit(false);
          toast.success(result.data?.message, { theme });
        });
      }
    }
  }, [hasSucceeded]);

  useEffect(() => {
    if (isSubmit) {
      btnRef.current?.click();
    }
  }, [isSubmit]);

  const onChangeFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsSubmit(true);
    }
  };

  return (
    <form action={execute} className="group relative cursor-pointer">
      {isExecuting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-500/50">
          <MySpinner />
        </div>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100"
      >
        <PhotoIcon className="aspect-square w-7" />
        <input name="image" onChange={onChangeFileInput} hidden ref={mergeRefs(inputRef, ref)} type="file" />
      </div>
      <Avatar url={!!preview ? preview : avatar} className={cn("w-24 sm:w-40", props.className)} />
      <button hidden type="submit" ref={btnRef}></button>
    </form>
  );
};

export default forwardRef(EditableAvatar);
