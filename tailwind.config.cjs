/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        canvas: '#111111'
      },
      boxShadow: {
        panel: '0 12px 30px rgba(0, 0, 0, 0.18)'
      },
      screens: {
      '3xl': '1920px',
    },
    }
  },
  plugins: []
};
