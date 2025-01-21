import FormEditProfile from "@/app/(auth)/settings/Form";
import { fetchUserProfileDetails } from "@/lib/drizzle/queries/users/fetchUserProfileDetails";

import { redirect } from "next/navigation";
import { getAuth } from "@/lib/next.auth";

const Page = async () => {
  const session = await getAuth();

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
      {profile && (
        <FormEditProfile fullName={session.user.name} user={profile} />
      )}
    </div>
  );
};

export default Page;
