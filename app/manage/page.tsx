import { redirect } from "next/navigation";
import Link from "next/link";
import { getPlaylists } from "@/services/actions/youtube/get-playlists";

export default async function Page() {
  const { error, data: playlists } = await getPlaylists();

  if (error) redirect("/auth/sign-out");
  if (!playlists) redirect("/");
  if (playlists.length === 0) return <div>No playlists found</div>;

  return (
    <div>
      <h1 className="text-2xl">Manage playlists</h1>
      {playlists.map((playlist) => (
        <div key={playlist.id}>
          <h2 className="text-xl">
            <Link href={`/manage/${playlist.id}`}>{playlist.title}</Link>
          </h2>
        </div>
      ))}
    </div>
  );
}
