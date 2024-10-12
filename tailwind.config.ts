import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        light: '#E4E4E4',
        dark: '#181818',
        card: '#1D1C1E',
        buttonBg: '#2B2B2B',
        accent: '#EA80FC',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}
export default config
