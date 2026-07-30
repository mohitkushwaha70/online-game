'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SiteSettings {
  siteName: string;
  siteUrl: string;
  accentColor: string;
  analyticsId: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'ONLINE GAME',
  siteUrl: '',
  accentColor: '#6842FF',
  analyticsId: '',
};

const SettingsContext = createContext<SiteSettings>(defaultSettings);

export function useSettings() {
  return useContext(SettingsContext);
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2), 16)} ${parseInt(h.slice(2,4), 16)} ${parseInt(h.slice(4,6), 16)}`;
}

function lighten(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const r = Math.min(255, parseInt(h.slice(0,2), 16) + amt);
  const g = Math.min(255, parseInt(h.slice(2,4), 16) + amt);
  const b = Math.min(255, parseInt(h.slice(4,6), 16) + amt);
  return `${r} ${g} ${b}`;
}

function darken(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const r = Math.max(0, parseInt(h.slice(0,2), 16) - amt);
  const g = Math.max(0, parseInt(h.slice(2,4), 16) - amt);
  const b = Math.max(0, parseInt(h.slice(4,6), 16) - amt);
  return `${r} ${g} ${b}`;
}

function applyCSS(s: SiteSettings) {
  if (s.siteName) document.title = s.siteName + ' - Free Browser Games';
  if (s.accentColor) {
    const root = document.documentElement;
    const rgb = hexToRgb(s.accentColor);
    root.style.setProperty('--accent-color', s.accentColor);
    root.style.setProperty('--accent-from', s.accentColor);
    root.style.setProperty('--brand-rgb', rgb);
    root.style.setProperty('--brand-500-rgb', rgb);
    root.style.setProperty('--brand-400-rgb', lighten(s.accentColor, 30));
    root.style.setProperty('--brand-light-rgb', lighten(s.accentColor, 20));
    root.style.setProperty('--brand-dark-rgb', darken(s.accentColor, 20));
  }
}

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const cached = localStorage.getItem('site-settings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const s = { ...defaultSettings, ...parsed };
        setSettings(s);
        applyCSS(s);
      } catch {}
    }
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (!data.settings) return;
      const s = { ...defaultSettings, ...data.settings };
      setSettings(s);
      applyCSS(s);
      localStorage.setItem('site-settings', JSON.stringify(s));
    }).catch(() => {});
    const handler = (e: CustomEvent) => {
      const s = { ...defaultSettings, ...e.detail };
      setSettings(s);
      applyCSS(s);
      localStorage.setItem('site-settings', JSON.stringify(s));
    };
    window.addEventListener('settings-updated', handler as EventListener);
    return () => window.removeEventListener('settings-updated', handler as EventListener);
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
