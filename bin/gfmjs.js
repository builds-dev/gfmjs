#!/usr/bin/env node

import fs from 'fs'
import { EOL } from 'os'
import { createRequire } from 'module'
import sade from 'sade'
import { verify_file } from '../src/verify_file.js'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const prog = sade('gfmjs [file]', true)
	.version(pkg.version)
	.option('--outfile, -o', 'write the generated js to a file')
	.action(async (file, { outfile }) => {
		try {
			const { code, failed, output } = await verify_file(file)
			const message = failed
				? output
				: `${output ? `${output}\n\n` : ''}All assertions passed.`
			console[failed ? 'error' : 'log'](message)
			if (outfile) {
				await fs.promises.writeFile(outfile, code)
			}
		} catch (error) {
			console.error(error.message)
			process.exit(1)
		}
	})

prog.parse(process.argv)
