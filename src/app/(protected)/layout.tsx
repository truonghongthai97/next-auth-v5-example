import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
