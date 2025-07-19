import RootProvider from "@/components/Provider/RootProvider";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return <RootProvider>{children}</RootProvider>;
};

export default MainLayout;
