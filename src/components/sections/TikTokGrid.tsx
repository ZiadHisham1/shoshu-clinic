"use client";

import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import type { TikTokVideo } from "@/lib/constants";

interface Props {
  videos: TikTokVideo[];
}

export function TikTokGrid({ videos }: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex gap-3 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={playingId === video.id}
              onPlay={() => setPlayingId(video.id)}
              onPause={() => setPlayingId(null)}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-center font-tajawal text-[10px] text-figma-textMut sm:hidden">
        اسحب يميناً أو يساراً للمزيد ←
      </p>
    </>
  );
}

/* ============================================================
   Video card
   ============================================================ */

function VideoCard({
  video,
  isPlaying,
  onPlay,
  onPause,
}: {
  video: TikTokVideo;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      setLoading(true);
      el.play()
        .then(() => {
          onPlay();
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      el.pause();
      onPause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return (
    <div className="group relative w-[180px] shrink-0 overflow-hidden rounded-[16px] bg-black shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] ring-1 ring-black/10 sm:w-auto">
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          playsInline
          muted={muted}
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          onClick={toggle}
        />

        {/* Loading spinner */}
        {loading && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        {/* Overlay when paused */}
        {!isPlaying && !loading && (
          <button
            type="button"
            onClick={toggle}
            aria-label={`شغل الفيديو: ${video.caption}`}
            className="absolute inset-0 grid place-items-center"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5 fill-figma-header text-figma-header" />
            </span>
          </button>
        )}

        {/* Mute toggle when playing */}
        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "تفعيل الصوت" : "كتم الصوت"}
            className="absolute end-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1 p-3 text-start">
          <p className="line-clamp-2 font-tajawal text-xs font-bold text-white sm:text-sm">
            {video.caption}
          </p>
          {video.views && (
            <p className="font-tajawal text-[10px] text-white/70">
              {video.views} مشاهدة
            </p>
          )}
        </div>

        {/* TikTok badge — links to the original post */}
        {video.tiktokUrl && (
          <a
            href={video.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="شاهد على TikTok"
            onClick={(e) => e.stopPropagation()}
            className="absolute start-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 backdrop-blur-sm transition hover:bg-black/80"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-white"
              aria-hidden
            >
              <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.7V11a8.5 8.5 0 0 1-4.5-1.3v6.05A6.25 6.25 0 1 1 10.25 9.5c.26 0 .51.02.75.06v3.4a2.85 2.85 0 1 0 2.1 2.75V3h3.4Z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}