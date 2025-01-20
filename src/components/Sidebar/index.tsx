import { auth } from "@/auth";
import SwitchTheme from "@/components/SwitchTheme";
import { fetchSearchHistories } from "@/lib/drizzle/queries/users/fetchSearchHistories";
import LinkHome from "./Links/LinkHome";
import LinkProfile from "./Links/LinkProfile";
import LinkSettings from "./Links/LinkSettings";
import NewPostModal from "./Modal/ModalCreatePost";
import { CreatePostProvider } from "./Modal/ModalCreatePost/CreatePostContext";
import Logout from "./Modal/ModalLogout";
import ModalSearch from "./Search/ModalSearch";
import UserCard from "./Search/UserCard";
import SidebarBrand from "./SidebarBrand";

export default async function Sidebar() {
  const session = await auth();
  if (!session) {
    return null;
  }

  const searchHistories = await fetchSearchHistories({
    userId: session.user.id ?? "",
  });

  return (
    <div className="flex h-full w-full flex-col">
      <SidebarBrand />
      <div className="h-4" />
      <LinkHome />
      <div className="h-2" />
      <ModalSearch>
        {searchHistories.length > 0 ? (
          searchHistories.map((user) => (
            <UserCard isRemovable user={user} key={user.id} />
          ))
        ) : (
          <div>
            <h1>There is no recent search</h1>
          </div>
        )}
      </ModalSearch>
      <div className="h-2" />
      <CreatePostProvider>
        <NewPostModal />
      </CreatePostProvider>
      <div className="h-2" />
      <LinkSettings />
      <LinkProfile user={session.user} />
      <div className="flex-1" />
      <Logout />
      <div className="h-4" />
      <div className="flex w-full items-center justify-start gap-2">
        <SwitchTheme />
        <span className="hidden xl:inline">Dark Mode</span>
      </div>
    </div>
  );
}
