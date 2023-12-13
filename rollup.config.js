import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import image from '@rollup/plugin-image';
import html from 'rollup-plugin-html';

const name = require('./package.json').main.replace(/\.js$/, '')

const bundle = config => ({
    ...config,
    input: 'src/index.ts',
    external: id => !/^[./]/.test(id),
})

/** @type {import('rollup').RollupOptions} */
const configs = [
    bundle({
        plugins: [
            esbuild(),
            image(),
            html()
        ],
        output: [
            {
                file: `${name}.js`,
                format: 'cjs',
                sourcemap: true,
                extensions: [".js", ".html"],
            },
            {
                file: `${name}.mjs`,
                format: 'es',
                sourcemap: true,
                extensions: [".js", ".html"],
            },
        ],
    }),
    bundle({
        plugins: [
            dts(),
        ],
        output: {
            file: `${name}.d.ts`,
            format: 'es',
        },
    }),
]

export default configs;