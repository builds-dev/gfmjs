import Markdown from 'markdown-it'
import regex from 'regex-fun'
const lineBreak = regex.either(/\r\n/, /\r/, /\n/)

const make_html_comment_code_block_regex = languages => regex.combine(
	/^/,
	'<!--',
	regex.anyNumber(/\s/),
	regex.capture(regex.either(...languages)),
	regex.anyNumber(/\s/),
	regex.oneOrMore(lineBreak),
	regex.anyNumber(/\s/),
	regex.capture(/[\s\S]*/),
	'-->',
	/$/
)

const tokenTypeHandlers = {
	fence: (token, { languages }) => {
		return token.tag === 'code' && languages.includes(token.info)
			? { type: 'fence', language: token.info, contents: token.content }
			: null
	},
	html_block: (token, { languages }) => {
		const content = token.content.trim()
		const matches = content.match(make_html_comment_code_block_regex(languages))
		return matches ? { type: 'html_comment', language: matches[1], contents: matches[2] } : null
	}
}

export const extract_gfm_code_blocks = (gfm, { languages }) => {
	const lineIndexes = gfm
		.split(lineBreak)
		.reduce(
			(acc, line, index) => {
				const start = index === 0 ? 0 : acc[index - 1].end + 1
				const end = start + line.length
				acc.push({ start, end })
				return acc
			},
			[]
		)
	return Markdown({ html: true }).parse(gfm)
		.reduce(
			(acc, token) => {
				const handler = tokenTypeHandlers[token.type] || (() => null)
				const block = handler(token, { languages })
				if (block) {
					const startLine = token.map[0] + 1
					const endLine = token.map[1] - 2
					const startIndex = lineIndexes[startLine].start
					const endIndex = lineIndexes[endLine].end
					acc.push({ ...block, startLine, endLine, startIndex, endIndex })
				}
				return acc
			},
			[]
		)
}
