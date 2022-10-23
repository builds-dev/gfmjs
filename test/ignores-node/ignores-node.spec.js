import { test } from 'zora'
import path from 'path'
import { fileURLToPath } from 'url'
import { verify_file } from '../../src/verify_file.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('ignores-node', async t => {
	const { code, failed, output } = await verify_file(path.join(__dirname, './ignores-node.md'))
	t.notOk(failed)
})
