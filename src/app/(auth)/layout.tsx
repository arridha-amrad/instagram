import { ReactNode } from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <main className="w-full max-w-[1200px] mx-auto flex min-h-screen">
      <section className="xl:max-w-[250px] py-4 px-1 max-w-[60px] w-full border xl:px-4 border-skin">
        <Sidebar />
      </section>
      {children}
    </main>
  );
};

export default Layout;
