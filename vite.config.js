import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    allowedHosts: ['32e5aa50886b.ngrok-free.app'], // ✅ allow your ngrok URL
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },

  // GIT USAGE (reference):
  // fetch:      git fetch --all
  // new branch: git checkout -b new-branch origin/new-branch
  // switch:     git switch new-branch
  // pull:       git pull
  // push:       git push -u origin new-branch
});
