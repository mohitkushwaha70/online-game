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
          50: '#f0f2f5',
          100: '#e1e5eb',
          200: '#c3cbd7',
          300: '#a5b1c3',
          400: '#8797af',
          500: '#697d9b',
          600: '#54647c',
          700: '#3f4b5d',
          800: '#2a323e',
          850: '#222831',
          900: '#1a1f2a',
          925: '#161b24',
          950: '#0f1019',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand-rgb, 124 58 237) / <alpha-value>)',
          50: 'rgb(var(--brand-50-rgb, 243 232 255) / <alpha-value>)',
          100: 'rgb(var(--brand-100-rgb, 233 213 255) / <alpha-value>)',
          200: 'rgb(var(--brand-200-rgb, 216 180 254) / <alpha-value>)',
          300: 'rgb(var(--brand-300-rgb, 192 132 252) / <alpha-value>)',
          400: 'rgb(var(--brand-400-rgb, 168 85 247) / <alpha-value>)',
          500: 'rgb(var(--brand-500-rgb, 124 58 237) / <alpha-value>)',
          600: 'rgb(var(--brand-600-rgb, 109 40 217) / <alpha-value>)',
          700: 'rgb(var(--brand-700-rgb, 91 33 182) / <alpha-value>)',
          800: 'rgb(var(--brand-800-rgb, 76 29 149) / <alpha-value>)',
          900: 'rgb(var(--brand-900-rgb, 59 7 100) / <alpha-value>)',
          light: 'rgb(var(--brand-light-rgb, 139 92 246) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark-rgb, 109 40 217) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
