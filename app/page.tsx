"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (!session) redirect("/auth/login");

  return (
    <>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
      <p>
        <Link href="/manage">Manage playlists</Link>
      </p>
    </>
  );
}
