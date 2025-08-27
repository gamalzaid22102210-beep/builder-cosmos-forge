import { useEffect, useState } from "react";
import { Instagram, Languages } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Index() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isArabic, setIsArabic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollTaxis, setScrollTaxis] = useState<
    Array<{
      id: number;
      direction: "left" | "right";
      timestamp: number;
    }>
  >([]);

  const targetDate = new Date("2025-09-05T00:00:00").getTime();

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  // Loading screen effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loading for 2.5 seconds

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

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

  // Automatic taxi drop every 1 second
  useEffect(() => {
    let taxiCounter = 0;

    const autoTaxiInterval = setInterval(() => {
      // Alternate direction: even numbers from right, odd numbers from left
      const direction: 'left' | 'right' = taxiCounter % 2 === 0 ? 'right' : 'left';
      taxiCounter++;

      // Create new taxi
      const newTaxi = {
        id: Date.now() + Math.random(),
        direction,
        timestamp: Date.now()
      };

      setScrollTaxis(prev => [...prev, newTaxi]);

      // Remove taxi after animation completes
      setTimeout(() => {
        setScrollTaxis(prev => prev.filter(taxi => taxi.id !== newTaxi.id));
      }, 3000);
    }, 1000); // Every 1 second

    return () => clearInterval(autoTaxiInterval);
  }, []); // Empty dependency array to run only once


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
        minutes: "دق��ئق",
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
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-bounce">🚕</div>
            <div className="w-16 h-16 border-4 border-egypt-gold/30 border-t-egypt-gold rounded-full animate-spin mx-auto"></div>
          </div>

          {/* Programmer credit */}
          <div className="text-egypt-gold text-lg md:text-xl font-semibold tracking-wider animate-pulse">
            PROGRAMMED BY MARWANZAID
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

      {/* Scroll Taxis */}
      {scrollTaxis.map((taxi) => (
        <div
          key={taxi.id}
          className={`fixed text-4xl z-40 animate-taxi-fall ${
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
          <div className="text-6xl md:text-8xl mb-8 animate-taxi-drive relative">
            🚕
          </div>
          <div className="text-2xl md:text-4xl font-bold mb-6 tracking-widest animate-fire-text">
            WAIT US ON SEPTEMBER 5
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
