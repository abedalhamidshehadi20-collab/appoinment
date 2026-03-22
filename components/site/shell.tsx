import { ReactNode } from "react";
import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";

type Props = {
  children: ReactNode;
  patientName?: string | null;
};

export function SiteShell({ children, patientName }: Props) {
  return (
    <>
      <SiteHeader patientName={patientName} />
      {children}
      <SiteFooter />
    </>
  );
}
