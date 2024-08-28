/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // corePlugins: {
  //   preflight: false,
  // },
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1020px',
      xl: '1440px',
    },
    extend: {
      boxShadow: {
        // signUp: '0px 5px 10px rgba(4, 10, 34, 0.2)',
        // one: '0px 2px 3px rgba(7, 7, 77, 0.05)',
        // sticky: 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
