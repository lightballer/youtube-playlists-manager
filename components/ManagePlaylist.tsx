import { useState } from "react";

export default function ManagePlaylist() {
   const [playlistItems, setPlaylistItems] = useState([1, 2, 3, 4, 5]);

  return (
    <div className="flex flex-col gap-4 p-6">
      {playlistItems.map((item, i) => (
        <div key={i} className="w-60 h-20 border-2 border-amber-500 rounded-lg p-2">
          <img src="" alt="song thumbnail" className="w-full h-10" />
          <p className="text-amber-700">song title</p>
        </div>
      ))}
    </div>
  );
}