import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        dark: {
          50: '#f4f6fb',
          100: '#e6e9f2',
          200: '#c9cfdf',
          300: '#aab2c8',
          400: '#8b93a7',
          500: '#6d7687',
          600: '#545c6c',
          700: '#3e4451',
          800: '#171b28',
          850: '#131722',
          900: '#0e1119',
          925: '#0b0e15',
          950: '#080a12',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand-rgb, 0 229 255) / <alpha-value>)',
          50: 'rgb(var(--brand-50-rgb, 224 255 255) / <alpha-value>)',
          100: 'rgb(var(--brand-100-rgb, 178 250 255) / <alpha-value>)',
          200: 'rgb(var(--brand-200-rgb, 128 244 255) / <alpha-value>)',
          300: 'rgb(var(--brand-300-rgb, 64 236 255) / <alpha-value>)',
          400: 'rgb(var(--brand-400-rgb, 0 229 255) / <alpha-value>)',
          500: 'rgb(var(--brand-500-rgb, 0 216 242) / <alpha-value>)',
          600: 'rgb(var(--brand-600-rgb, 0 176 199) / <alpha-value>)',
          700: 'rgb(var(--brand-700-rgb, 0 134 154) / <alpha-value>)',
          800: 'rgb(var(--brand-800-rgb, 4 96 112) / <alpha-value>)',
          900: 'rgb(var(--brand-900-rgb, 3 62 74) / <alpha-value>)',
          light: 'rgb(var(--brand-light-rgb, 128 244 255) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark-rgb, 0 176 199) / <alpha-value>)',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 0 1px rgb(var(--brand-400-rgb) / 0.25), 0 0 24px -6px rgb(var(--brand-400-rgb) / 0.55)',
        'glow-purple': '0 0 0 1px rgba(139, 92, 246, 0.3), 0 0 24px -6px rgba(139, 92, 246, 0.6)',
        'card': '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)',
        'card-hover': '0 2px 8px rgba(0,0,0,0.4), 0 16px 48px -12px rgba(0,216,242,0.15)',
      },
      animation: {
        'pulse-glow': 'pulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
        'ping-slow': 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;