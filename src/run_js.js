import { promisify } from 'node:util'
import { execFile } from 'node:child_process'
const exec_file_async = promisify(execFile)

/*
	TODO: if/when node supports source maps with --eval, remove ./use_temporary_mjs_file and its dependency @m59/disposer.
*/
import { use_temporary_mjs_file } from './use_temporary_mjs_file.js'


export const run_js = (js, { file }) =>
	use_temporary_mjs_file(file, js, file =>
		exec_file_async
			(
				'node',
				[
					'--enable-source-maps',
					// '--eval', js,
					// '--input-type', 'module'
					file
				]
			)
			.catch(error => error)
	)
