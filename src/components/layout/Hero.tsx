import { motion } from "motion/react";
import { useQRStore } from "@/store/useQRStore";

export function Hero() {
  return (
    <section className="relative pt-20 lg:pt-12 pb-12 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="relative z-10 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary italic drop-shadow-[2px_2px_0px_var(--background)]">
          QR STYLING 2000
        </h1>
        <div className="inline-block bg-destructive text-white px-4 py-1 font-bold text-xl skew-x-[-12deg] retro-bevel">
          NEW VERSION 1.6!
        </div>
        <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto leading-relaxed font-bold bg-accent/80 p-2 retro-bevel">
          THE WORLD'S #1 CUSTOMIZABLE QR GENERATOR! <br className="hidden md:block" />
          CREATE, STYLE, AND DOWNLOAD BEAUTIFUL CODES WITH LOGOS.
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-bounce flex items-center justify-center text-white font-bold text-xs">HOT!</div>
          <div className="w-12 h-12 bg-green-600 rounded-full animate-pulse flex items-center justify-center text-white font-bold text-xs">FREE!</div>
        </div>
      </div>
    </section>
  );
}
