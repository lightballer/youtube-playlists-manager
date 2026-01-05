"use client";

import { youtube_v3 } from "googleapis";
import Image from "next/image";
import { useState } from "react";
import { ConnectDragSource, DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function PlaylistItemsList({
  items,
}: {
  items: youtube_v3.Schema$PlaylistItem[];
}) {
  const [playlistItems, setPlaylistItems] = useState(items);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-125 flex flex-col gap-2">
        {playlistItems.map((item) => (
          <PlaylistItem key={item.id} item={item} />
        ))}
      </div>
    </DndProvider>
  );
}

const PlaylistItem = ({ item }: { item: youtube_v3.Schema$PlaylistItem }) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "song",
      item,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        isDragging: monitor.isDragging(),
      }),
    }),
    [item]
  );

  return drag(
    <div data-testid="box" style={{ opacity }}>
      <div className="flex flex-row gap-4 p-4 border-2 rounded-lg border-amber-500">
        <div>
          {item?.snippet?.thumbnails?.default?.url && (
            <Image
              src={item.snippet.thumbnails.default.url}
              alt="song thumbnail"
              className="w-10 h-10"
              width={40}
              height={40}
            />
          )}
        </div>

        <div className="flex items-center">
          <h2>{item.snippet?.title}</h2>
        </div>
      </div>
    </div>
  );
};
