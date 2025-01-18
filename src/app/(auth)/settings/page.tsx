import { auth } from "@/auth";
import FormEditProfile from "@/app/(auth)/settings/Form";
import { fetchUserProfileDetails } from "@/lib/drizzle/queries/fetchUserProfileDetails";

import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login?cbUrl=/settings");
  }

  const profile = await fetchUserProfileDetails({
    username: session.user.username,
  });

  return (
    <div className="w-full pl-14">
      <div>
        <h1 className="text-xl font-semibold">Edit profile</h1>
      </div>
      <div className="h-6" />
      {profile && <FormEditProfile user={profile} />}
    </div>
  );
};

export default Page;
