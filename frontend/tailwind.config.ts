import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ring-color': '#0c4a6e'
      },
      backgroundColor: {
        'hover-color': '#0c4a6e'
      },
      backgroundImage: {
      },
    },
  },
  plugins: [],
}
export default config
