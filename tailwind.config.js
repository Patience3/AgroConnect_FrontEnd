/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        primary: {
          dark: '#0B0C10',
          darker: '#000000',
          light: '#1F2833',
        },
        // Cyan accent colors
        accent: {
          cyan: '#66FCF1',
          teal: '#45A29E',
          dark: '#2E7D7A',
        },
        // Neutral colors
        neutral: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#C0C0C0',
          400: '#A0A0A0',
          500: '#808080',
          600: '#606060',
          700: '#404040',
          800: '#2A2A2A',
          900: '#1A1A1A',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'kente-pattern': "url('/patterns/kente.svg')",
        'gradient-dark': 'linear-gradient(135deg, #0B0C10 0%, #1F2833 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #45A29E 0%, #66FCF1 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(102, 252, 241, 0.3)',
        'glow-teal': '0 0 20px rgba(69, 162, 158, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(102, 252, 241, 0.2), 0 4px 6px -2px rgba(102, 252, 241, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(102, 252, 241, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(102, 252, 241, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}