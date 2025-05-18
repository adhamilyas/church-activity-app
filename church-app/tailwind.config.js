/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#900C27',
          light: '#B01030',
          dark: '#700920',
        },
        secondary: {
          DEFAULT: '#F6C667',
          light: '#F8D288',
          dark: '#E5B656',
        },
        background: '#F1F8FD',
      }
    },
  },
  plugins: [],
}

