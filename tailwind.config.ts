import { Config } from "tailwindcss"
import { black, current, inherit, red, slate, transparent, white } from "tailwindcss/colors"

const config: Config = {
  darkMode: "class",
  content: ["./sample/*.html", "./src/**/*.{js,ts}", "../cetus/src/main/resources/templates/**/*.html"],
  theme: {
    extend: {
      boxShadow: {
        "tw": "0 4px 24px 0 rgba(34,41,47,.1)"
      },
      backgroundImage: {
        "check": "url('/public/check.svg')",
        "close": "url('/public/close.svg')",
        "desc": "url('/public/description.svg')",
      }
    },
    colors: {
      inherit,
      current,
      transparent,
      black,
      white,
      slate,
      red,
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}

export default config
