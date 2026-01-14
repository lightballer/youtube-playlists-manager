"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-text-primary">
            Welcome back!
          </h1>
          <p className="text-text-secondary text-lg">
            Signed in as{" "}
            <span className="text-accent">{session.user?.email}</span>
          </p>
        </div>

        <Link href="/manage">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-6 transition-all duration-300 cursor-pointer group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/8 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-[1.02]">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-text-primary mb-1">
                  Manage Playlists
                </h2>
                <p className="text-text-secondary">
                  View and organize your YouTube playlists
                </p>
              </div>
              <svg
                className="w-6 h-6 text-text-secondary group-hover:text-cyan-500 group-hover:translate-x-1 transition-all ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        <button
          onClick={() => signOut()}
          className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/8 hover:border-cyan-500/30 text-text-primary font-medium px-6 py-3 rounded-xl transition-all duration-300"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
