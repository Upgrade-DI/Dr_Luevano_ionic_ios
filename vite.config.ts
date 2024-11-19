import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: 'src', // Esto asegura que los archivos generados estén en www
    emptyOutDir: false // Para evitar que Vite elimine accidentalmente la carpeta www
  }
});
