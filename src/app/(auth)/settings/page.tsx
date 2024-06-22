import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";

const Page = () => {
  return (
    <div className="w-full pl-14">
      <div>
        <h1 className="text-xl font-semibold">Edit profile</h1>
      </div>
      <div className="h-6" />
      <form className="flex w-full max-w-md flex-col gap-4" action="">
        <TextInput label="Current password" />
        <TextInput label="New password" />
        <div className="self-start pt-4">
          <Button className="h-10 w-24">Update</Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
