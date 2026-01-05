import { redirect } from "next/navigation";
import Link from "next/link";
import { getYoutubeSdkObject } from "@/services/youtube-sdk";

export default async function Page() {
  const youtube = await getYoutubeSdkObject();
  if (!youtube) redirect("/login");

  const playlists = await youtube.playlists.list({
    part: ["snippet"],
    mine: true,
  });

  return (
    <div>
      <h1>Manage playlists</h1>
      {playlists?.data?.items?.map((playlist) => (
        <div key={playlist.id}>
          <h2>
            <Link href={`/manage/${playlist.id}`}>
              {playlist.snippet?.title}
            </Link>
          </h2>
        </div>
      ))}
    </div>
  );
}
