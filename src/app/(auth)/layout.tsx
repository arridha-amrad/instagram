import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  modal: ReactNode;
};

const Layout = ({ children, modal }: Props) => {
  return (
    <main className="mx-auto flex w-full max-w-[1200px]">
      <section className="sticky inset-y-0 h-screen min-h-[500px] w-full max-w-[60px] flex-none px-1 py-4 xl:max-w-[250px] xl:px-4">
        <Sidebar />
      </section>
      <section className="flex-1 basis-0 px-4">
        {children} {modal}
      </section>
    </main>
  );
};

export default Layout;
