import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "system-ui, sans-serif" },
        body:    { value: "system-ui, sans-serif" },
      },
      colors: {
        brand: {
          50:  { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          500: { value: "#6366f1" },
          700: { value: "#4338ca" },
          900: { value: "#1e1b4b" },
        },
      },
    },
  },
});
