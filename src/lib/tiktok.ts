/** Extract the numeric video ID from a full TikTok video URL. */
export const extractTikTokVideoId = (url: string): string | null => {
  const match = url.match(/\/video\/(\d+)/);
  if (match) return match[1];
  const numeric = url.match(/(\d{15,})/);
  return numeric ? numeric[1] : null;
};

/** Iframe URL for a video, or null for short links (vm.tiktok.com) that carry no ID. */
export const buildTikTokEmbedUrl = (url: string): string | null => {
  const id = extractTikTokVideoId(url);
  return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
};