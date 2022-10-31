import { test } from 'zora'
import split_lines_keep_line_endings from '../../src/split_lines_keep_line_endings.js'

test('split_lines_keep_line_endings', t => {
	t.equal(
		split_lines_keep_line_endings('\n\t\tthis is a test\n\t\tanother line\n')
		[ '\n', '\t\tthis is a test', '\t\tanother line\n' ]
	)

	t.equal(
		split_lines_keep_line_endings('test\r\n123')
		[ 'test\r\n', '123' ]
	)
})
