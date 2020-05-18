import path from 'path'
import use_tmp_dir from '@m59/use-tmp-dir'
import replace_extension from 'replace-ext'
import child_process from 'promisify-child-process'
import into_stream from 'into-stream'
import builtins from 'builtin-modules'
const { execFile, spawn } = child_process
import fs from 'fs'

export const run_js = async (js, { file = 'generated.js' } = {}) =>
	use_tmp_dir(async tmp_dir => {
		const output_file = replace_extension(path.join(tmp_dir, file), '.js')
		await fs.promises.mkdir(path.dirname(output_file), { recursive: true })
		await fs.promises.writeFile(output_file, js)
		const { code = 0, stdout, stderr } = await execFile('node', [ '--enable-source-maps', '--unhandled-rejections=strict', output_file ])
			.catch(error => error)
		return { code, stdout, stderr }
	})
