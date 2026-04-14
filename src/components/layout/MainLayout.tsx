import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#ffffff] font-sans text-black flex flex-col lg:flex-row">
      <Navbar />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Hero />
        <main className="max-w-7xl w-full mx-auto px-4 md:px-6 pb-24 relative z-10">
          <div className="bg-[#c0c0c0] retro-bevel overflow-hidden">
            {children}
          </div>
        </main>
        
        <footer className="py-8 text-center text-black text-xs border-t-2 border-[#808080] bg-[#c0c0c0] mt-auto">
          <div className="flex justify-center gap-4 mb-4">
             <img src="https://picsum.photos/seed/award/88/31" alt="Award" className="border border-black" referrerPolicy="no-referrer" />
             <img src="https://picsum.photos/seed/valid/88/31" alt="Valid HTML" className="border border-black" referrerPolicy="no-referrer" />
          </div>
          <p className="font-bold">© 2026 QR CODE STYLING 2000. ALL RIGHTS RESERVED.</p>
          <p className="mt-1">BEST VIEWED IN 1024x768 RESOLUTION</p>
        </footer>
      </div>
    </div>
  );
}
