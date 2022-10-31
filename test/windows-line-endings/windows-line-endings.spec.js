import { test } from 'zora'
import { verify } from '../../src/verify.js'

// Git will sometimes mess with line endings, thus the inline declaration
const contents_unix_eol = '```js\nconst x = 1234\nx // => 1234\n```\n'

test('unix line endings', async t => {
	const { code, failed, output } = await verify(contents_unix_eol)
	t.notOk(failed)
})

test('windows line endings', async t => {
	const contents_windows_eol = contents_unix_eol.replace(/\n/g, '\r\n')

	const { code, failed, output } = await verify(contents_windows_eol)
	t.notOk(failed)
})
