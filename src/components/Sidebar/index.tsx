import { auth } from "@/auth";
import SwitchTheme from "@/components/SwitchTheme";
import NewPostModal from "./Modal/ModalCreatePost";
import { CreatePostProvider } from "./Modal/ModalCreatePost/CreatePostContext";
import Logout from "./Modal/ModalLogout";
import SidebarBrand from "./SidebarBrand";
import ButtonSearchUser from "./Search/ButtonSearchUser";
import { fetchSearchHistories } from "@/fetchings/user";
import Histories from "./Search/Histories";
import LinkHome from "./Links/LinkHome";
import LinkSettings from "./Links/LinkSettings";
import LinkProfile from "./Links/LinkProfile";

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
      <ButtonSearchUser>
        <Histories histories={searchHistories} />
      </ButtonSearchUser>
      <div className="h-2" />
      <CreatePostProvider>
        <NewPostModal />
      </CreatePostProvider>
      <div className="h-2" />
      <LinkSettings />
      <LinkProfile />
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
