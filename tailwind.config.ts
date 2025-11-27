import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#141414',
          light: '#1F1F1F',
          card: '#262626',
          hover: '#333333',
        },
        primary: {
          DEFAULT: '#E50914',
          hover: '#F40612',
          dark: '#B81D24',
        },
        secondary: {
          DEFAULT: '#46D369',
          hover: '#5AE07D',
        },
        accent: {
          DEFAULT: '#E50914',
          hover: '#F40612',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#B3B3B3',
          muted: '#808080',
          accent: '#E50914',
        },
        border: {
          DEFAULT: '#404040',
          light: '#595959',
        },
        success: '#46D369',
        warning: '#F59E0B',
        danger: '#E50914',
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'Segoe UI', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(255, 46, 46, 0.5)' },
          'to': { boxShadow: '0 0 30px rgba(255, 46, 46, 0.8), 0 0 40px rgba(255, 46, 46, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '100% center' },
          '100%': { backgroundPosition: '0% center' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 46, 46, 0.5)',
        'glow-lg': '0 0 30px rgba(255, 46, 46, 0.8)',
        'inner-glow': 'inset 0 0 20px rgba(255, 46, 46, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
export default config;
