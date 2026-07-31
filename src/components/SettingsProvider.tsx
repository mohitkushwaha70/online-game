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

function lightenHex(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const r = Math.min(255, parseInt(h.slice(0,2), 16) + amt);
  const g = Math.min(255, parseInt(h.slice(2,4), 16) + amt);
  const b = Math.min(255, parseInt(h.slice(4,6), 16) + amt);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function darken(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const r = Math.max(0, parseInt(h.slice(0,2), 16) - amt);
  const g = Math.max(0, parseInt(h.slice(2,4), 16) - amt);
  const b = Math.max(0, parseInt(h.slice(4,6), 16) - amt);
  return `${r} ${g} ${b}`;
}

function faviconSvg(color: string): string {
  const c1 = color.replace('#', '');
  const r = Math.min(255, parseInt(c1.slice(0,2), 16) + 60);
  const g = Math.min(255, parseInt(c1.slice(2,4), 16) + 60);
  const b = Math.min(255, parseInt(c1.slice(4,6), 16) + 60);
  const c2 = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  const c1enc = `#${c1}`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${c1enc}'/><stop offset='100%' stop-color='${c2}'/></linearGradient></defs><rect width='24' height='24' rx='5' fill='url(#g)'/><path fill='white' d='M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.34 1.68-.92L8 15h8l1.38 3.08c.36.58 1 .92 1.68.92 1.55 0 2.74-1.37 2.52-2.91zM9 10H7V8h2v2zm5 0h-2V8h2v2z'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function applyCSS(s: SiteSettings) {
  if (s.siteName) document.title = s.siteName;
  if (s.accentColor) {
    const root = document.documentElement;
    const rgb = hexToRgb(s.accentColor);
    root.style.setProperty('--accent-color', s.accentColor);
    root.style.setProperty('--accent-from', s.accentColor);
    root.style.setProperty('--accent-to', lightenHex(s.accentColor, 60));
    root.style.setProperty('--brand-rgb', rgb);
    root.style.setProperty('--brand-500-rgb', rgb);
    root.style.setProperty('--brand-400-rgb', lighten(s.accentColor, 30));
    root.style.setProperty('--brand-light-rgb', lighten(s.accentColor, 20));
    root.style.setProperty('--brand-dark-rgb', darken(s.accentColor, 20));
    let link = document.querySelector("link[rel='icon'][type='image/svg+xml']") as HTMLLinkElement | null;
    if (!link) {
      link = document.querySelector("link[rel='icon']") || document.createElement('link');
      (link as HTMLLinkElement).type = 'image/svg+xml';
      (link as HTMLLinkElement).rel = 'icon';
    }
    link.href = faviconSvg(s.accentColor);
    document.head.appendChild(link);
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
