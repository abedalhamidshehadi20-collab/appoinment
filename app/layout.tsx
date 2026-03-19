import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedAxis Care Solutions",
  description:
    "Healthcare operations agency website with editable dashboard and role-based access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
