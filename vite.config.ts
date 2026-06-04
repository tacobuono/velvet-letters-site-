import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Carve the three.js / R3F ecosystem into its own chunk. Because it's only
        // reachable through the lazily-imported HomePage, this chunk is fetched
        // only on the Home route — content routes (About/Process/Styles/Contact)
        // never download three.js.
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (/[\\/](three|@react-three|postprocessing|troika|maath|its-fine|suspend-react|react-reconciler|zustand)[\\/]/.test(id)) {
              return 'three-vendor';
            }
          }
        },
      },
    },
  },
});
