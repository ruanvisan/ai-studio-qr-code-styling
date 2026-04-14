import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { useQRStore } from "@/store/useQRStore";
import { Download, FileJson, RefreshCcw, Save, Bookmark, CheckCircle2, AlertCircle } from "lucide-react";
import { QRFormat } from "@/types/qr";
import * as htmlToImage from 'html-to-image';
import { archiveService } from "@/services/archiveService";
import { useAuth } from "@/hooks/useAuth";
import { RetroModal } from "@/components/ui/RetroModal";

export function QRPreview() {
  const { options, format, setFormat, reset, frame } = useQRStore();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveType, setSaveType] = useState<"qr" | "preset" | null>(null);
  const [saveName, setSaveName] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(options);
    } else {
      qrCode.current.update(options);
    }

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, [options]);

  const handleDownload = async () => {
    if (!captureRef.current) return;

    try {
      let dataUrl = '';
      const extension = format === 'svg' ? 'svg' : format;
      
      if (frame.type === 'none') {
        qrCode.current?.download({
          name: "qr-code",
          extension: format,
        });
        return;
      }

      // Capture the frame + QR
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(captureRef.current);
      } else if (format === 'jpeg') {
        dataUrl = await htmlToImage.toJpeg(captureRef.current);
      } else if (format === 'svg') {
        dataUrl = await htmlToImage.toSvg(captureRef.current);
      }

      const link = document.createElement('a');
      link.download = `qr-code-framed.${extension}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!saveName.trim()) return;

    setSaving(true);
    setStatus(null);
    try {
      if (saveType === "qr") {
        if (!captureRef.current) throw new Error("Capture ref not found");
        
        // Capture the image as a data URL
        const imageUrl = await htmlToImage.toPng(captureRef.current, {
          quality: 0.8,
          pixelRatio: 1, // Keep size reasonable for Firestore
        });
        
        await archiveService.saveQRCode(saveName, imageUrl);
      } else {
        await archiveService.savePreset(saveName, options, frame);
      }
      setStatus({ type: "success", message: `${saveType === "qr" ? "QR Code" : "Preset"} saved successfully!` });
      setSaveName("");
      setTimeout(() => {
        setSaveType(null);
        setStatus(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to save:", error);
      setStatus({ type: "error", message: "Error saving. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(options, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "qr-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getFrameClass = () => {
    switch (frame.type) {
      case 'winxp': return 'frame-winxp';
      case 'tv': return 'frame-tv';
      case 'monitor': return 'frame-monitor';
      default: return '';
    }
  };

  const getFrameStyle = () => {
    if (frame.type === 'color') {
      return { border: `20px solid ${frame.color}`, padding: '20px' };
    }
    return {};
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-[440px]">
      <div className="retro-bevel bg-secondary p-1 w-full">
        <div className="retro-header flex items-center justify-between mb-1">
          <span className="text-[11px]">PREVIEW_WINDOW.EXE</span>
          <div className="flex gap-1">
            <button className="w-4 h-4 bg-secondary retro-bevel text-black text-[10px] flex items-center justify-center">_</button>
            <button className="w-4 h-4 bg-secondary retro-bevel text-black text-[10px] flex items-center justify-center">X</button>
          </div>
        </div>
        
        <div className="bg-background p-8 flex flex-col items-center justify-center retro-inset min-h-[400px] overflow-auto">
          <div 
            ref={captureRef} 
            className={`${getFrameClass()} flex items-center justify-center bg-background`}
            style={getFrameStyle()}
          >
            <div ref={qrRef} className="qr-container" />
          </div>
        </div>
        
        <div className="mt-1 bg-[#808080] text-white text-[9px] p-1 flex justify-between">
          <span>Status: Ready to scan</span>
          <span>100% Complete</span>
        </div>
      </div>

      <div className="w-full space-y-4 bg-secondary p-4 retro-bevel">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold block mb-1">EXPORT_FORMAT:</label>
            <select 
              value={format} 
              onChange={(e) => setFormat(e.target.value as QRFormat)}
              className="w-full retro-inset p-1 text-xs font-mono h-10"
            >
              <option value="png">IMAGE/PNG</option>
              <option value="jpeg">IMAGE/JPG</option>
              <option value="svg">VECTOR/SVG</option>
            </select>
          </div>

          <button 
            onClick={handleDownload}
            className="retro-button h-12 w-full flex items-center justify-center gap-2 text-lg"
          >
            <Download className="w-5 h-5" />
            DOWNLOAD_NOW
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setSaveType("qr")}
            className="retro-button h-10 flex items-center justify-center gap-2 text-[10px] bg-blue-100"
          >
            <Save className="w-4 h-4" />
            SAVE_QR_CODE
          </button>
          <button 
            onClick={() => setSaveType("preset")}
            className="retro-button h-10 flex items-center justify-center gap-2 text-[10px] bg-green-100"
          >
            <Bookmark className="w-4 h-4" />
            SAVE_PRESET
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleExportJSON}
            className="retro-button h-10 flex items-center justify-center gap-2 text-[10px]"
          >
            <FileJson className="w-4 h-4" />
            EXPORT_JSON
          </button>
          
          <button 
            onClick={reset}
            className="retro-button h-10 flex items-center justify-center gap-2 text-[10px] text-red-700"
          >
            <RefreshCcw className="w-4 h-4" />
            RESET_ALL
          </button>
        </div>
        
        <div className="text-center">
          <a href="#" className="text-[9px] text-blue-800 underline">Need help with your download?</a>
        </div>
      </div>

      {/* Save Modal */}
      <RetroModal 
        isOpen={saveType !== null} 
        onClose={() => {
          setSaveType(null);
          setStatus(null);
        }}
        title={saveType === "qr" ? "SAVE_QR_CODE.EXE" : "SAVE_PRESET.EXE"}
      >
        <div className="space-y-4">
          {!status ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-bold block">ENTER_NAME:</label>
                <input 
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={saveType === "qr" ? "My QR Code" : "My Style Preset"}
                  className="w-full bg-white retro-inset p-2 text-xs font-mono"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  disabled={saving || !saveName.trim()}
                  className="retro-button flex-1 py-2 font-bold disabled:opacity-50"
                >
                  {saving ? "SAVING..." : "[ COMMIT_CHANGES ]"}
                </button>
                <button 
                  onClick={() => setSaveType(null)}
                  className="retro-button px-4 py-2"
                >
                  CANCEL
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 space-y-3">
              {status.type === "success" ? (
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-red-600" />
              )}
              <p className={`text-sm font-bold ${status.type === "success" ? "text-green-700" : "text-red-700"}`}>
                {status.message}
              </p>
            </div>
          )}
        </div>
      </RetroModal>
    </div>
  );
}
