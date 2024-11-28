/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  corePlugins: {
    preflight: false // 禁止tailwindcss的默认属性
  },
  plugins: []
}
