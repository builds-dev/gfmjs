import MagicString from 'magic-string'
import regex from 'regex-fun'
import { extract_gfm_code_blocks } from './extract_gfm_code_blocks.js'
const lineBreak = regex.either(/\r\n/, /\r/, /\n/)

export const js_from_gfm = (gfm, { file = 'source.md' } = {}) => {
	const blocks = extract_gfm_code_blocks(gfm, { languages: [ 'js', 'javascript' ] })
	const { s, nextIndex } = blocks
		.reduce(
			({ s, nextIndex }, block) => ({ s: s.remove(nextIndex, block.startIndex - 1), nextIndex: block.endIndex + 1 }),
			{ s: new MagicString(gfm), nextIndex: 0 }
		)
	nextIndex < gfm.length && s.remove(nextIndex, gfm.length)
	const map = s.generateMap({ file, source: file, includeContent: true })
	const code = s.toString()
	return { code, map, file }
}
