import Link from "next/link";
import SidebarBrand from "./SidebarBrand";
import { HomeIcon } from "@heroicons/react/24/outline";
import NewPostModal from "./Modal";
import { CreatePostProvider } from "./CreatePostContext";

export default function Sidebar() {
  return (
    <div className="w-full space-y-4">
      <SidebarBrand />
      <Link
        className="inline-flex w-full xl:w-fit h-[40px] justify-center xl:justify-start items-center gap-4 xl:px-4 bg-background/50 rounded-md xl:py-2"
        href="/"
      >
        <HomeIcon className="w-7 aspect-square" />
        <span className="xl:inline hidden">Home</span>
      </Link>
      <CreatePostProvider>
        <NewPostModal />
      </CreatePostProvider>
    </div>
  );
}
