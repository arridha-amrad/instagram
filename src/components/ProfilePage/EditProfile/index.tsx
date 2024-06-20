"use client";

import Button from "@/components/core/Button";
import Wrapper from "@/components/core/Modals/Wrapper";
import { useState } from "react";
import AvatarProfile from "../AvatarProfile";
import { TProfile } from "@/fetchings/type";

type Props = {
  user: TProfile;
};

const EditProfile = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  return (
    <>
      <Button onClick={openModal}>Edit Profile</Button>
      {open && (
        <Wrapper closeModal={closeModal}>
          <div className="relative w-full max-w-md rounded-md border border-skin bg-background p-10">
            <div className="flex items-center justify-center gap-6">
              <div className="">
                <AvatarProfile className="w-20 lg:w-20" avatar={user?.avatar} />
              </div>
              <button className="font-semibold text-skin-inverted">
                Change Avatar
              </button>
            </div>
            <form className="flex flex-col gap-6" action="">
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
                  id="bio"
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
                  className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-black"
                >
                  <option value="">Please select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-x-3 self-end">
                <Button onClick={closeModal} className="bg-skin-input">
                  Cancel
                </Button>
                <Button>Save</Button>
              </div>
            </form>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default EditProfile;
