/**
 * Extracts video ID from various YouTube URL formats:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 */
export const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");

    // youtube.com/watch?v=VIDEO_ID
    if (hostname === "youtube.com" && urlObj.pathname === "/watch") {
      return urlObj.searchParams.get("v");
    }

    // youtu.be/VIDEO_ID
    if (hostname === "youtu.be") {
      return urlObj.pathname.slice(1) || null;
    }

    // youtube.com/shorts/VIDEO_ID or youtube.com/embed/VIDEO_ID
    if (hostname === "youtube.com") {
      const match = urlObj.pathname.match(/^\/(shorts|embed)\/([^/?]+)/);
      if (match) {
        return match[2];
      }
    }

    return null;
  } catch {
    return null;
  }
};
