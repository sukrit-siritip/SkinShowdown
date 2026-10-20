const YOUTUBE_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;

// Classifies a media URL for the hero carousel: a YouTube link embeds as a
// video, anything else is treated as an image.
export function parseEventMedia(url) {
  if (!url) return null;
  const match = url.match(YOUTUBE_PATTERN);
  if (match) return { type: "youtube", videoId: match[1] };
  return { type: "image", src: url };
}
