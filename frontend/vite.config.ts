import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // esbuild: {
  //   logOverride: {
  //     'this-is-undefined-in-esm': 'silent',
  //   },
  // },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/Components'),
      '@context': path.resolve(__dirname, 'src/Context'),
      '@pages': path.resolve(__dirname, 'src/Pages'),
      '@helpers': path.resolve(__dirname, 'src/Helpers'),
      '@validation': path.resolve(__dirname, 'src/Validation'),
      '@services': path.resolve(__dirname, 'src/Services'),
      '@data': path.resolve(__dirname, 'src/Data'),
      '@routes': path.resolve(__dirname, 'src/Routes'),
      '@models': path.resolve(__dirname, 'src/Models'),
      '@config': path.resolve(__dirname, 'src/Config'),
    }
  }
})
