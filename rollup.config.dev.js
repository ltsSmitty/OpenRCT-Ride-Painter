import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/registerPlugin.ts',
  output: {
    file: '/Users/andrewpenman/Library/Application Support/OpenRCT2/plugin/Theme_Manager.js',
    format: 'iife',
  },
  plugins: [
    typescript(),
    terser({
      format: {
        quote_style: 1,
        wrap_iife: true,
      },
    }),
  ],
};
