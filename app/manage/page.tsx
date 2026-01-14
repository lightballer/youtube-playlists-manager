import { redirect } from "next/navigation";
import Link from "next/link";
import { getPlaylists } from "@/services/actions/youtube/get-playlists";

export default async function Page() {
  const { error, data: playlists } = await getPlaylists();

  if (error) redirect("/auth/sign-out");
  if (!playlists) redirect("/");

  if (playlists.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-text-primary">
            Manage Playlists
          </h1>
          <Link
            href="/"
            className="text-text-secondary hover:text-cyan-500 transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </Link>
        </div>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <svg
            className="w-16 h-16 text-text-secondary mx-auto mb-4"
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
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            No playlists found
          </h2>
          <p className="text-text-secondary">
            You don&apos;t have any playlists yet. Create one on YouTube to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-text-primary">
          Manage Playlists
        </h1>
        <Link
          href="/"
          className="text-text-secondary hover:text-cyan-500 transition-colors inline-flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Link key={playlist.id} href={`/manage/${playlist.id}`}>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-300 cursor-pointer group h-full shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/8 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-text-primary mb-1 truncate">
                    {playlist.title}
                  </h2>
                  <p className="text-text-secondary text-sm">Click to manage</p>
                </div>

                <svg
                  className="w-5 h-5 text-text-secondary group-hover:text-cyan-500 group-hover:translate-x-1 transition-all"
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
        ))}
      </div>
    </div>
  );
}
