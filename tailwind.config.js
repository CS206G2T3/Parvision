/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#248A3D',
        'primary-light': '#E5F8E9',
        'dark-label': '#1C1C1E',
        'secondary-label': '#3C3C43',
        'tertiary-label': 'rgba(60, 60, 67, 0.6)',
        'bg-secondary': '#F4F4F4',
        'card-orange': '#F8E0BE',
        'card-green': '#E5F8E9',
        'card-red': '#FFEBE5',
        'card-gray': '#EAEAEA',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 16px 50px 0px rgba(0,0,0,0.04), 0px 2px 15px 0px rgba(0,0,0,0.06), 0px 0px 5px 0px rgba(0,0,0,0.06)',
        'nav': '0px 4px 16px 1px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
