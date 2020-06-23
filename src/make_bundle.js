import { rollup } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json';
import builtins from 'builtin-modules'
import { js_from_gfm } from './js_from_gfm.js'
import { transform_comment_assertions } from './transform_comment_assertions.js'
import replace_extension from 'replace-ext'
import path from 'path'

export const make_bundle = async (gfm, { file }) => {
	const gfmjs = await transform_comment_assertions(js_from_gfm(gfm, { file }))
		.catch(error => {
			throw Object.assign(error, { message: `${file} (${error.origin.line}:${error.origin.column})\n${error.message}` })
		})
	const bundle = await rollup({
		input: file,
		plugins: [
			{
				resolveId: id => id === file ? id : null,
				load: async (id) => id === file ? gfmjs : null
			},
			nodeResolve({ rootDir: path.dirname(file), extensions: [ '.md', '.mjs', '.js' ] }),
			commonjs({ extensions: [ '.md', '.js', '.cjs' ] }),
			json()
		],
		external: builtins,
		inlineDynamicImports: true,
		treeshake: false
	})

	const { output } = await bundle.generate({
		sourcemap: true,
		format: 'cjs'
	})
	const { code, map } = output[0]
	const inlined = code + '\n//# sourceMappingURL=' + map.toUrl()
	return { code, map, inlined }
}
