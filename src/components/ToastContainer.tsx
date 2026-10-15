import React, { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, Copy, Sparkles, X } from 'lucide-react';
import { fireToastConfetti } from '../utils/confetti';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  referenceId?: string;
  meta?: string;
  durationMs?: number;
  triggerConfetti?: boolean;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss
}) => {
  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notification alerts"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] flex flex-col gap-3 w-[calc(100vw-2rem)] max-w-md pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </aside>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const duration = toast.durationMs ?? 9500;
  const [remainingMs, setRemainingMs] = useState(duration);

  // Trigger subtle confetti burst emanated from the toast entrance
  useEffect(() => {
    if (toast.triggerConfetti !== false) {
      const timer = window.setTimeout(() => {
        if (itemRef.current) {
          const rect = itemRef.current.getBoundingClientRect();
          const originX = (rect.left + rect.width * 0.8) / window.innerWidth;
          const originY = (rect.top + rect.height * 0.3) / window.innerHeight;
          fireToastConfetti(
            Math.min(Math.max(originX, 0.1), 0.95),
            Math.min(Math.max(originY, 0.1), 0.95)
          );
        } else {
          fireToastConfetti(0.85, 0.88);
        }
      }, 70); // Brief delay to let the toast slide in first

      return () => window.clearTimeout(timer);
    }
  }, [toast.id, toast.triggerConfetti]);

  // Handle countdown with pause-on-hover support
  useEffect(() => {
    if (isHovered) return;
    const interval = 50;
    const timer = window.setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= interval) {
          window.clearInterval(timer);
          onDismiss(toast.id);
          return 0;
        }
        return prev - interval;
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [toast.id, isHovered, onDismiss]);

  const handleCopyReference = async () => {
    if (!toast.referenceId) return;
    try {
      await navigator.clipboard.writeText(toast.referenceId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const progressPercent = Math.max(0, Math.min(100, (remainingMs / duration) * 100));

  return (
    <div
      ref={itemRef}
      role="status"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pointer-events-auto relative overflow-hidden bg-[#111110] text-[#F7F6F2] border border-[#2E2D2A] shadow-2xl p-4 sm:p-5 animate-toast-entrance transition-all duration-200"
    >
      {/* Light sheen shimmer sweep on entrance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-toast-shimmer"
      />

      <div className="relative z-10 flex items-start justify-between gap-3.5">
        <div className="flex items-start gap-3 min-w-0">
          {/* Pulsing Success Icon with Ring Effect */}
          <div className="relative shrink-0 mt-0.5">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[#1D4ED8] rounded-full animate-toast-ring pointer-events-none"
            />
            <div className="relative w-8 h-8 bg-[#1D4ED8] text-white flex items-center justify-center animate-toast-icon shadow-md">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A39E93]">
              <span className="flex items-center gap-1 text-[#93C5FD]">
                <Sparkles className="w-3 h-3 text-[#60A5FA]" />
                <span>SUBMISSION RECORDED</span>
              </span>
              {toast.meta && (
                <>
                  <span aria-hidden="true" className="text-[#57554F]">·</span>
                  <span className="truncate text-[#C8C3B8]">{toast.meta}</span>
                </>
              )}
            </div>

            <p className="font-display text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
              {toast.title}
            </p>

            <p className="text-xs text-[#C8C3B8] leading-relaxed">
              {toast.description}
            </p>

            {toast.referenceId && (
              <div className="pt-2 flex items-center gap-3">
                <span className="font-mono text-xs text-white tabular-nums tracking-wide">
                  ID: <span className="text-[#93C5FD] font-semibold">{toast.referenceId}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 bg-[#1C1B19] border border-[#2E2D2A] text-[#93C5FD] hover:text-white hover:border-[#4B5563] transition-colors whitespace-nowrap"
                  title="Copy Reference ID to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="relative z-10 w-7 h-7 flex items-center justify-center text-[#A39E93] hover:text-white hover:bg-[#272624] transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Countdown progress bar line at bottom */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E2D2A] overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-[#1D4ED8] via-[#60A5FA] to-[#93C5FD] transition-all ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
