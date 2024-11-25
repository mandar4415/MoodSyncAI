/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // For Vite's root HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Includes all JavaScript and TypeScript files in the src directory
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"], // Add the custom font used in your project
      },
      backgroundImage: {
        gradientBg: "linear-gradient(135deg, #f6f8fe 0%, #e5edff 100%)", // Add the custom gradient background
      },
      colors: {
        indigo: {
          light: "#e5edff", // Custom light indigo color
          DEFAULT: "#4f46e5", // Default indigo shade
        },
        gray: {
          light: "#f6f8fe", // Custom light gray color
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // For better form element styling
  ],
};
