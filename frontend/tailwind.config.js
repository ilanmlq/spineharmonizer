/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryText: "#ECEFF2",
        secondaryText: "#C3C9D0",
        purpleColor: "#A98CF0",
        bgColor: "#0D0F13",
        surface: "#15181E",
        bgGreen: "#68D391",
        bgYellow: "#F6AD55",
        redText: "#ff3d3d",
        greenText: "#22c55e",
      },
    },
  },
  plugins: [],
};
