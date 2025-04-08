/** @type {import('tailwindcss').Config} */
darkMode: 'class', // Adicione essa linha
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',   // Cor personalizada
        secundary: '#0a0a0a',
        footerbg: '#171717',  // Cor personalizada
        cinzaModal: '#2D2D2D'
      },

    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'arcade': ['Arcade Ya', 'sans-serif'],
    },
  },
  plugins: [
    require('flowbite/plugin')  // Adicione o plugin do Flowbite
  ],
}
}