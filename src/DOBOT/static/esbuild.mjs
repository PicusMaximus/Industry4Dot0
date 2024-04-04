import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: [
    './js/entrypoints/home.js',
    './js/entrypoints/about.js',
    './js/entrypoints/task.js'
],
  bundle: true,
  minify: true,
  entryNames: '[dir]/[name].min',
  outdir: './dist/',
  target: 'esnext',
})