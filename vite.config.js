import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  // Keep every asset as its own file rather than inlining small ones as
  // base64 — inlined data URIs get duplicated into the JS bundle (no
  // browser caching) and, worse, bloat every parallel chunk that imports
  // them since Rollup can't dedupe a data: string across chunks.
  build: {
    assetsInlineLimit: 0,
  },
})
