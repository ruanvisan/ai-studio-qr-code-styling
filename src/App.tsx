import { MainLayout } from "./components/layout/MainLayout";
import { QRControls } from "./components/qr/QRControls";
import { QRPreview } from "./components/qr/QRPreview";
import { Hero } from "./components/layout/Hero";
import { MyArchive } from "./components/archive/MyArchive";
import { Preferences } from "./components/preferences/Preferences";
import { useAuth } from "./hooks/useAuth";
import { useQRStore } from "./store/useQRStore";
import { useEffect } from "react";

export default function App() {
  const { user } = useAuth();
  const { view, theme } = useQRStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const renderContent = () => {
    switch (view) {
      case "generator":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Controls */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="retro-bevel bg-[#c0c0c0] p-1">
                <div className="retro-header flex items-center justify-between">
                  <span>SYSTEM_CONFIG.EXE</span>
                  {user && (
                    <span className="text-[9px] bg-black text-[#00ff00] px-2 py-0.5 font-mono">
                      USER: {user.displayName?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-[#d4d4d4] text-[11px] font-bold border-b border-white">
                  WELCOME TO QR STYLING 2000 - PLEASE CONFIGURE YOUR DATA BELOW
                </div>
              </div>
              <QRControls />
            </div>

            {/* Right Column: Preview */}
            <div className="lg:sticky lg:top-8 h-fit space-y-6 order-1 lg:order-2">
              <div className="retro-bevel bg-[#c0c0c0] p-1">
                <div className="retro-header">REALTIME_RENDER.SYS</div>
                <div className="p-3 bg-[#d4d4d4] text-[11px] font-bold border-b border-white">
                  VISUAL_OUTPUT_STREAM [ACTIVE]
                </div>
              </div>
              <QRPreview />
            </div>
          </div>
        );
      case "archive":
        return (
          <div className="space-y-6">
            <div className="retro-bevel bg-[#c0c0c0] p-1">
              <div className="retro-header">MY_ARCHIVES_EXPLORER.SYS</div>
              <div className="p-3 bg-[#d4d4d4] text-[11px] font-bold border-b border-white">
                BROWSE YOUR SAVED PRESETS AND QR CODES
              </div>
            </div>
            <MyArchive />
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-6">
            <div className="retro-bevel bg-[#c0c0c0] p-1">
              <div className="retro-header">GLOBAL_PREFERENCES.SYS</div>
              <div className="p-3 bg-[#d4d4d4] text-[11px] font-bold border-b border-white">
                CUSTOMIZE YOUR SYSTEM EXPERIENCE
              </div>
            </div>
            <Preferences />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-4 md:p-8">
        <Hero />
        {renderContent()}
      </div>
    </MainLayout>
  );
}
