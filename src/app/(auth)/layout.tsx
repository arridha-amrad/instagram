import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  modal: ReactNode;
};

const Layout = ({ children, modal }: Props) => {
  return (
    <main className="w-full max-w-[1200px] mx-auto flex">
      <section className="xl:max-w-[250px] border-r border-skin py-4 h-screen min-h-[500px] sticky inset-y-0 px-1 max-w-[60px] w-full xl:px-4">
        <Sidebar />
      </section>
      <section className="px-4 w-full">
        {children} {modal}
      </section>
    </main>
  );
};

export default Layout;
