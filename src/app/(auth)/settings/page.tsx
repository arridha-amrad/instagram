import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormEditProfile from "./_components/FormEditProfile";
import { fetchUser } from "@/fetchings/user";

const Page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login?cbUrl=/settings");
  }

  const profile = await fetchUser({
    username: session.user.username,
    authUserId: session.user.id,
  });

  return (
    <div className="w-full pl-14">
      <div>
        <h1 className="text-xl font-semibold">Edit profile</h1>
      </div>
      <div className="h-6" />
      <FormEditProfile user={profile} />
    </div>
  );
};

export default Page;
