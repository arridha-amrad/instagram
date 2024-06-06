import { ReactNode } from "react";
import ToasWrapper from "./ToasWrapper";
import SwitchTheme from "@/components/SwitchTheme";

type Props = {
  children: ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <main className="">
      {children}
      <div className="fixed bottom-4 right-4">
        <SwitchTheme />
      </div>
      <ToasWrapper />
    </main>
  );
};

export default Layout;
