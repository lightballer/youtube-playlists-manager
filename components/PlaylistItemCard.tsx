import Image from "next/image";
import { PlaylistItem } from "@/types/playlist";

type PlaylistItemCardProps = {
  item: PlaylistItem;
};

export default function PlaylistItemCard({ item }: PlaylistItemCardProps) {
  return (
    <div>
      <div className="flex flex-row gap-4 p-4 border-2 rounded-lg border-amber-500">
        <div>
          {item.thumbnailUrl && (
            <Image
              src={item.thumbnailUrl}
              alt="playlist item thumbnail"
              className="w-10 h-10"
              width={40}
              height={40}
            />
          )}
        </div>

        <div className="flex items-center">
          <h2>{item.title}</h2>
        </div>
      </div>
    </div>
  );
}
