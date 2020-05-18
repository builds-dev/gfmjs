import fs from 'fs'
import path from 'path'
import { verify } from './verify.js'

export const verify_file = async file => {
	const contents = await fs.promises.readFile(file, 'utf8')
	return verify(contents, { file })
}
