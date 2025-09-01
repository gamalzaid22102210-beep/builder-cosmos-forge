import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Owner() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = audioRef.current;
    if (a) {
      a.play().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-egypt-black via-gray-900 to-egypt-black flex flex-col items-center justify-center p-6 space-y-6">
      <audio
        ref={audioRef}
        controls
        autoPlay
        loop
        preload="auto"
        className="w-full max-w-xl border border-egypt-gold/30 rounded-lg shadow-lg"
      >
        <source
          src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Bilady%2C_Bilady%2C_Bilady.ogg"
          type="audio/ogg"
        />
      </audio>
      <Button
        className="bg-gradient-to-r from-egypt-gold to-egypt-gold-light text-egypt-black font-bold"
        onClick={() => navigate("/")}
      >
        العودة للصفحة الرئيسية
      </Button>
    </div>
  );
}
