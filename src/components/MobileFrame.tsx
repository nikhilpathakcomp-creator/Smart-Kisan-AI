import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isMobileView: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ isMobileView, children }) => {
  if (!isMobileView) {
    return <div className="max-w-6xl mx-auto px-4 py-4">{children}</div>;
  }

  return (
    <div className="py-6 px-2 flex justify-center items-center min-h-[calc(100vh-60px)]">
      {/* Smartphone Outer Shell */}
      <div className="w-full max-w-[430px] bg-[#1a3c34] p-3 rounded-[40px] shadow-2xl border-4 border-emerald-950/80 ring-1 ring-emerald-500/30">
        {/* Smartphone Screen Container */}
        <div className="bg-[#f4f7f2] text-slate-900 rounded-[32px] overflow-hidden min-h-[720px] flex flex-col relative shadow-inner border border-emerald-900/10">
          {/* Status Bar */}
          <div className="bg-[#1a3c34] text-white text-[11px] px-5 py-1.5 flex justify-between items-center select-none z-30 border-b border-emerald-900/40">
            <span className="font-bold tracking-tight">09:41</span>
            {/* Camera Notch */}
            <div className="w-20 h-3.5 bg-black/60 rounded-full mx-auto"></div>
            <div className="flex items-center gap-1.5 opacity-90">
              <Signal className="w-3 h-3 text-emerald-400" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Mobile Screen Body */}
          <div className="flex-1 overflow-y-auto p-3">{children}</div>
        </div>
      </div>
    </div>
  );
};
