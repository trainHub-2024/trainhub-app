/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins-Regular"],
        poppinsBold: ["Poppins-Bold"],
        poppinsMedium: ["Poppins-Medium"],
        poppinsSemiBold: ["Poppins-SemiBold"],
      },
      colors: {
        primary: "#f97316",
        "primary-light": "#fdba74",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        secondary: "#eae2b7",
        accent: "#f55536",
      },
    },
  },
  plugins: [],
};
