import { randomBytes } from  'node:crypto'
import { rmSync } from 'node:fs'
import { rm, writeFile } from 'node:fs/promises'
import { create_disposer } from '@m59/disposer'

const use_filepath = create_disposer({
	dispose: rm,
	dispose_on_exit: rmSync
})

export const use_temporary_mjs_file = async (file, js, f) => {
	const mjs_file = `${file}.${randomBytes(4).toString('hex')}.mjs`
	await writeFile(mjs_file, js)
	return use_filepath(mjs_file, f)
}
