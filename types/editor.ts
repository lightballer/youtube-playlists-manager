export const EditorContainers = {
  playlist: "playlist",
  bag: "bag",
} as const;

export type EditorContainer =
  (typeof EditorContainers)[keyof typeof EditorContainers];
