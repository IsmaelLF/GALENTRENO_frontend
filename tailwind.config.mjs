/** @type {import('tailwindcss').Config} */
export default {
  // A CLAVE ESTÁ AQUÍ: Asegúrate de que inclúe 'vue' e 'astro'
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // O plugin para as animacións chulas
  ],
};
