import fetchSuggestedUsers from "@/lib/drizzle/queries/users/fetchSuggestedUsers";
import { getAuth } from "@/lib/next.auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserCard from "./UserCard";

export default async function Page() {
  const session = await getAuth();
  const uid = session?.user.id;
  if (!uid) {
    redirect("/login");
  }

  const users = await fetchSuggestedUsers(uid);

  return (
    <div className="w-full space-y-4 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold text-skin-muted">
          Suggested for you
        </h1>
        <Link href="/" className="text-sm font-medium text-skin-base">
          see all
        </Link>
      </div>
      <div className="mt-2 space-y-4">
        {users.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
