import { test } from 'zora'
import path from 'path'
import { verify_file } from '../../src/verify_file.js'
const __dirname = path.dirname(new URL(import.meta.url).pathname)

test('multiline', async t => {
	const { code, failed, output } = await verify_file(path.join(__dirname, './multiline.md'))
	t.ok(failed)
	t.ok(output.includes(`123`))
	t.ok(output.includes(`should`))
	t.ok(output.includes(`equal`))
	t.ok(output.includes(`something else`))
})
