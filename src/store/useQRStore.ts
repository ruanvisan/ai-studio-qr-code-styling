import { create } from "zustand";
import { Options } from "qr-code-styling";
import { QRFormat, QRState } from "@/types/qr";

const defaultOptions: Options = {
  width: 300,
  height: 300,
  data: "https://qr-code-styling.com",
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
  dotsOptions: {
    type: "rounded",
    color: "#6a1b9a",
    gradient: {
      type: "linear",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#6a1b9a" },
        { offset: 1, color: "#9c27b0" },
      ],
    },
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#4a148c",
  },
  cornersDotOptions: {
    type: "dot",
    color: "#4a148c",
  },
};

export const useQRStore = create<QRState>((set) => ({
  options: defaultOptions,
  format: "png",
  frame: {
    type: "none",
    color: "#000000",
  },
  view: "generator",
  theme: "retro",
  setOptions: (newOptions) =>
    set((state) => ({
      options: { ...state.options, ...newOptions },
    })),
  setFormat: (format) => set({ format }),
  setFrame: (newFrame) =>
    set((state) => ({
      frame: { ...state.frame, ...newFrame },
    })),
  setView: (view) => set({ view }),
  setTheme: (theme) => set({ theme }),
  reset: () => set({ 
    options: defaultOptions, 
    format: "png",
    frame: { type: "none", color: "#000000" },
    view: "generator",
    theme: "retro"
  }),
}));
