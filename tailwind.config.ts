import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E8002D',
          'red-dark': '#C70025',
          'red-light': '#FF1A47',
          black: '#0A0A0A',
          white: '#FAFAFA',
        },
        surface: {
          0: '#000000',
          1: '#0A0A0A',
          2: '#111111',
          3: '#1A1A1A',
          4: '#222222',
          card: '#0F0F0F',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        accent: ['Barlow Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
