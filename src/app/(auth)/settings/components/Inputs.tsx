"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { TUserInfo } from "@/fetchings/type";

type Props = {
  userInfo?: TUserInfo | null;
  name: string;
  isExecuting: boolean;
};

const Inputs = ({ name, userInfo, isExecuting }: Props) => {
  return (
    <fieldset disabled={isExecuting}>
      <section className="flex flex-col gap-6">
        <TextInput
          label="Full name"
          variant="normal"
          type="text"
          id="fullName"
          name="fullName"
          defaultValue={name}
        />
        <TextInput
          label="Website"
          variant="normal"
          type="text"
          id="website"
          name="website"
          defaultValue={userInfo?.website ?? ""}
        />
        <TextInput
          label="Occupation"
          variant="normal"
          type="text"
          id="occupation"
          name="occupation"
          defaultValue={userInfo?.occupation ?? ""}
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
            defaultValue={userInfo?.bio ?? ""}
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
            defaultValue={userInfo?.gender ?? ""}
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
      </section>
    </fieldset>
  );
};

export default Inputs;
