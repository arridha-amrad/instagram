"use client";

import Avatar from "@/components/Avatar";
import MySpinner from "@/components/Spinner";
import { updateAvatar } from "@/lib/actions/user";
import { cn, showToast } from "@/lib/utils";
import { PhotoIcon } from "@heroicons/react/24/outline";
import mergeRefs from "merge-refs";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, HTMLAttributes, Ref, forwardRef, useRef } from "react";
import { toast } from "react-toastify";

type Props = {
  avatar?: string | null;
} & HTMLAttributes<HTMLDivElement>;

const EditableAvatar = (
  { avatar, ...props }: Props,
  ref: Ref<HTMLInputElement>,
) => {
  const { update } = useSession();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();

  const { execute, isExecuting } = useAction(
    updateAvatar.bind(null, pathname),
    {
      onError: () => {
        showToast("something went wrong", "success");
      },
      async onSuccess({ data }) {
        if (!data) return;
        const { id, image, name, username } = data;
        await update({
          id,
          username,
          image,
          name,
        });
        router.refresh();
        toast.success("Avatar changed successfully", { theme });
      },
    },
  );

  const onChangeFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      btnRef.current?.click();
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
        <input
          disabled={isExecuting}
          accept="image/*"
          name="image"
          onChange={onChangeFileInput}
          hidden
          ref={mergeRefs(inputRef, ref)}
          type="file"
        />
      </div>
      <Avatar url={avatar} className={cn("w-24 sm:w-40", props.className)} />
      <button hidden type="submit" ref={btnRef}></button>
    </form>
  );
};

export default forwardRef(EditableAvatar);
