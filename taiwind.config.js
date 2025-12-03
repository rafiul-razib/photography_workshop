/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  // ⭐ FIX: force Tailwind to use rgb() instead of oklch()
  experimental: {
    optimizeUniversalDefaults: true,
  },

  theme: {
    extend: {
      colors: {
        border: "rgb(229, 231, 235)",
        input: "rgb(243, 244, 246)",
        ring: "rgb(59, 130, 246)",
      },
    },
  },

  plugins: [],
};
