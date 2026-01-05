"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
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

  return <button onClick={() => signIn("google")}>Sign in with Google</button>;
}
