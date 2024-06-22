"use client";

import MySpinner from "@/components/Spinner";
import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { useFormStatus } from "react-dom";

const Inputs = () => {
  const { pending } = useFormStatus();
  return (
    <fieldset disabled={pending} className="flex w-full flex-col gap-3">
      <TextInput name="oldPassword" label="Current password" />
      <TextInput name="newPassword" label="New password" />
      <div className="self-end">
        <Button type="submit" className="h-10 w-24">
          {pending ? <MySpinner /> : "Update"}
        </Button>
      </div>
    </fieldset>
  );
};

export default Inputs;
