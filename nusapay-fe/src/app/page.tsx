"use client";

import { getMe } from "@/utils/auth";
import Image from "next/image";
export default function Homepage() {
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
      <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
        {/* Logo */}
        <Image
          src="/NusaSVG.svg"
          alt="NusaPay Logo"
          width={198}
          height={173}
          className="mb-6"
        />

        {/* NusaPay Title */}
        <Image
          src="/NusaPay.png"
          alt="NusaPay"
          width={300}
          height={100}
          className="mb-3"
        />

        {/* Subtitle */}
        <p className="text-cyan-400 text-sm sm:text-base md:text-lg font-medium mb-10">
          The First Cross-Chain Cross Border Payment using Chainlink CCIP
        </p>

        {/* Button */}
        <button
          className="bg-[#095564] text-white px-16 py-2 rounded-3xl border-y-1 text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-transform"
          onClick={async () => {
            const token = await getMe(); // ganti sesuai penyimpanan token kamu
            if (token) {
              window.location.href = "/transfer";
            } else {
              window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
              // window.location.href = "https://be-nusapay.vercel.app/auth/google";
            }
          }}
        >
          Transfer Now
        </button>
      </div>
    </div>
  );
}
