"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-text-secondary">Signing out...</div>
    </div>
  );
}
