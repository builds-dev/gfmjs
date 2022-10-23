import { test } from 'zora'
import path from 'path'
import { fileURLToPath } from 'url'
import { verify_file } from '../../src/verify_file.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('function-return', async t => {
	const { code, failed, output } = await verify_file(path.join(__dirname, './function-return.md'))
	t.ok(failed)
	t.ok(output.includes(`number`))
	t.ok(output.includes(`should`))
	t.ok(output.includes(`equal`))
	t.ok(output.includes(`string`))
})
