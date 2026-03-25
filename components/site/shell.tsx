import { ReactNode } from "react";
import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";

type AdminInfo = {
  name: string;
  email: string;
  role: string;
};

type PatientInfo = {
  name: string;
  email: string;
};

type Props = {
  children: ReactNode;
  admin?: AdminInfo | null;
  patient?: PatientInfo | null;
};

export function SiteShell({ children, admin, patient }: Props) {
  return (
    <>
      <SiteHeader admin={admin} patient={patient} />
      {children}
      <SiteFooter />
    </>
  );
}
