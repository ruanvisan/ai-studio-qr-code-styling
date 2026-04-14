import { useQRStore } from "@/store/useQRStore";
import { Settings, Grid3X3, Square, Circle, Palette, Image as ImageIcon, QrCode, Type } from "lucide-react";

export function QRControls() {
  const { options, setOptions, frame, setFrame } = useQRStore();

  const updateDots = (newDots: any) => {
    setOptions({ dotsOptions: { ...options.dotsOptions, ...newDots } });
  };

  const updateDotsGradient = (newGradient: any) => {
    setOptions({ 
      dotsOptions: { 
        ...options.dotsOptions, 
        gradient: { ...options.dotsOptions?.gradient, ...newGradient } 
      } 
    });
  };

  const updateCornersSquare = (newCorners: any) => {
    setOptions({ cornersSquareOptions: { ...options.cornersSquareOptions, ...newCorners } });
  };

  const updateCornersDot = (newCorners: any) => {
    setOptions({ cornersDotOptions: { ...options.cornersDotOptions, ...newCorners } });
  };

  return (
    <div className="space-y-4">
      {/* DATA INPUT */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header">DATA_INPUT.EXE</div>
        <div className="p-4 bg-background retro-inset space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold block">TARGET_URL:</label>
            <input 
              value={options.data} 
              onChange={(e) => setOptions({ data: e.target.value })}
              className="w-full retro-inset p-1 text-xs font-mono h-8"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">WIDTH:</label>
              <input 
                type="number" 
                value={options.width} 
                onChange={(e) => setOptions({ width: Number(e.target.value) })}
                className="w-full retro-inset p-1 text-xs font-mono h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">HEIGHT:</label>
              <input 
                type="number" 
                value={options.height} 
                onChange={(e) => setOptions({ height: Number(e.target.value) })}
                className="w-full retro-inset p-1 text-xs font-mono h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">MARGIN:</label>
              <input 
                type="number" 
                value={options.margin} 
                onChange={(e) => setOptions({ margin: Number(e.target.value) })}
                className="w-full retro-inset p-1 text-xs font-mono h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STYLE ENGINE (Dots & Background) */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header">STYLE_ENGINE.DLL</div>
        <div className="p-4 bg-background retro-inset space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">DOT_TYPE:</label>
              <select 
                value={options.dotsOptions?.type} 
                onChange={(e) => updateDots({ type: e.target.value })}
                className="w-full retro-inset p-1 text-xs font-mono h-8"
              >
                <option value="rounded">ROUNDED</option>
                <option value="dots">DOTS</option>
                <option value="classy">CLASSY</option>
                <option value="classy-rounded">CLASSY_ROUNDED</option>
                <option value="square">SQUARE</option>
                <option value="extra-rounded">EXTRA_ROUNDED</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">BG_COLOR:</label>
              <div className="flex gap-1">
                <input 
                  type="color" 
                  value={options.backgroundOptions?.color} 
                  onChange={(e) => setOptions({ backgroundOptions: { ...options.backgroundOptions, color: e.target.value } })}
                  className="w-8 h-8 cursor-pointer retro-bevel p-0"
                />
                <input 
                  value={options.backgroundOptions?.color} 
                  onChange={(e) => setOptions({ backgroundOptions: { ...options.backgroundOptions, color: e.target.value } })}
                  className="flex-1 bg-white retro-inset p-1 text-[10px] font-mono h-8"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold block">DOT_COLOR (PRIMARY):</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={options.dotsOptions?.color} 
                onChange={(e) => updateDots({ color: e.target.value })}
                className="w-8 h-8 cursor-pointer retro-bevel p-0"
              />
              <input 
                value={options.dotsOptions?.color} 
                onChange={(e) => updateDots({ color: e.target.value })}
                className="flex-1 bg-white retro-inset p-1 text-xs font-mono h-8"
              />
            </div>
          </div>

          <div className="space-y-2 p-2 bg-[#d4d4d4] retro-inset">
            <label className="text-[9px] font-bold block text-[#000080]">GRADIENT_MODULE:</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={options.dotsOptions?.gradient?.colorStops?.[1]?.color || "#000000"} 
                onChange={(e) => updateDotsGradient({ 
                  colorStops: [
                    { offset: 0, color: options.dotsOptions?.color || "#000000" },
                    { offset: 1, color: e.target.value }
                  ] 
                })}
                className="w-8 h-8 cursor-pointer retro-bevel p-0"
              />
              <input 
                value={options.dotsOptions?.gradient?.colorStops?.[1]?.color || "#000000"} 
                onChange={(e) => updateDotsGradient({ 
                  colorStops: [
                    { offset: 0, color: options.dotsOptions?.color || "#000000" },
                    { offset: 1, color: e.target.value }
                  ] 
                })}
                className="flex-1 bg-white retro-inset p-1 text-xs font-mono h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CORNERS MANAGER */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header">CORNERS_MANAGER.DRV</div>
        <div className="p-4 bg-background retro-inset space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Corners Square */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold block">SQUARE_TYPE:</label>
              <select 
                value={options.cornersSquareOptions?.type} 
                onChange={(e) => updateCornersSquare({ type: e.target.value })}
                className="w-full retro-inset p-1 text-xs font-mono h-8"
              >
                <option value="square">SQUARE</option>
                <option value="dot">DOT</option>
                <option value="rounded">ROUNDED</option>
                <option value="extra-rounded">EXTRA_ROUNDED</option>
              </select>
              <div className="flex gap-1">
                <input 
                  type="color" 
                  value={options.cornersSquareOptions?.color} 
                  onChange={(e) => updateCornersSquare({ color: e.target.value })}
                  className="w-6 h-6 cursor-pointer retro-bevel p-0"
                />
                <input 
                  value={options.cornersSquareOptions?.color} 
                  onChange={(e) => updateCornersSquare({ color: e.target.value })}
                  className="flex-1 bg-white retro-inset p-1 text-[9px] font-mono h-6"
                />
              </div>
            </div>
            {/* Corners Dot */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold block">DOT_TYPE:</label>
              <select 
                value={options.cornersDotOptions?.type} 
                onChange={(e) => updateCornersDot({ type: e.target.value })}
                className="w-full bg-white retro-inset p-1 text-xs font-mono h-8"
              >
                <option value="square">SQUARE</option>
                <option value="dot">DOT</option>
              </select>
              <div className="flex gap-1">
                <input 
                  type="color" 
                  value={options.cornersDotOptions?.color} 
                  onChange={(e) => updateCornersDot({ color: e.target.value })}
                  className="w-6 h-6 cursor-pointer retro-bevel p-0"
                />
                <input 
                  value={options.cornersDotOptions?.color} 
                  onChange={(e) => updateCornersDot({ color: e.target.value })}
                  className="flex-1 bg-white retro-inset p-1 text-[9px] font-mono h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOGO MANAGER */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header">LOGO_MANAGER.SYS</div>
        <div className="p-4 bg-background retro-inset space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold block">IMAGE_SOURCE:</label>
            <input 
              value={options.image} 
              onChange={(e) => setOptions({ image: e.target.value })}
              className="w-full retro-inset p-1 text-xs font-mono h-8"
              placeholder="http://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">SCALE: {options.imageOptions?.imageSize}</label>
              <input 
                type="range"
                min="0.1" 
                max="1" 
                step="0.05"
                value={options.imageOptions?.imageSize || 0.4}
                onChange={(e) => setOptions({ imageOptions: { ...options.imageOptions, imageSize: Number(e.target.value) } })}
                className="w-full h-4"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">MARGIN: {options.imageOptions?.margin}</label>
              <input 
                type="range"
                min="0" 
                max="50" 
                step="1"
                value={options.imageOptions?.margin || 0}
                onChange={(e) => setOptions({ imageOptions: { ...options.imageOptions, margin: Number(e.target.value) } })}
                className="w-full h-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FRAME MANAGER */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header">FRAME_MANAGER.EXE</div>
        <div className="p-4 bg-background retro-inset space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold block">FRAME_TYPE:</label>
            <select 
              value={frame.type} 
              onChange={(e) => setFrame({ type: e.target.value as any })}
              className="w-full retro-inset p-1 text-xs font-mono h-8"
            >
              <option value="none">NONE</option>
              <option value="color">RGB_COLOR</option>
              <option value="winxp">WINDOWS_XP</option>
              <option value="tv">OLD_TELEVISION</option>
              <option value="monitor">OLD_MONITOR</option>
            </select>
          </div>
          {frame.type === "color" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold block">FRAME_COLOR:</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={frame.color} 
                  onChange={(e) => setFrame({ color: e.target.value })}
                  className="w-8 h-8 cursor-pointer retro-bevel p-0"
                />
                <input 
                  value={frame.color} 
                  onChange={(e) => setFrame({ color: e.target.value })}
                  className="flex-1 bg-white retro-inset p-1 text-xs font-mono h-8"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR CONFIG */}
      <div className="retro-bevel bg-secondary p-1">
        <div className="retro-header">QR_CONFIG.CFG</div>
        <div className="p-4 bg-background retro-inset space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">ERROR_CORRECTION:</label>
              <select 
                value={options.qrOptions?.errorCorrectionLevel} 
                onChange={(e) => setOptions({ qrOptions: { ...options.qrOptions, errorCorrectionLevel: e.target.value as any } })}
                className="w-full retro-inset p-1 text-xs font-mono h-8"
              >
                <option value="L">L (LOW)</option>
                <option value="M">M (MEDIUM)</option>
                <option value="Q">Q (QUARTILE)</option>
                <option value="H">H (HIGH)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold block">TYPE_NUMBER:</label>
              <input 
                type="number" 
                value={options.qrOptions?.typeNumber} 
                onChange={(e) => setOptions({ qrOptions: { ...options.qrOptions, typeNumber: Number(e.target.value) as any } })}
                className="w-full bg-white retro-inset p-1 text-xs font-mono h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
