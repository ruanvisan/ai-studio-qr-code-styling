import { useQRStore } from "@/store/useQRStore";
import { Settings, Monitor, Terminal, Info, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { remoteConfig } from "@/lib/firebase";
import { fetchAndActivate, getValue } from "firebase/remote-config";

export function Preferences() {
  const { theme, setTheme } = useQRStore();
  const [hackerEnabled, setHackerEnabled] = useState(true);

  useEffect(() => {
    const checkRemoteConfig = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const isEnabled = getValue(remoteConfig, "hacker_theme_enabled").asBoolean();
        setHackerEnabled(isEnabled);
      } catch (error) {
        console.error("Remote Config error:", error);
      }
    };
    checkRemoteConfig();
  }, []);

  return (
    <div className="space-y-6">
      <div className="retro-bevel bg-[#c0c0c0] p-1">
        <div className="retro-header flex items-center gap-2">
          <Settings className="w-4 h-4" />
          SYSTEM_PREFERENCES.CPL
        </div>
        <div className="p-6 bg-white retro-inset space-y-8">
          
          <section className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-gray-300 pb-1">
              <Monitor className="w-4 h-4" /> VISUAL_THEME
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme("retro")}
                className={`retro-bevel p-4 flex flex-col items-center gap-3 transition-all ${theme === "retro" ? "bg-blue-50 border-blue-500 ring-2 ring-blue-400" : "bg-gray-50 hover:bg-gray-100"}`}
              >
                <div className="w-12 h-12 bg-[#c0c0c0] retro-bevel flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-800" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs">RETRO_CLASSIC</p>
                  <p className="text-[10px] text-gray-500">Windows 98/2000 Aesthetic</p>
                </div>
              </button>

              <button 
                onClick={() => hackerEnabled && setTheme("hacker")}
                disabled={!hackerEnabled}
                className={`retro-bevel p-4 flex flex-col items-center gap-3 transition-all ${theme === "hacker" ? "bg-green-900/10 border-green-500 ring-2 ring-green-400" : "bg-gray-50 hover:bg-gray-100"} ${!hackerEnabled ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
              >
                <div className="w-12 h-12 bg-black border border-green-500 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs">HACKER_CMD</p>
                  <p className="text-[10px] text-gray-500">Terminal / Matrix Style</p>
                  {!hackerEnabled && <p className="text-[9px] text-red-600 font-bold mt-1">[ DISABLED_BY_ADMIN ]</p>}
                </div>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-gray-300 pb-1">
              <ShieldCheck className="w-4 h-4" /> CLOUD_CONFIGURATION
            </h3>
            <div className="bg-blue-50 p-4 border border-blue-200 rounded text-[11px] space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Remote Config Status:</span>
                <span className="text-green-700 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hacker Theme Availability:</span>
                <span className={hackerEnabled ? "text-green-600" : "text-red-600"}>
                  {hackerEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-gray-300 pb-1">
              <Info className="w-4 h-4" /> ABOUT
            </h3>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              QR Styling 2000 v2.1.0-beta<br />
              Build: 2026.04.14.1512<br />
              All rights reserved. No part of this application may be reproduced in any form.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
