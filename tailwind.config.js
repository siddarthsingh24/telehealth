/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'slide': 'slide 2s ease infinite'
      },
      fontFamily:{
        'nun':['Nunito','sans'],
        'poppins':['Poppins','sans']
      }
    },
  },
  plugins: [],
}