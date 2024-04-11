import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        libre: ["Libre Franklin", "sans-serif"],
        playfair: ["Playfair Display", "sans-serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        miriam: ["Miriam Libre", "sans-serif"],
        poly: ["Poly", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: [
      {
        plant: {
          primary: "#4B5B33",
          "primary-focus": "#00CA65",
          neutral: "#FFFFFF",
          accent: "#6166DC",
          "base-100": "#F4F4F4",
        },
      },
    ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
} satisfies Config;
