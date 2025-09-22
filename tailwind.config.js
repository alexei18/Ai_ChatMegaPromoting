const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0D0D0D',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      screens: {
        'xs': '475px', // Extra small breakpoint for better mobile support
        '3xl': '1920px', // Custom breakpoint for very large screens
      },
      animation: {
        'scroll': 'scroll 40s linear infinite',
        'count-up': 'count-up 2s ease-out',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
