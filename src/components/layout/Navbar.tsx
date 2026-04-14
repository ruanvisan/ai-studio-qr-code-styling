import { Github, Package, LogIn, LogOut, User as UserIcon, LayoutDashboard, Settings, History, HelpCircle, Menu, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { signInWithGoogle, logout } from "../../lib/firebase";
import { useQRStore } from "@/store/useQRStore";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const { user, loading } = useAuth();
  const { view, setView } = useQRStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (targetView: "generator" | "archive" | "preferences") => {
    setView(targetView);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#000080] text-white flex items-center justify-between px-4 z-[60] border-b-2 border-[#ffffff]">
        <div className="flex items-center gap-2" onClick={() => setView("generator")}>
          <div className="w-8 h-8 bg-[#c0c0c0] retro-bevel flex items-center justify-center">
            <div className="w-4 h-4 bg-black" />
          </div>
          <span className="font-bold text-lg italic">QR Styling 2000</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="retro-button px-3 py-1 flex items-center gap-2"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          MENU
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-16 left-0 right-0 bg-[#c0c0c0] z-50 retro-bevel p-4 space-y-2 border-b-4 border-[#808080]"
          >
            <SidebarLink 
              icon={<LayoutDashboard className="w-4 h-4" />} 
              label="QR Generator" 
              active={view === "generator"} 
              onClick={() => handleNavClick("generator")}
            />
            <SidebarLink 
              icon={<History className="w-4 h-4" />} 
              label="My Archive" 
              active={view === "archive"} 
              onClick={() => handleNavClick("archive")}
            />
            <SidebarLink 
              icon={<Settings className="w-4 h-4" />} 
              label="Preferences" 
              active={view === "preferences"} 
              onClick={() => handleNavClick("preferences")}
            />
            <div className="h-px bg-[#808080] my-2" />
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-white retro-inset">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-xs font-bold truncate">{user.displayName}</span>
                </div>
                <button onClick={logout} className="retro-button w-full py-2 text-red-700 flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> LOGOUT.SYS
                </button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="retro-button w-full py-2 flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> LOGIN_WITH_GOOGLE
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-[#c0c0c0] flex-col z-50 retro-bevel">
        {/* Logo Section */}
        <div className="retro-header m-1 text-center">
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-8 h-8 bg-white retro-inset flex items-center justify-center">
              <div className="w-4 h-4 bg-black" />
            </div>
            <span className="text-xl italic cursor-pointer" onClick={() => setView("generator")}>QR STYLING</span>
          </div>
          <div className="text-[10px] font-mono bg-black text-[#00ff00] py-0.5 px-2 inline-block">
            EST. 2026 - v1.6.0
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          <div className="bg-[#808080] text-white text-[10px] font-bold px-2 py-0.5 mb-2 uppercase">
            Main Directory
          </div>
          <SidebarLink 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="QR Generator" 
            active={view === "generator"} 
            onClick={() => setView("generator")}
          />
          <SidebarLink 
            icon={<History className="w-4 h-4" />} 
            label="My Archive" 
            active={view === "archive"} 
            onClick={() => setView("archive")}
          />
          <SidebarLink 
            icon={<Settings className="w-4 h-4" />} 
            label="Preferences" 
            active={view === "preferences"}
            onClick={() => setView("preferences")}
          />
          <SidebarLink icon={<HelpCircle className="w-4 h-4" />} label="Help Center" />
          
          <div className="mt-8 p-2 bg-yellow-100 border border-yellow-400 text-[10px] text-yellow-800">
            <strong>TIP:</strong> Use high contrast colors for better scanning!
          </div>
        </div>

        {/* User / Auth Section */}
        <div className="p-2 m-1 retro-inset bg-[#d4d4d4]">
          {!loading && (
            user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-1 bg-white retro-inset">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="User" 
                      className="w-8 h-8 border border-black"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#808080] flex items-center justify-center text-white">?</div>
                  )}
                  <div className="flex flex-col overflow-hidden leading-tight">
                    <span className="text-[11px] font-bold truncate">{user.displayName}</span>
                    <span className="text-[9px] text-blue-700 underline truncate">{user.email}</span>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="retro-button w-full text-red-700"
                >
                  [ LOGOUT ]
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="retro-button w-full flex items-center justify-center gap-2 py-2"
              >
                <LogIn className="w-4 h-4" />
                SIGN IN NOW
              </button>
            )
          )}
        </div>

        {/* Footer Links */}
        <div className="p-2 bg-[#808080] flex items-center justify-between">
          <a href="#" className="text-white text-[10px] hover:underline">About Us</a>
          <a href="#" className="text-white text-[10px] hover:underline">Privacy</a>
          <div className="flex gap-2">
             <a href="https://github.com/ruanvisan" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
               <Github className="w-4 h-4 text-white" />
             </a>
          </div>
        </div>
        
        <div className="bg-black text-[#00ff00] text-[9px] font-mono p-1 text-center">
          OPTIMIZED FOR IE 6.0+
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
      w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold transition-none text-left
      ${active 
        ? "bg-[#000080] text-white" 
        : "text-black hover:bg-[#000080] hover:text-white border border-transparent hover:border-white"}
    `}>
      <span className={active ? "text-yellow-400" : "text-blue-800"}>{icon}</span>
      {label}
    </button>
  );
}
