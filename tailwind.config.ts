import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        note: "0 16px 40px rgba(94, 88, 120, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
