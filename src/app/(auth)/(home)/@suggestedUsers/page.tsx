import { auth } from "@/auth";
import db from "@/lib/drizzle/db";
import SuggestedUsers from "./_components/SuggestedUsers";
import { redirect } from "next/navigation";
import fetchSuggestedUsers from "@/lib/drizzle/queries/fetchSuggestedUsers";

export default async function Page() {
  const session = await auth();

  const uid = session?.user.id;
  if (!uid) {
    redirect("/login");
  }

  const users = await fetchSuggestedUsers(uid);

  return <SuggestedUsers users={users} />;
}
