import Image from "next/image";
import { PlaylistItem } from "@/types/playlist";

type PlaylistItemCardProps = {
  item: PlaylistItem;
  orderNumber?: number;
};

export default function PlaylistItemCard({
  item,
  orderNumber,
}: PlaylistItemCardProps) {
  return (
    <div>
      <div className="flex flex-row gap-4 p-4 border border-white/10 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/8 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-grab active:cursor-grabbing shadow-md">
        {orderNumber !== undefined && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-teal-500 text-white font-semibold text-sm flex-shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            {orderNumber}
          </div>
        )}

        <div>
          {item.thumbnailUrl && (
            <Image
              src={item.thumbnailUrl}
              alt="playlist item thumbnail"
              className="w-10 h-10 rounded"
              width={40}
              height={40}
            />
          )}
        </div>

        <div className="flex items-center flex-1 min-w-0">
          <h2 className="text-text-primary truncate">{item.title}</h2>
        </div>
      </div>
    </div>
  );
}
