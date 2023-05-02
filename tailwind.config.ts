import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Nota: ["Noto Sans Mono", "monospace"],
       },
    },
  },
  plugins: [

  ],
} satisfies Config;
