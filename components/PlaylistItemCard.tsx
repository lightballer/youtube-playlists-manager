import Image from "next/image";
import { PlaylistItem } from "@/types/playlist";

type PlaylistItemCardProps = {
  item: PlaylistItem;
  orderNumber?: number;
  onDelete?: () => void;
};

export default function PlaylistItemCard({
  item,
  orderNumber,
  onDelete,
}: PlaylistItemCardProps) {
  const baseClasses =
    "flex flex-row items-center gap-4 p-4 border rounded-xl backdrop-blur-sm transition-all duration-300 cursor-grab active:cursor-grabbing shadow-md";
  const normalClasses =
    "border-white/10 bg-white/5 hover:bg-white/8 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]";
  const newItemClasses =
    "border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]";

  return (
    <div>
      <div
        className={`${baseClasses} ${
          item.isNew ? newItemClasses : normalClasses
        }`}
      >
        {orderNumber !== undefined && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-teal-500 text-white font-semibold text-sm shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
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

        {item.isNew && (
          <div className="flex items-center">
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500 text-white rounded-full">
              NEW
            </span>
          </div>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 shrink-0"
            title="Delete from playlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
