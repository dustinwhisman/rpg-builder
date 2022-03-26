require('dotenv').config();
const fs = require('fs');
const { build } = require('esbuild');

const isProduction = process.env.NODE_ENV === 'production';
const files = fs.readdirSync('src/assets/js').filter((file) => file.endsWith('.js'));

if (files.length) {
  build({
    entryPoints: files.map((file) => `src/assets/js/${file}`),
    outdir: 'dist/assets/js',
    bundle: true,
    format: 'esm',
    sourcemap: !isProduction && 'inline',
    minify: isProduction,
    watch: !isProduction,
    logLevel: 'debug',
    define: {
      'process.env.FIREBASE_API_KEY': `'${process.env.FIREBASE_API_KEY}'`,
      'process.env.FIREBASE_PROJECT_ID': `'${process.env.FIREBASE_PROJECT_ID}'`,
      'process.env.FIREBASE_MESSAGING_SENDER_ID': `'${process.env.FIREBASE_MESSAGING_SENDER_ID}'`,
      'process.env.FIREBASE_APP_ID': `'${process.env.FIREBASE_APP_ID}'`,
    },
  });
}
