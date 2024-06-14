import SvgInstagram from "@/components/svg/SvgInstagram";
import Link from "next/link";

const SidebarBrand = () => {
  return (
    <div className="w-full items-center justify-center xl:justify-start">
      <Link
        href="/"
        className="inline-flex h-full w-full items-center justify-center gap-4 rounded-md xl:justify-start"
      >
        <SvgInstagram className="h-8 dark:fill-white" />
      </Link>
    </div>
  );
};

export default SidebarBrand;
