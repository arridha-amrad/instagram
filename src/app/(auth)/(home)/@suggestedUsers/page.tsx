import { auth } from "@/auth";
import SuggestedUsers from "@/components/SuggestedUsers";
import fetchSuggestedUsers from "@/lib/drizzle/queries/fetchSuggestedUsers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const uid = session?.user.id;
  if (!uid) {
    redirect("/login");
  }
  const users = await fetchSuggestedUsers(uid);
  return <SuggestedUsers users={users} />;
}
