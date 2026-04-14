import { Options } from "qr-code-styling";

export type QRFormat = "png" | "jpeg" | "svg";
export type QRFrameType = "none" | "color" | "winxp" | "tv" | "monitor";

export interface QRFrameOptions {
  type: QRFrameType;
  color?: string;
}

export type QRView = "generator" | "archive" | "preferences";
export type AppTheme = "retro" | "hacker";

export interface QRState {
  options: Options;
  format: QRFormat;
  frame: QRFrameOptions;
  view: QRView;
  theme: AppTheme;
  setOptions: (options: Partial<Options>) => void;
  setFormat: (format: QRFormat) => void;
  setFrame: (frame: Partial<QRFrameOptions>) => void;
  setView: (view: QRView) => void;
  setTheme: (theme: AppTheme) => void;
  reset: () => void;
}
