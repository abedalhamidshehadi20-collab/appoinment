import { ReactNode } from "react";
import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";

type PatientInfo = {
  name: string;
  email: string;
};

type Props = {
  children: ReactNode;
  patient?: PatientInfo | null;
};

export function SiteShell({ children, patient }: Props) {
  return (
    <>
      <SiteHeader patient={patient} />
      {children}
      <SiteFooter />
    </>
  );
}
