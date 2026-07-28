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
          DEFAULT: '#7c3aed',
          light: '#8B5CF6',
          dark: '#6d28d9',
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
