import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en https://<usuario>.github.io/FrontPruebas/,
  // así que todos los assets deben resolverse bajo ese subdirectorio.
  base: '/FrontPruebas/',
  plugins: [react(), tailwindcss()],
  resolve: {
    // "tup-arcade-ui" es una dependencia empaquetada (.tgz) que trae su propia
    // copia de react/react-dom en devDependencies. Sin esto, esa copia física
    // distinta convive con la de este proyecto y los hooks se rompen
    // ("Cannot read properties of null (reading 'useState')").
    dedupe: ['react', 'react-dom'],
  },
})

