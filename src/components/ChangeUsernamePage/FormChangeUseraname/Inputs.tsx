import MySpinner from "@/components/Spinner";
import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { useFormStatus } from "react-dom";

type Props = {
  currUsernameErrMessage?: string;
  newUsernameErrMessage?: string;
};

const Inputs = ({ currUsernameErrMessage, newUsernameErrMessage }: Props) => {
  const { pending } = useFormStatus();
  return (
    <fieldset className="space-y-3" disabled={pending}>
      <TextInput
        errorMessage={currUsernameErrMessage}
        name="currentUsername"
        label="Current username"
      />
      <TextInput
        errorMessage={newUsernameErrMessage}
        name="newUsername"
        label="New username"
      />
      <div className="self-end">
        <Button type="submit" className="h-10 w-24">
          {pending ? <MySpinner /> : "Update"}
        </Button>
      </div>
    </fieldset>
  );
};

export default Inputs;
