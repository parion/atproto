const { copy } = require('esbuild-plugin-copy')

require('esbuild')
  .build({
    logLevel: 'info',
    entryPoints: ['src/index.ts', 'src/bin.ts', 'src/db/index.ts'],
    bundle: true,
    outdir: 'dist',
    platform: 'node',
    external: [
      // @TODO May be able to get rid of the mapbox externals
      '../plc/node_modules/@mapbox/node-pre-gyp/*',
      '../../node_modules/level/*',
      '../../node_modules/classic-level/*',
    ],
    plugins: [
      copy({
        assets: {
          from: ['./src/mailer/templates/**/*'],
          to: ['./templates'],
          keepStructure: true,
        },
      }),
    ],
  })
  .catch(() => process.exit(1))
