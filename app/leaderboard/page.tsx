"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  username: string;
  clicks: number;
  timestamp: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [userClicks, setUserClicks] = useState<number>(0);
  const [showShareCard, setShowShareCard] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [isCopying, setIsCopying] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const username = "@username";

  useEffect(() => {
    // Load leaderboard from localStorage
    const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    // Sort by clicks descending
    const sorted = scores.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.clicks - a.clicks);
    setLeaderboard(sorted);

    // Find user's rank and best score
    const userScores = sorted.filter((entry: LeaderboardEntry) => entry.username === username);
    if (userScores.length > 0) {
      const bestScore = userScores[0];
      const rank = sorted.findIndex((entry: LeaderboardEntry) => entry === bestScore) + 1;
      setUserRank(rank);
      setUserClicks(bestScore.clicks);
    } else {
      // If no score, check final click count from home page
      const finalCount = parseInt(localStorage.getItem('finalClickCount') || '0');
      if (finalCount > 0) {
        setUserClicks(finalCount);
        // Find rank for this score
        const rank = sorted.findIndex((entry: LeaderboardEntry) => entry.clicks < finalCount) + 1;
        setUserRank(rank || sorted.length + 1);
      }
    }
  }, []);

  const handleShare = () => {
    setCopyStatus("");
    setShowShareCard(true);
  };

  const copyCardImage = async () => {
    if (!shareCardRef.current) return;
    setIsCopying(true);
    setCopyStatus("");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve)
      );
      if (blob && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        setCopyStatus("Image copied to clipboard.");
        return;
      }
      // Fallback: copy data URL
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result as string;
          await navigator.clipboard.writeText(dataUrl);
          setCopyStatus("Image data copied to clipboard.");
        };
        reader.readAsDataURL(blob);
        return;
      }
      setCopyStatus("Could not create image to copy.");
    } catch (error) {
      console.error("Error copying image:", error);
      setCopyStatus("Failed to copy image.");
    } finally {
      setIsCopying(false);
    }
  };

  const copyShareText = async () => {
    const text = `${username} scored ${userClicks}x! Tap to Base Blue Square`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Share text copied to clipboard.");
    } catch (error) {
      console.error("Error copying text:", error);
      setCopyStatus("Failed to copy text.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-black"></div>
          <span className="text-sm font-medium text-white">{username}</span>
        </div>
        <button className="p-2 text-white">
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
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col px-4 py-4">
        {/* User Rank Section */}
        {userClicks > 0 && (
          <div className="mb-4 flex items-center justify-between bg-gray-200 px-4 py-3">
            <span className="text-sm font-medium text-gray-800">
              Your rank: {userRank} with {userClicks}x
            </span>
            <button
              onClick={handleShare}
              className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
            >
              SHARE
            </button>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="flex-1">
          <div className="mb-2 flex border-b border-gray-300 pb-2 text-sm font-semibold text-gray-600">
            <div className="w-16">Rank</div>
            <div className="flex-1">Name</div>
            <div className="w-20 text-right">Clicked</div>
          </div>
          <div className="space-y-2">
            {leaderboard.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No scores yet. Play the game to see your rank!
              </div>
            ) : (
              leaderboard.slice(0, 20).map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className="flex items-center border-b border-gray-200 pb-2"
                >
                  <div className="w-16 text-sm font-medium text-gray-800">
                    {index + 1}
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {entry.username}
                      </span>
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium text-gray-800">
                    {entry.clicks}x
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Share Card (Hidden until share button is clicked) */}
      {showShareCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowShareCard(false)}
        >
          <div 
            className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={shareCardRef} className="flex flex-col items-center bg-white p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gray-300"></div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {username}
                  </span>
                </div>
              </div>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-800">{userClicks}x</span>
                <div className="h-12 w-12 rounded-lg bg-blue-500"></div>
              </div>
              <div className="w-full rounded bg-gray-800 px-4 py-3 text-center text-sm font-medium text-white">
                Tap to Base Blue Square
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 pt-0">
              <div className="flex gap-2">
                <button
                  onClick={copyCardImage}
                  className="flex-1 rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
                  disabled={isCopying}
                >
                  {isCopying ? "Copying..." : "Copy card as image"}
                </button>
                <button
                  onClick={copyShareText}
                  className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                >
                  Copy text
                </button>
              </div>
              {copyStatus && (
                <div className="text-center text-xs font-medium text-gray-600">
                  {copyStatus}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowShareCard(false)}
              className="absolute top-2 right-2 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-gray-800">
        <div className="flex">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center py-4"
          >
            <div className="h-6 w-6 rounded bg-white"></div>
          </Link>
          <Link
            href="/leaderboard"
            className="flex flex-1 items-center justify-center py-4"
          >
            <div className="flex gap-1">
              <div className="h-4 w-4 rounded-full bg-white"></div>
              <div className="h-4 w-4 rounded-full bg-white"></div>
              <div className="h-4 w-4 rounded-full bg-white"></div>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}

