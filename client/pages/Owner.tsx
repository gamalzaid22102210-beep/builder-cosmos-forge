import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Owner() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-egypt-black via-gray-900 to-egypt-black flex flex-col items-center justify-center p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          className="bg-gradient-to-r from-egypt-gold to-egypt-gold-light text-egypt-black font-bold"
          onClick={() => navigate("/")}
        >
          العودة للصفحة الرئيسية
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/?preview=twoDayFinished")}
        >
          عرض ما بعد انتهاء المؤقّت الصغير
        </Button>
      </div>
    </div>
  );
}
