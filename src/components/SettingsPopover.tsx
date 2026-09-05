'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '@/lib/sound';
import { isHapticEnabled, setHapticEnabled } from '@/lib/haptics';
import { AnimatePresence, motion } from 'framer-motion';
import { playClickSound } from '@/lib/sound';
import { vibrateShort } from '@/lib/haptics';

export const SettingsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);

  useEffect(() => {
    setSound(isSoundEnabled());
    setHaptics(isHapticEnabled());
  }, []);

  const toggleSound = () => {
    const nextVal = !sound;
    setSound(nextVal);
    setSoundEnabled(nextVal);
    if (nextVal) {
      // Play confirmation click if turned on
      setTimeout(() => playClickSound(), 50);
    }
  };

  const toggleHaptics = () => {
    const nextVal = !haptics;
    setHaptics(nextVal);
    setHapticEnabled(nextVal);
    if (nextVal) {
      setTimeout(() => vibrateShort(), 50);
    }
  };

  return (
    <div className="relative font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-14 right-0 w-64 p-5 border border-white/15 bg-black/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4 text-left z-50"
          >
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400">Ajustes Sensoriais</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">Customize a resposta interativa da interface</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/5">
              {/* Toggle Efeitos Sonoros */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-xs text-neutral-200">
                  {sound ? (
                    <Volume2 className="w-4 h-4 text-gold-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-neutral-500" />
                  )}
                  <span>Efeitos Sonoros</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={sound}
                    onChange={toggleSound}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gold-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:h-4 after:w-4 after:rounded-full after:transition-all after:duration-300 peer-checked:bg-gold-gradient-btn peer-checked:after:bg-white peer-checked:after:border-white" />
                </label>
              </div>

              {/* Toggle Vibração Tátil */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-xs text-neutral-200">
                  <Smartphone className={`w-4 h-4 ${haptics ? 'text-gold-400' : 'text-neutral-500'}`} />
                  <span>Vibração Tátil (Haptics)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={haptics}
                    onChange={toggleHaptics}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gold-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:h-4 after:w-4 after:rounded-full after:transition-all after:duration-300 peer-checked:bg-gold-gradient-btn peer-checked:after:bg-white peer-checked:after:border-white" />
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Right Gear Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playClickSound();
        }}
        className={`btn-lift p-2 sm:p-2.5 rounded-full border bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center transition-all ${
          isOpen
            ? 'border-gold-400 text-white rotate-45'
            : 'border-white/15 text-gold-400 hover:text-white hover:border-white/30'
        }`}
        aria-label="Configurações"
        title="Ajustes Sensoriais"
      >
        <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>
    </div>
  );
};
