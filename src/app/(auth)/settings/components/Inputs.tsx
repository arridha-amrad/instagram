"use client";

import MySpinner from "@/components/Spinner";
import Button from "@/components/core/Button";
import { TUserInfo } from "@/fetchings/type";
import { useFormStatus } from "react-dom";

type Props = {
  closeModal?: VoidFunction;
  userInfo?: TUserInfo | null;
  name: string;
  username: string;
};

const Inputs = ({ closeModal, name, userInfo, username }: Props) => {
  const { pending } = useFormStatus();
  return (
    <fieldset disabled={pending}>
      <section className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="Name"
            className="block text-sm font-medium text-skin-base"
          >
            Full name
          </label>

          <input
            type="text"
            id="Name"
            defaultValue={name}
            name="name"
            className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-black"
          />
        </div>
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-skin-base"
          >
            Website
          </label>

          <input
            type="text"
            defaultValue={userInfo?.website ?? ""}
            name="website"
            id="website"
            className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-black"
          />
        </div>
        <div>
          <label
            htmlFor="occupation"
            className="block text-sm font-medium text-skin-base"
          >
            Occupation
          </label>

          <input
            type="text"
            id="occupation"
            name="occupation"
            defaultValue={userInfo?.occupation ?? ""}
            className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-black"
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-skin-base"
          >
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            rows={4}
            defaultValue={userInfo?.bio ?? ""}
            className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-black"
          ></textarea>
        </div>
        <div>
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
            className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-black"
          >
            <option value="">Please select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex items-center gap-3 self-end">
          {closeModal && (
            <Button onClick={closeModal} className="h-10 w-24 bg-skin-input">
              Cancel
            </Button>
          )}
          <Button type="submit" className="h-10 w-24" disabled={pending}>
            {pending ? <MySpinner /> : "Save"}
          </Button>
        </div>
      </section>
    </fieldset>
  );
};

export default Inputs;
