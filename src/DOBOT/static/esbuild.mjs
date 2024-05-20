import * as esbuild from 'esbuild'

try {
  await esbuild.build({
    entryPoints: [
      './js/entrypoints/home.js',
      './js/entrypoints/about.js',
      './js/entrypoints/task.js',
      './js/entrypoints/settings.js' 
  ],
    bundle: true,
    minify: true,
    // minify: false, // For debugging 
    entryNames: '[dir]/[name].min',
    outdir: './dist/',
    target: 'esnext',
  })

  console.log('Build successfully ᕦ(ò_óˇ)ᕤ')

} catch(err) {}