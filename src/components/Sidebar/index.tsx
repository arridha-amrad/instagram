import { auth } from "@/auth";
import SwitchTheme from "@/components/SwitchTheme";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Avatar from "../Avatar";
import NewPostModal from "./Modal/ModalCreatePost";
import { CreatePostProvider } from "./Modal/ModalCreatePost/CreatePostContext";
import Logout from "./Modal/ModalLogout";
import SidebarBrand from "./SidebarBrand";
import { className } from "./styles";
import ButtonSearchUser from "./Search/ButtonSearchUser";
import { fetchSearchHistories } from "@/fetchings/user";
import Histories from "./Search/Histories";

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
      <Link className={`${className.button}`} href="/">
        <div className={`${className.iconContainer}`}>
          <HomeIcon />
        </div>
        <span className="hidden xl:inline">Home</span>
      </Link>
      <div className="h-2" />
      <ButtonSearchUser>
        <Histories histories={searchHistories} />
      </ButtonSearchUser>
      <div className="h-2" />
      <CreatePostProvider>
        <NewPostModal />
      </CreatePostProvider>
      <div className="h-2" />
      <Link
        className={className.button}
        href={`/${session?.user.username}` ?? "/"}
      >
        <Avatar url={session?.user.image} className="w-8" />
        <span className="hidden xl:inline">Profile</span>
      </Link>
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
