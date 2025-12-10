"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { sdk } from '@farcaster/miniapp-sdk';




const TIME_LIMIT = 5;

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isGameActive, setIsGameActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [finalClickCount, setFinalClickCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [boxSize, setBoxSize] = useState(192); // Starting size: 48 * 4 = 192px (h-48 w-48)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const MAX_BOX_SIZE = 320; // Maximum size for the blue box
  const SIZE_INCREMENT = 4; // How much to increase per click

  useEffect(() => {
    sdk.actions.ready();

    if (isGameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameActive(false);
            // Save final click count when timer finishes
            setFinalClickCount(clickCount);
            // Save score to localStorage
            if (clickCount > 0) {
              const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
              const username = '@username';
              scores.push({
                username,
                clicks: clickCount,
                timestamp: Date.now()
              });
              // Sort by clicks descending and keep top 100
              scores.sort((a: any, b: any) => b.clicks - a.clicks);
              localStorage.setItem('leaderboard', JSON.stringify(scores.slice(0, 100)));
              localStorage.setItem('finalClickCount', clickCount.toString());
            }
            return TIME_LIMIT; // Reset to 5
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameActive, timeLeft]);

  const handleAddMiniApp = async () => {
    try {
      await sdk.actions.addMiniApp();
    } catch (error) {
      console.error("addMiniApp failed", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    if (!isGameActive && timeLeft === TIME_LIMIT) {
      // Start the game - reset click count for new game
      setIsGameActive(true);
      setHasStarted(true);
      setClickCount(1);
      setFinalClickCount(0);
      setBoxSize((prev) => Math.min(prev + SIZE_INCREMENT, MAX_BOX_SIZE));
    } else if (isGameActive) {
      // Game is active, count the click
      setClickCount((prev) => prev + 1);
      setBoxSize((prev) => Math.min(prev + SIZE_INCREMENT, MAX_BOX_SIZE));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-black"></div>
          <span className="text-base font-semibold">@username</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddMiniApp}
            className="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Add app
          </button>
          <button className="p-2 text-slate-900">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        {/* Max Click Counter - Top Left */}
        {(hasStarted || finalClickCount > 0) && (
          <div className="absolute left-4 top-4">
            <span className="text-base font-semibold text-slate-900">
              Max click:{" "}
              <span className="text-lg font-extrabold">
                {isGameActive ? clickCount : finalClickCount}x
              </span>
            </span>
          </div>
        )}

        {/* Static max click display to mirror wireframe when not started */}
        {!hasStarted && finalClickCount === 0 && (
          <div className="absolute left-4 top-4">
            <span className="text-base font-semibold text-slate-900">
              Max click: <span className="text-lg font-extrabold">10x</span>
            </span>
          </div>
        )}

        {/* Max Click Counter - Top Left */}
        {!hasStarted && (
          <p className="mb-8 mt-10 text-center text-xl font-semibold text-slate-900">
            Tap to blue box to start!
          </p>
        )}
        
        {/* Blue Box */}
        <div className="mb-12 flex items-center justify-center">
          <div
            ref={boxRef}
            onClick={handleBoxClick}
            className="rounded-lg bg-blue-600 transition-all duration-200 shadow-md"
            style={{
              width: `${boxSize}px`,
              height: `${boxSize}px`,
              cursor: "pointer",
            }}
          />
        </div>

        {/* Timer */}
        <div className="mt-4 text-3xl font-bold text-slate-900">
          {formatTime(timeLeft)}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t border-gray-200 bg-gray-200">
        <div className="flex">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center py-4"
          >
            <div className="h-6 w-6 rounded bg-white shadow-sm"></div>
          </Link>
          <Link
            href="/leaderboard"
            className="flex flex-1 items-center justify-center py-4"
          >
            <div className="flex gap-1">
              <div className="h-4 w-4 rounded-full bg-white shadow-sm"></div>
              <div className="h-4 w-4 rounded-full bg-white shadow-sm"></div>
              <div className="h-4 w-4 rounded-full bg-white shadow-sm"></div>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
