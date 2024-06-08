import Link from "next/link";
import SidebarBrand from "./SidebarBrand";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import NewPostModal from "./ModalCreatePost";
import { CreatePostProvider } from "./CreatePostContext";
import Logout from "./ModalLogout";
import SwitchTheme from "@/components/SwitchTheme";
import { auth } from "@/auth";

export default async function Sidebar() {
  const session = await auth();
  return (
    <div className="w-full flex flex-col h-full">
      <SidebarBrand />
      <Link
        className="inline-flex w-full xl:w-fit h-[40px] justify-center xl:justify-start items-center gap-4 xl:px-4 bg-background/50 rounded-md xl:py-2 hover:bg-skin-fill transition-colors duration-300 ease-linear"
        href="/"
      >
        <HomeIcon className="w-7 aspect-square" />
        <span className="xl:inline hidden">Home</span>
      </Link>
      <div className="h-2" />
      <CreatePostProvider>
        <NewPostModal />
      </CreatePostProvider>
      <div className="h-2" />

      <Link
        className="inline-flex w-full xl:w-fit h-[40px] justify-center xl:justify-start items-center gap-4 xl:px-4 bg-background/50 rounded-md xl:py-2 hover:bg-skin-fill transition-colors duration-300 ease-linear"
        href={session?.user.username ?? "/"}
      >
        <UserIcon className="w-7 aspect-square" />
        <span className="xl:inline hidden">Profile</span>
      </Link>
      <div className="flex-1" />
      <Logout />
      <div className="h-4" />
      <div className="h-px w-full dark:bg-neutral-700" />
      <div className="h-4" />
      <div className="flex xl:px-4 items-center gap-4">
        <SwitchTheme />
        <span className="xl:inline hidden">Dark Mode</span>
      </div>
    </div>
  );
}
