"use client";

import EditableAvatar from "@/components/EditableAvatar";
import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { TProfile } from "@/fetchings/type";
import { useSessionStore } from "@/stores/SessionStore";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { editProfileAction } from "./actionEditProfile";

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
        <fieldset className="flex flex-col gap-6" disabled={isExecuting}>
          <TextInput
            label="Full name"
            variant="normal"
            type="text"
            id="fullName"
            name="fullName"
            defaultValue={user?.name}
          />
          <TextInput
            label="Website"
            variant="normal"
            type="text"
            id="website"
            name="website"
            defaultValue={user?.userInfo?.website ?? ""}
          />
          <TextInput
            label="Occupation"
            variant="normal"
            type="text"
            id="occupation"
            name="occupation"
            defaultValue={user?.userInfo?.occupation ?? ""}
          />
          <div className="space-y-1.5">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-skin-base"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={2}
              defaultValue={user?.userInfo?.bio ?? ""}
              className="w-full resize-none rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
            ></textarea>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-skin-base"
            >
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              defaultValue={user?.userInfo?.gender ?? ""}
              className="w-full rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
            >
              <option value="">Please select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex items-center gap-3 self-end">
            <Button type="submit" className="h-10 w-24" isLoading={isExecuting}>
              Save
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default FormEditProfile;
