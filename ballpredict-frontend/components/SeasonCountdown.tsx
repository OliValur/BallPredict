"use client";

import Countdown, { CountdownRenderProps } from "react-countdown";

export default function SeasonCountdown() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Countdown
        date={new Date(2025, 8, 4, 14, 30, 0)}
        renderer={NFLCountdownRenderer}
      />
    </div>
  );
}

const NFLCountdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: CountdownRenderProps) => {
  if (completed) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-3 rounded-lg shadow-md">
        <span className="text-lg font-bold">🏈 Season is Live! 🏈</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Kickoff Text */}
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            <span className="font-bold text-sm">NFL Kickoff:</span>
          </div>

          {/* Countdown Boxes */}
          <div className="flex gap-2">
            {/* Days */}
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 border border-white/30 min-w-[3rem]">
                <div className="text-lg font-bold text-white leading-tight">
                  {days}
                </div>
                <div className="text-xs font-medium text-white/90 uppercase">
                  Days
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 border border-white/30 min-w-[3rem]">
                <div className="text-lg font-bold text-white leading-tight">
                  {hours}
                </div>
                <div className="text-xs font-medium text-white/90 uppercase">
                  Hrs
                </div>
              </div>
            </div>

            {/* Minutes */}
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 border border-white/30 min-w-[3rem]">
                <div className="text-lg font-bold text-white leading-tight">
                  {minutes}
                </div>
                <div className="text-xs font-medium text-white/90 uppercase">
                  Min
                </div>
              </div>
            </div>

            {/* Seconds */}
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 border border-white/30 min-w-[3rem]">
                <div className="text-lg font-bold text-white leading-tight">
                  {seconds}
                </div>
                <div className="text-xs font-medium text-white/90 uppercase">
                  Sec
                </div>
              </div>
            </div>
          </div>

          {/* Football Icon */}
          <span className="text-lg">🏈</span>
        </div>
      </div>
    </div>
  );
};
