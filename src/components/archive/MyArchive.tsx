import { useEffect, useState } from "react";
import { archiveService, SavedQR, SavedPreset } from "@/services/archiveService";
import { useQRStore } from "@/store/useQRStore";
import { Download, Trash2, ExternalLink, Package, QrCode, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RetroModal } from "@/components/ui/RetroModal";

export function MyArchive() {
  const [qrs, setQrs] = useState<SavedQR[]>([]);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: "qr" | "preset", name: string } | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

  const { setOptions, setFrame, setView } = useQRStore();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      loadArchive();
    }
  }, [user, authLoading]);

  const loadArchive = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log("Loading archive for user:", user.uid);
    try {
      const [fetchedQrs, fetchedPresets] = await Promise.all([
        archiveService.getSavedQRCodes(),
        archiveService.getPresets()
      ]);
      console.log("Fetched QRs:", fetchedQrs.length);
      console.log("Fetched Presets:", fetchedPresets.length);
      setQrs(fetchedQrs);
      setPresets(fetchedPresets);
    } catch (error) {
      console.error("Failed to load archive:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = (preset: SavedPreset) => {
    setOptions(preset.config);
    setFrame(preset.frame);
    setView("generator");
  };

  const handleDownloadSavedQR = (qr: SavedQR) => {
    const link = document.createElement('a');
    link.download = `${qr.name}.png`;
    link.href = qr.imageUrl;
    link.click();
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    setDeleteStatus(null);
    try {
      if (deleteConfirm.type === "qr") {
        await archiveService.deleteQRCode(deleteConfirm.id);
      } else {
        await archiveService.deletePreset(deleteConfirm.id);
      }
      setDeleteStatus({ type: "success", message: "Item deleted successfully!" });
      loadArchive();
      setTimeout(() => {
        setDeleteConfirm(null);
        setDeleteStatus(null);
      }, 1500);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteStatus({ type: "error", message: "Failed to delete item." });
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-background retro-inset p-8 text-center">
        <div className="text-blue-600 font-bold mb-4 animate-pulse">INITIALIZING_AUTH.SYS</div>
        <p className="text-sm">Please wait while we verify your session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-background retro-inset p-8 text-center">
        <div className="text-red-600 font-bold mb-4">ACCESS_DENIED.SYS</div>
        <p className="text-sm">Please sign in to view your archives.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={loadArchive}
          disabled={loading}
          className="retro-button flex items-center gap-2 px-4 py-2 text-xs"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          REFRESH_DATABASE
        </button>
      </div>
      {/* Presets Section */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header flex items-center gap-2">
          <Package className="w-4 h-4" />
          STYLE_PRESETS.DLL
        </div>
        <div className="p-4 bg-background retro-inset min-h-[100px]">
          {loading ? (
            <div className="text-center py-4 font-mono text-xs">LOADING_PRESETS...</div>
          ) : presets.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-xs italic">No presets saved yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presets.map((preset) => (
                <div key={preset.id} className="retro-bevel bg-muted p-2 flex flex-col gap-2">
                  <div className="bg-background retro-inset p-1 font-bold text-[10px] truncate">
                    {preset.name}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleLoadPreset(preset)}
                      className="retro-button flex-1 flex items-center justify-center gap-1 text-[9px]"
                    >
                      <ExternalLink className="w-3 h-3" /> LOAD
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ id: preset.id, type: "preset", name: preset.name })}
                      className="retro-button text-red-700 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved QRs Section */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          SAVED_QR_CODES.EXE
        </div>
        <div className="p-4 bg-background retro-inset min-h-[200px]">
          {loading ? (
            <div className="text-center py-4 font-mono text-xs">LOADING_DATABASE...</div>
          ) : qrs.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-xs italic">No QR codes saved yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrs.map((qr) => (
                <div key={qr.id} className="retro-bevel bg-muted p-2 flex flex-col gap-2">
                  <div className="bg-background retro-inset p-1 font-bold text-[10px] truncate">
                    {qr.name}
                  </div>
                  <div className="bg-background retro-inset p-2 flex items-center justify-center aspect-square overflow-hidden">
                    <img 
                      src={qr.imageUrl} 
                      alt={qr.name} 
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleDownloadSavedQR(qr)}
                      className="retro-button flex-1 flex items-center justify-center gap-1 text-[9px]"
                    >
                      <Download className="w-3 h-3" /> DOWNLOAD
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ id: qr.id, type: "qr", name: qr.name })}
                      className="retro-button text-red-700 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <RetroModal
        isOpen={deleteConfirm !== null}
        onClose={() => {
          if (!deleting) {
            setDeleteConfirm(null);
            setDeleteStatus(null);
          }
        }}
        title="CONFIRM_DELETION.SYS"
      >
        <div className="space-y-4">
          {!deleteStatus ? (
            <>
              <div className="bg-red-50 p-3 border border-red-200 text-red-800 text-xs">
                <p className="font-bold mb-1 underline">WARNING:</p>
                <p>Are you sure you want to permanently delete this {deleteConfirm?.type === "qr" ? "QR Code" : "Preset"}?</p>
                <p className="mt-2 font-mono font-bold">ITEM: {deleteConfirm?.name}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="retro-button flex-1 py-2 font-bold bg-red-100 text-red-700"
                >
                  {deleting ? "DELETING..." : "[ YES_DELETE_NOW ]"}
                </button>
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="retro-button px-6 py-2"
                >
                  NO
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 space-y-3">
              {deleteStatus.type === "success" ? (
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-red-600" />
              )}
              <p className={`text-sm font-bold ${deleteStatus.type === "success" ? "text-green-700" : "text-red-700"}`}>
                {deleteStatus.message}
              </p>
            </div>
          )}
        </div>
      </RetroModal>
    </div>
  );
}
