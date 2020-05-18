import { js_from_gfm } from './js_from_gfm.js'
import { transform_comment_assertions } from './transform_comment_assertions.js'
import { run_js } from './run_js.js'
import { make_bundle } from './make_bundle.js'

export const verify = async (gfm, { file } = {}) => {
	const bundle = await make_bundle(gfm, { file })
	const code = bundle.inlined
	const result = await run_js(code, { file })
	return {
		code,
		failed: result.code > 0,
		output: [ result.stdout, result.stderr ].filter(v => v.length).join('\n')
	}
}
