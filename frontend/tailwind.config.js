/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require("daisyui")], // ✅ THIS ONLY
  daisyui: {
    themes: ["light", "dark"],  // OR custom theme list
    darkTheme: "dark",          // optional
  },
  theme: {
  extend: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
  },
},

};
