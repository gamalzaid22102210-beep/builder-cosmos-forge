import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Owner() {
  const navigate = useNavigate();
  const videoId = "rPu_CD5UDpY";
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-egypt-black via-gray-900 to-egypt-black flex flex-col items-center justify-center p-6 space-y-6">
      <div className="w-full max-w-3xl aspect-video border border-egypt-gold/30 rounded-lg overflow-hidden shadow-2xl">
        <iframe
          className="w-full h-full"
          src={src}
          title="Bilady Bilady Bilady - Egyptian National Anthem"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
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
