"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const words = [
  "COMING SOON!",
  "STAY TUNED!",
  "LAUNCHING SOON 🚀",
  "GET READY!",
  "EXCITING THINGS AHEAD!",
];

export default function Homepage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed] = useState(100);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, typingSpeed / 2);
    } else {
      timeout = setTimeout(() => {
        setDisplayText((prev) => currentWord.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <div className="relative h-fit w-full overflow-hidden">
      {/* Background Image Glow */}
      <Image
        src="/background.png"
        alt="Background Glow"
        width={1300}
        height={1300}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 invisible md:visible opacity-100 pointer-events-none select-none"
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
        {/* NusaPay Title with Typewriter */}
        <div className="mb-3 text-4xl sm:text-5xl md:text-6xl font-bold text-white min-h-[70px]">
          {displayText}
          <span className="border-r-2 border-white animate-pulse ml-1" />
        </div>

        {/* Subtitle */}
        <p className="text-cyan-400 text-sm sm:text-base md:text-lg font-medium mb-10">
          We&apos;re working hard to bring you something amazing.
        </p>
      </div>
    </div>
  );
}
