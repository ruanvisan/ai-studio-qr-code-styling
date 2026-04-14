import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function RetroModal({ isOpen, onClose, title, children }: RetroModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md retro-bevel bg-secondary p-1"
          >
            <div className="retro-header flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase">{title}</span>
              <button 
                onClick={onClose}
                className="w-4 h-4 bg-secondary retro-bevel text-black text-[10px] flex items-center justify-center hover:bg-red-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-muted p-6 retro-inset">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
