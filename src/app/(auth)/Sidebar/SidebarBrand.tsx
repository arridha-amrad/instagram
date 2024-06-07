import SvgInstagram from "@/components/svg/SvgInstagram";

const SidebarBrand = () => {
  return (
    <div className="h-[40px] w-full aspect-square flex items-center xl:justify-start justify-center">
      <button className="transition-all duration-300 ease-linear gap-4 w-full h-full xl:px-4 xl:py-2 rounded-md items-center xl:justify-start justify-center inline-flex">
        <SvgInstagram className="h-7 dark:fill-white" />
        <h1 className="font-medium xl:block hidden">Instagram</h1>
      </button>
    </div>
  );
};

export default SidebarBrand;
