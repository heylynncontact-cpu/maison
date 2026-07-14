import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/maison/', // nom du dépôt GitHub Pages — https://heylynncontact-cpu.github.io/maison/
})
