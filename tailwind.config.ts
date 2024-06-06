import type { Config } from "tailwindcss";

function withOpacity(variableName: string): any {
  return ({ opacityValue }: { opacityValue: any }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fill: {
        skin: {
          primary: withOpacity("--color-fill"),
        },
      },
      ringColor: {
        skin: {
          primary: withOpacity("--color-fill"),
          DEFAULT: withOpacity("--color-border"),
        },
      },
      borderColor: {
        skin: {
          DEFAULT: withOpacity("--color-border"),
          primary: withOpacity("--color-fill"),
          error: withOpacity("--color-error"),
        },
      },
      textColor: {
        skin: {
          error: withOpacity("--color-error"),
          base: withOpacity("--color-text-base"),
          muted: withOpacity("--color-text-muted"),
          inverted: withOpacity("--color-text-inverted"),
        },
      },
      backgroundColor: {
        background: withOpacity("--color-background"),
        border: withOpacity("--color-border"),
        skin: {
          fill: withOpacity("--color-fill"),
          "button-accent": withOpacity("--color-button-accent"),
          "button-accent-hover": withOpacity("--color-button-accent-hover"),
          "button-muted": withOpacity("--color-button-muted"),
          input: withOpacity("--color-input"),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity("--color-fill"),
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
