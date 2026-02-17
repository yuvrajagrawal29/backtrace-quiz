/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backtrace dark theme
        dark: {
          bg: '#0a0a0a',
          surface: '#141414',
          border: '#1f1f1f',
          text: '#e0e0e0',
        },
        neon: {
          green: '#00ff41',
          cyan: '#00ffff',
          blue: '#0080ff',
          pink: '#ff00ff',
        },
        // Keep compatibility
        primary: '#00ff41',
        secondary: '#00ffff',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
        code: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 2px)' },
          '66%': { transform: 'translate(2px, -2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
