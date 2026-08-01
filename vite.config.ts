import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O GitHub Pages de projeto serve em https://<usuario>.github.io/<repo>/
// Os caminhos sao sensiveis a maiusculas, e este repositorio se chama
// "Vizmobel" com V maiusculo. Por isso o nome NAO e escrito a mao aqui:
// o workflow injeta VITE_BASE a partir do nome real do repositorio.
// Em desenvolvimento a variavel nao existe e o base cai para "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    sourcemap: false,
    chunkSizeWarningLimit: 700,
  },
})
