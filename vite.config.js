import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // make esbuild parse .js files as JSX during dependency scanning
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  }
});
