import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // React Three Fiber's paradigm is imperative mutation of three.js objects
      // inside useFrame/useEffect (camera.position, material props, scene.fog…).
      // The React-Compiler `immutability` rule treats that as a violation, but it
      // is the correct and unavoidable pattern for a WebGL render loop, so it is
      // disabled for this project. (`purity` stays on — we satisfy it via seeded
      // RNG instead of Math.random in render.)
      'react-hooks/immutability': 'off',
    },
  },
])
