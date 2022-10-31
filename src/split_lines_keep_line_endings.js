import regex from 'regex-fun'
const lineBreak = regex.either(/\r\n/, /\r/, /\n/)

export default string => string
	.split(regex.capture(lineBreak))
	.reduce((acc, line_or_eol, i) => {
		if (i % 2 === 0) {
			acc.push(line_or_eol)
		} else {
			acc.push(acc.pop() + line_or_eol)
		}
		return acc
	}, [])
