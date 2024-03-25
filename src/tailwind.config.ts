import { Config } from "tailwindcss";

const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(({ addVariant, e }: any) => {
      // Add a custom variant, "sidebar-expanded"
      addVariant("sidebar-expanded", ({ modifySelectors, separator }: any) => {
        modifySelectors(
            ({ className }: any) =>
                // Modify selectors to apply the custom variant
                `.sidebar-expanded .${e(
                    `sidebar-expanded${separator}${className}`
                )}`
        );
      });
    }),
  ],
};
export default config;
