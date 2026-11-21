import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';

const LAUNCH_TARGET = new Date('2027-01-01T00:00:00+05:30').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

function getTimeLeft(): TimeLeft {
  const diff = LAUNCH_TARGET - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isLive: false };
}

const pad = (value: number) => String(value).padStart(2, '0');

export const LaunchCountdownStrip = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft());

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#0F3D42] text-white border-b border-teal-900/40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold tracking-wide">
          <Rocket className="w-3.5 h-3.5 text-[#FFD26E]" />
          Launching in
        </span>
        {timeLeft.isLive ? (
          <span className="font-bold text-[#FFD26E]">We&apos;re live</span>
        ) : (
          <div className="inline-flex items-center gap-1.5 font-mono font-semibold tabular-nums">
            <span>{timeLeft.days}d</span>
            <span className="text-white/40">:</span>
            <span>{pad(timeLeft.hours)}h</span>
            <span className="text-white/40">:</span>
            <span>{pad(timeLeft.minutes)}m</span>
            <span className="text-white/40">:</span>
            <span>{pad(timeLeft.seconds)}s</span>
            <span className="text-white/60 font-sans font-medium ml-1">· 01 Jan 2027</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchCountdownStrip;
