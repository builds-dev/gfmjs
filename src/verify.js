import { js_from_gfm } from './js_from_gfm.js'
import { transform_comment_assertions } from './transform_comment_assertions.js'
import { run_js } from './run_js.js'

const get_test_script_from_gfm = (gfm, { file }) =>
	transform_comment_assertions(js_from_gfm(gfm, { file }))
		.catch(error => {
			throw Object.assign(error, { message: `${file} (${error.origin.line}:${error.origin.column})\n${error.message}` })
		})

export const verify = async (gfm, { file } = {}) => {
	const gfmjs = await get_test_script_from_gfm(gfm, { file })
	const { code, map } = gfmjs

	// For debugging source maps
	// console.log(`https://sokra.github.io/source-map-visualization/#base64,${btoa(code.replace(/\/\/# sourceMap.+/, ``))},${btoa(JSON.stringify(map))},${btoa(gfm)}`)

	const process = await run_js(code, { file })
	return {
		code,
		failed: process.code > 0,
		output: [ process.stdout, process.stderr ].filter(v => v.length).join('\n')
	}
}
