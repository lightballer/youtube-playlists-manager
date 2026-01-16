export type Playlist = {
  id: string;
  title: string | null;
  thumbnailUrl: string | null;
};

export type PlaylistItem = {
  id: string;
  videoId: string | null;
  title: string | null;
  thumbnailUrl: string | null;
  isNew: boolean;
  isDeleted: boolean;
};
