import { useEffect, useRef, useState } from "react";
import { Instagram, Languages, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

import { useNavigate, useSearchParams } from "react-router-dom";

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isArabic, setIsArabic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLaunched, setIsLaunched] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerPass, setOwnerPass] = useState("");
  const [scrollTaxis, setScrollTaxis] = useState<
    Array<{
      id: number;
      direction: "left" | "right";
      timestamp: number;
    }>
  >([]);

  const preStartUntilRef = useRef<number>(Date.now());
  const activeEndRef = useRef<number>(
    preStartUntilRef.current + 2 * 24 * 60 * 60 * 1000,
  );
  const [twoDayLeft, setTwoDayLeft] = useState({
    days: 2,
    hours: 0,
    minutes: 0,
  });
  const [twoDayActive, setTwoDayActive] = useState(false);
  const [twoDayFinished, setTwoDayFinished] = useState(false);

  const targetDate = new Date("2025-09-10T00:00:00").getTime();

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const LOADING_DURATION = 1500;
  // Loading screen effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DURATION);

    return () => clearTimeout(loadingTimer);
  }, []);

  const [audioStarted, setAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoId = "SLKS4_BBYmk";
  const [playerReady, setPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const pendingStartRef = useRef(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onReady") {
          setPlayerReady(true);
        }
      } catch {}
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const post = (func: string, args: any[] = []) => {
    const frame = iframeRef.current;
    if (!frame) return false;
    frame.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
    return true;
  };

  const toggleAudio = () => {
    if (!audioStarted) {
      if (!playerReady) {
        pendingStartRef.current = true;
      } else {
        post("mute");
        post("seekTo", [0, true]);
        post("playVideo");
        setAudioStarted(true);
        setIsMuted(true);
        pendingStartRef.current = false;
      }
      return;
    }
    if (isMuted) {
      post("unMute");
      setIsMuted(false);
    } else {
      post("mute");
      setIsMuted(true);
    }
  };

  useEffect(() => {
    if (playerReady && pendingStartRef.current) {
      post("mute");
      post("seekTo", [0, true]);
      post("playVideo");
      setAudioStarted(true);
      setIsMuted(true);
      pendingStartRef.current = false;
    }
  }, [playerReady]);

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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      setIsLaunched(distance <= 0);

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Automatic taxi drop every 2 seconds with cap and respects reduced motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    let taxiCounter = 0;

    const autoTaxiInterval = setInterval(() => {
      const direction: "left" | "right" =
        taxiCounter % 2 === 0 ? "right" : "left";
      taxiCounter++;

      const newTaxi = {
        id: Date.now() + Math.random(),
        direction,
        timestamp: Date.now(),
      };

      setScrollTaxis((prev) => {
        const next = [...prev, newTaxi];
        if (next.length > 6) next.shift();
        return next;
      });

      setTimeout(() => {
        setScrollTaxis((prev) => prev.filter((taxi) => taxi.id !== newTaxi.id));
      }, 3000);
    }, 2000);

    return () => clearInterval(autoTaxiInterval);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      if (now < preStartUntilRef.current) {
        setTwoDayActive(false);
        setTwoDayFinished(false);
        setTwoDayLeft({ days: 2, hours: 0, minutes: 0 });
      } else if (now < activeEndRef.current) {
        setTwoDayActive(true);
        setTwoDayFinished(false);
        const diff = activeEndRef.current - now;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        setTwoDayLeft({ days, hours, minutes });
      } else {
        setTwoDayActive(false);
        setTwoDayFinished(true);
        setTwoDayLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const SocialIcon = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-4 bg-gradient-to-r from-egypt-gold to-egypt-gold-light rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-out"
      aria-label={label}
    >
      <Icon className="w-6 h-6 text-egypt-black group-hover:text-white transition-colors duration-300" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-egypt-gold-dark to-egypt-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z" />
    </svg>
  );

  const getCountdownLabels = () => {
    if (isArabic) {
      return {
        days: "أيام",
        hours: "ساعات",
        minutes: "دقائق",
        seconds: "ثواني",
      };
    }
    return {
      days: "DAYS",
      hours: "HOURS",
      minutes: "MINUTES",
      seconds: "SECONDS",
    };
  };

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm border border-egypt-gold/30 rounded-2xl p-6 shadow-2xl">
      <div className="text-4xl md:text-6xl font-bold text-egypt-gold mb-2 font-mono">
        {value.toString().padStart(2, "0")}
      </div>
      <div
        className={`text-egypt-sand text-sm md:text-base font-semibold uppercase tracking-wider ${isArabic ? "text-right" : ""}`}
      >
        {label}
      </div>
    </div>
  );

  const labels = getCountdownLabels();

  const [searchParams] = useSearchParams();
  const forceFinish = searchParams.get("preview") === "twoDayFinished";
  const isFinished = twoDayFinished || forceFinish;
  const isActive = twoDayActive && !forceFinish;
  const displayTwoDayLeft = forceFinish
    ? { days: 0, hours: 0, minutes: 0 }
    : twoDayLeft;

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-egypt-black via-gray-900 to-egypt-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-egypt-gold rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-egypt-gold-light rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="text-center relative z-10">
          {/* Loading spinner */}
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce"><p>🚕</p></div>
            <div className="w-16 h-16 border-4 border-egypt-gold/30 border-t-egypt-gold rounded-full animate-spin mx-auto"></div>
          </div>

          {/* Progress bar */}
          <div className="mx-auto w-64 h-2 bg-egypt-gold/20 rounded-full overflow-hidden border border-egypt-gold/30">
            <div
              className="h-full bg-gradient-to-r from-egypt-gold to-egypt-gold-light"
              style={{
                animation: `progress-fill ${LOADING_DURATION}ms linear forwards`,
              }}
            />
          </div>

          {/* Programmer credit */}
          <div className="text-egypt-gold text-lg md:text-xl font-semibold tracking-wider animate-pulse">
            PROGRAMMED BY MARWANZAID
          </div>

          {/* Luxurious shiny word: PABLO */}
          <div className="mt-3 text-center">
            <div className="text-5xl md:text-7xl font-extrabold tracking-[0.25em]">
              {Array.from("PABLO").map((ch, i) => (
                <span
                  key={i}
                  className="shiny-letter"
                  style={{ animationDelay: `${i * 0.15}s, 0s` }}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-egypt-gold rounded-full animate-bounce delay-0"></div>
            <div className="w-2 h-2 bg-egypt-gold rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-egypt-gold rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-egypt-black via-gray-900 to-egypt-black relative overflow-hidden">
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-50 bg-gradient-to-r from-egypt-gold to-egypt-gold-light text-egypt-black p-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-out"
        aria-label={isArabic ? "Switch to English" : "التبديل للعربية"}
      >
        <Languages className="w-5 h-5" />
      </button>

      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`}
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        aria-hidden
        onLoad={() => setPlayerReady(true)}
      />

      <button
        onClick={toggleAudio}
        className="fixed top-6 left-6 z-50 bg-gradient-to-r from-egypt-gold to-egypt-gold-light text-egypt-black p-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-out"
        aria-label={
          isArabic
            ? audioStarted
              ? isMuted
                ? "تشغيل الصوت"
                : "كتم الصوت"
              : "تشغيل صامت"
            : audioStarted
              ? isMuted
                ? "Unmute"
                : "Mute"
              : "Play muted"
        }
      >
        {audioStarted ? (
          isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      {/* Scroll Taxis */}
      {scrollTaxis.map((taxi) => (
        <div
          key={taxi.id}
          className={`fixed text-4xl z-40 pointer-events-none select-none animate-taxi-fall ${
            taxi.direction === "left"
              ? "animate-taxi-fall-from-left"
              : "animate-taxi-fall-from-right"
          }`}
          style={{
            left: taxi.direction === "left" ? "10%" : "85%",
            top: "-100px",
          }}
        >
          🚕
        </div>
      ))}

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-egypt-gold rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-24 h-24 bg-egypt-gold-light rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-egypt-gold-dark rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo/Brand */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-egypt-gold via-egypt-gold-light to-egypt-gold bg-clip-text text-transparent mb-4 tracking-tight">
            EGYPTIAN ADVENTURE
          </h1>
          <div
            className="text-6xl md:text-8xl mb-8 animate-taxi-drive relative pointer-events-none select-none"
            aria-hidden
            style={{ willChange: "transform" }}
          >
            🚕
          </div>
          <div className="text-2xl md:text-4xl font-bold mb-2 tracking-widest animate-fire-text">
            WAIT US ON SEPTEMBER 10
          </div>
          <div className="text-blue-400 font-bold text-sm md:text-base mb-6">
            {isFinished ? (
              <span className="text-blue-400">VEEEEEERY SOOOON</span>
            ) : isActive ? (
              <>
                NEW UPDATE IN
                <span className="ml-2 text-[10px] md:text-xs font-mono bg-blue-500/10 border border-blue-400/30 rounded px-2 py-0.5">
                  {displayTwoDayLeft.days}d {displayTwoDayLeft.hours}h{" "}
                  {displayTwoDayLeft.minutes}m
                </span>
              </>
            ) : (
              <>
                NEW UPDATE IN 2 days
                <span className="ml-2 text-[10px] md:text-xs font-mono bg-blue-500/10 border border-blue-400/30 rounded px-2 py-0.5">
                  2d 0h 0m
                </span>
              </>
            )}
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <CountdownBox value={timeLeft.days} label={labels.days} />
            <CountdownBox value={timeLeft.hours} label={labels.hours} />
            <CountdownBox value={timeLeft.minutes} label={labels.minutes} />
            <CountdownBox value={timeLeft.seconds} label={labels.seconds} />
          </div>

          {/* CTA and motivational text */}
          <div className="mt-6 flex flex-col items-center space-y-3">
            <button
              type="button"
              aria-label={isArabic ? "ابدأ الآن" : "Start now"}
              onClick={() =>
                toast({
                  title: (
                    <span className="font-extrabold tracking-wider bg-gradient-to-r from-egypt-gold via-egypt-gold-light to-egypt-gold bg-clip-text text-transparent">
                      WAIT US ON SEPTEMBER 10🚀🚀
                    </span>
                  ),
                  className:
                    "border-egypt-gold/60 bg-gradient-to-r from-egypt-gold/10 to-egypt-gold-light/10 backdrop-blur-md shadow-2xl",
                })
              }
              className="px-8 py-3 rounded-full font-bold text-egypt-black bg-gradient-to-r from-egypt-gold to-egypt-gold-light shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out border border-egypt-gold/40 focus:outline-none focus:ring-2 focus:ring-egypt-gold/60"
            >
              {isArabic ? "ابدأ الآن 🚀" : "START NOW 🚀"}
            </button>

            {/* Owner button with password dialog */}
            <Dialog open={ownerOpen} onOpenChange={setOwnerOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="px-6 py-2 rounded-full font-bold text-egypt-gold border border-egypt-gold/60 bg-black/20 hover:bg-black/30 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isArabic ? "المالك" : "THE OWNER"}
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-b from-egypt-black to-black/95 border-egypt-gold/30">
                <DialogHeader>
                  <DialogTitle className="bg-gradient-to-r from-egypt-gold via-egypt-gold-light to-egypt-gold bg-clip-text text-transparent">
                    {isArabic ? "دخول المالك" : "Owner Access"}
                  </DialogTitle>
                  <DialogDescription className="text-egypt-sand/80">
                    {isArabic
                      ? "أدخل كلمة المرور للمتابعة"
                      : "Enter the password to continue"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <Input
                    type="password"
                    inputMode="numeric"
                    placeholder={isArabic ? "كلمة المرور" : "Password"}
                    value={ownerPass}
                    onChange={(e) => setOwnerPass(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOwnerOpen(false);
                      setOwnerPass("");
                    }}
                  >
                    {isArabic ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-egypt-gold to-egypt-gold-light text-egypt-black"
                    onClick={() => {
                      if (ownerPass.trim() === "22") {
                        toast({
                          title: (
                            <span className="font-extrabold tracking-wider bg-gradient-to-r from-egypt-gold via-egypt-gold-light to-egypt-gold bg-clip-text text-transparent">
                              {isArabic
                                ? "��رحبًا أيها الما��ك"
                                : "Welcome, Owner"}
                            </span>
                          ),
                          className:
                            "border-egypt-gold/60 bg-gradient-to-r from-egypt-gold/10 to-egypt-gold-light/10 backdrop-blur-md shadow-2xl",
                        });
                        setOwnerOpen(false);
                        setOwnerPass("");
                        navigate("/owner");
                      } else {
                        toast({
                          title: isArabic
                            ? "كلمة المرور غير صحيحة"
                            : "Incorrect password",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    {isArabic ? "دخول" : "Access"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isLaunched && (
              <p className="text-egypt-sand text-center text-base md:text-lg font-semibold max-w-2xl">
                حان وقت الانطلاق! نسر اللعبة تحرّر الآن ��� كن أول من يقتحم
                المغامرة ويصنع الأ��طورة.
              </p>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6 mb-16">
          <SocialIcon
            href="https://www.tiktok.com/@marwanzaid_pablo"
            icon={TikTokIcon}
            label="TikTok"
          />
          <SocialIcon
            href="https://www.instagram.com/marwanzaid_pablo"
            icon={Instagram}
            label="Instagram"
          />
        </div>

        <div className="w-full max-w-3xl px-4 mb-8">
          <div className="flex items-center gap-3 text-egypt-gold">
            <span className="text-sm font-bold tracking-wider">MARWANZAID</span>
            <div className="flex-1 h-[2px] bg-egypt-gold/40" />
            <a
              href="https://app.wavecnct.com/marwan.zaid.egsr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold hover:text-egypt-gold-light underline decoration-egypt-gold/50 decoration-2 underline-offset-4 flex items-center gap-1"
            >
              KNOW WHO IS MARWAN ZAID <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm border-t border-egypt-gold/20 py-8">
        <div
          className={`text-center text-egypt-sand/80 space-y-2 ${isArabic ? "rtl" : "ltr"}`}
        >
          <p className="text-sm md:text-base font-semibold">
            {isArabic ? (
              <>
                الحقوق محفوظة ل{" "}
                <span className="text-egypt-gold font-bold">MARWAN ZAID</span>
              </>
            ) : (
              <>
                All rights reserved to{" "}
                <span className="text-egypt-gold font-bold">MARWAN ZAID</span>
              </>
            )}
          </p>
          <p className="text-sm md:text-base">
            {isArabic ? "صنع بكل حب ❤️" : "Made with love ❤️"}
          </p>
          <p className="text-xs md:text-sm text-egypt-sand/60">
            {isArabic
              ? "© 2025 جميع الحقوق محفوظة"
              : "© 2025 All rights reserved"}
          </p>
        </div>
      </footer>
    </div>
  );
}
