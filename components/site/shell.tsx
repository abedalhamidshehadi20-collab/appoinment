import { ReactNode } from "react";
import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";

type AdminInfo = {
  name: string;
  role: string;
};

type Props = {
  children: ReactNode;
  admin?: AdminInfo | null;
};

export function SiteShell({ children, admin }: Props) {
  return (
    <>
      <SiteHeader admin={admin} />
      {children}
      <SiteFooter />
    </>
  );
}
