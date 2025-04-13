/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        animation: {
          'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce': 'bounce 1s infinite',
          'spin-slow': 'spin 3s linear infinite',
          'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
          'expandWidth': 'expandWidth 0.3s ease-in-out forwards',
          'fadeIn': 'fadeIn 0.3s ease-in-out',
          'slideDown': 'slideDown 0.3s ease-in-out',
          'blob': 'blob 7s infinite',
        },
        keyframes: {
          pulse: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
          },
          bounce: {
            '0%, 100%': {
              transform: 'translateY(0)',
              animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            },
            '50%': {
              transform: 'translateY(-25%)',
              animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            },
          },
          spin: {
            'to': { transform: 'rotate(360deg)' },
          },
          heartbeat: {
            '0%': { transform: 'scale(1)' },
            '14%': { transform: 'scale(1.3)' },
            '28%': { transform: 'scale(1)' },
            '42%': { transform: 'scale(1.3)' },
            '70%': { transform: 'scale(1)' },
          },
          expandWidth: {
            '0%': { width: '0%' },
            '100%': { width: '100%' },
          },
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          slideDown: {
            '0%': { transform: 'translateY(-10px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
          blob: {
            '0%': {
              transform: 'translate(0px, 0px) scale(1)',
            },
            '33%': {
              transform: 'translate(30px, -50px) scale(1.1)',
            },
            '66%': {
              transform: 'translate(-20px, 20px) scale(0.9)',
            },
            '100%': {
              transform: 'translate(0px, 0px) scale(1)',
            },
          },
        },
      },
    },
    plugins: [],
  }