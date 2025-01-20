import UserCard from "@/components/Sidebar/Search/UserCard";
import { fetchSearchHistories } from "@/lib/drizzle/queries/users/fetchSearchHistories";
import { searchUser } from "@/lib/drizzle/queries/users/searchUser";
import { getAuth } from "@/lib/next.auth";
import { cookies } from "next/headers";
import Modal from "./Modal";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const cookie = await cookies();
  const prevRoute = cookie.get("prevRoute")?.value ?? "";
  const session = await getAuth();
  const query = (await searchParams).query;

  const histories = session
    ? await fetchSearchHistories({ userId: session.user.id })
    : [];
  const searchUsers = query ? await searchUser(query) : [];

  return (
    <Modal>
      <div className="flex min-h-80 flex-col overflow-y-hidden">
        <div>
          <h2 className="text-sm font-semibold text-skin-muted">
            Search Result
          </h2>
        </div>
        <div className="max-h-96 flex-1 space-y-2 overflow-y-auto py-4">
          {!query ? (
            histories.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-skin-muted">No recent search</p>
              </div>
            ) : (
              histories.map((user) => (
                <UserCard key={user.id} user={user} isRemovable />
              ))
            )
          ) : (
            searchUsers.map((user) => (
              <UserCard key={user.id} user={user} isRemovable={false} />
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
