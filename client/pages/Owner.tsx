import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function Owner() {
  const navigate = useNavigate();
  const videoId = "SLKS4_BBYmk";

  const [apiReady, setApiReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);
  const containerIdRef = useRef(
    `yt-audio-${Math.random().toString(36).slice(2)}`,
  );

  useEffect(() => {
    const w = window as any;
    if (w.YT && w.YT.Player) {
      setApiReady(true);
      return;
    }

    const onReady = () => setApiReady(true);
    if (!w.onYouTubeIframeAPIReady) {
      w.onYouTubeIframeAPIReady = onReady;
    } else {
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        try {
          prev();
        } catch {}
        onReady();
      };
    }

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  const createPlayerIfNeeded = () => {
    const w = window as any;
    if (!apiReady || playerRef.current) return;
    playerRef.current = new w.YT.Player(containerIdRef.current, {
      height: "1",
      width: "1",
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          if (isMuted) {
            playerRef.current.mute();
          } else {
            playerRef.current.unMute();
          }
        },
        onStateChange: (e: any) => {
          // 1 = playing, 2 = paused, 0 = ended
          if (e.data === 1) setIsPlaying(true);
          if (e.data === 2 || e.data === 0) setIsPlaying(false);
        },
      },
    });
  };

  const togglePlay = async () => {
    createPlayerIfNeeded();
    const p = playerRef.current;
    if (!p) return;
    try {
      if (isPlaying) {
        p.pauseVideo();
      } else {
        if (isMuted) p.mute();
        else p.unMute();
        p.playVideo();
      }
    } catch {}
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) {
      p.unMute();
      setIsMuted(false);
    } else {
      p.mute();
      setIsMuted(true);
    }
  };

  useEffect(() => {
    return () => {
      try {
        const p = playerRef.current;
        if (p) {
          p.stopVideo?.();
          p.destroy?.();
        }
      } catch {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-egypt-black via-gray-900 to-egypt-black flex flex-col items-center justify-center p-6 space-y-6">
      {/* Hidden (1x1) YouTube player for audio only */}
      <div
        id={containerIdRef.current}
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      />

      <div className="flex items-center gap-4">
        <Button
          className="bg-gradient-to-r from-egypt-gold to-egypt-gold-light text-egypt-black font-bold"
          onClick={togglePlay}
          disabled={!apiReady}
        >
          {isPlaying ? (
            <span className="flex items-center gap-2">
              <Pause className="w-4 h-4" /> إيقاف مؤقت
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4" /> تشغيل الصوت
            </span>
          )}
        </Button>

        <Button variant="outline" onClick={toggleMute} disabled={!apiReady}>
          {isMuted ? (
            <span className="flex items-center gap-2">
              <VolumeX className="w-4 h-4" /> كتم
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> صوت
            </span>
          )}
        </Button>
      </div>

      <Button
        className="bg-gradient-to-r from-egypt-gold to-egypt-gold-light text-egypt-black font-bold"
        onClick={() => navigate("/")}
      >
        العودة للصفحة الرئيسية
      </Button>
    </div>
  );
}
