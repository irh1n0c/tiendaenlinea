// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    base: './', 
    host: '0.0.0.0',// Permitir acceso desde otras IPs
    port: 5173, // Asegúrate de que sea el puerto correcto
    strictPort: true,
    allowedHosts: ['cn-disabilities-brazil-mileage.trycloudflare.com'], // Reemplaza con tu URL
    cors: true
  }
})
