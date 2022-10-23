import { test } from 'zora'
import path from 'path'
import { fileURLToPath } from 'url'
import child_process from 'child_process'
import { verify_file } from '../../src/verify_file.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const cp_exec_async = async cmd => {
	return new Promise((resolve) => {
		child_process.exec(cmd, (err, stdout, stderr) => {
			resolve({ err, stdout, stderr })
		})
	})
}

const run_bin_on_relative_file = async markdown_file_path => {
	const absolute_bin_file_path = path.join(__dirname, '../../bin/gfmjs.js')
	const absolute_markdown_file_path = path.join(__dirname, markdown_file_path)
	return await cp_exec_async(`node ${ absolute_bin_file_path } ${ absolute_markdown_file_path }`)
}

test('pass', async t => {
	const { err, stdout, stderr } = await run_bin_on_relative_file('./pass.md')
	t.notOk(err)
	t.ok(/pass/i.test(stdout))
	t.equal(stderr, '')
})

test('fail', async t => {
	const { err, stdout, stderr } = await run_bin_on_relative_file('./fail.md')

	t.ok(err?.code, 'process exited non-zero')
	t.notOk(err?.killed, 'process exited on its own')

	t.equal(stdout, '', 'stdout is empty')
	t.ok(/\b123\b/.test(stderr), 'stderr contains expected value')
	t.ok(/'something else'/.test(stderr), 'stderr contains actual value')
})

test('failed assertions are source-mapped to the markdown file', async t => {
	const { err, stdout, stderr } = await run_bin_on_relative_file('./fail.md')

	t.ok(/fail\.md:\d+:\d+/.test(stderr), 'Error line points to markdown file')
})
