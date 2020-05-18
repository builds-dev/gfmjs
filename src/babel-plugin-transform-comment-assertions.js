const commentAssertionRegex = /^\s*=>\s*/

export default function ({ types: t, transform }) {
	const assertExpression = (actual, expected) => {
		return t.callExpression(
			t.memberExpression(t.identifier('assert'), t.identifier('deepEqual')),
			[ actual, expected ]
		)
	}

	return {
		visitor: {
			ExpressionStatement (path, state) {
				const comments = path.node.trailingComments || path.node.expression.trailingComments || []
				const comment = comments[0]
				const isCommentAssertion = comment ? commentAssertionRegex.test(comment.value) : false

				if (!isCommentAssertion) {
					return
				}

				const actual = path.node.expression
				const expectedText = comment.value.replace(commentAssertionRegex, '').trim()
				const expected = transform(`() => (${expectedText})`, { ast: true })
					.ast.program.body[0].expression.body

				path.replaceWith(assertExpression(actual, expected))
				path.skip()
			}
		}
	}
}
