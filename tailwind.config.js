/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        signal: {
          high: '#10b981', // Neon green
          low: '#475569',  // Dark slate
          x: '#ef4444',    // Error red
          z: '#f59e0b',    // Floating yellow
        }
      }
    },
  },
  plugins: [],
}
