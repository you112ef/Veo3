/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#9333ea', // A richer purple
        'brand-blue': '#3b82f6',   // A vibrant blue
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        textFocusIn: {
          '0%': { filter: 'blur(12px)', opacity: '0' },
          '100%': { filter: 'blur(0px)', opacity: '1' },
        },
        pulse: {
          '50%': {
            opacity: '.85'
          }
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        backgroundPan: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'text-focus-in': 'textFocusIn 0.8s cubic-bezier(0.550, 0.085, 0.680, 0.530) both',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'background-pan': 'backgroundPan 15s linear infinite',
      },
    },
  },
  plugins: [],
}