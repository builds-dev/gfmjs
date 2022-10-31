const commentAssertionRegex = /^\s*=>\s*/
const isCommentAssertion = comment => comment ? commentAssertionRegex.test(comment.value) : false

export default function ({ types: t, parseSync }) {
	const assertExpression = (actual, expected) =>
		t.callExpression(
			t.memberExpression(t.identifier('assert'), t.identifier('deepEqual')),
			[ actual, expected ]
		)

	const assertIIFE = (actual, expected) =>
		t.callExpression(
			t.arrowFunctionExpression(
				[ t.identifier('expected'), t.identifier('actual') ],
				t.blockStatement([
					t.expressionStatement(assertExpression(t.identifier('actual'), t.identifier('expected'))),
					t.returnStatement(t.identifier('actual'))
				])
			),
			[ expected, actual ]
		)

	const getExpected = comment => {
		const expectedText = comment.value.replace(commentAssertionRegex, '').trim()
		return parseSync(`() => (${expectedText})`)
			.program.body[0].expression.body
	}

	return {
		visitor: {
			ArrowFunctionExpression (path, state) {
				const [ comment ] = path.node.trailingComments || []

				if (!isCommentAssertion(comment)) {
					return
				}

				const actual = path.node.body
				const expected = getExpected(comment)

				path.replaceWith(
					t.arrowFunctionExpression(
						path.node.params,
						assertIIFE(actual, expected)
					)
				)
				path.skip()
			},
			ExpressionStatement (path, state) {
				const [ comment ] = path.node.trailingComments || path.node.expression.trailingComments || []

				if (!isCommentAssertion(comment)) {
					return
				}

				const actual = path.node.expression
				const expected = getExpected(comment)
				path.insertAfter(t.expressionStatement(assertIIFE(actual, expected)))
				path.skip()
			},
			ReturnStatement (path, state) {
				const [ comment ] = path.node.trailingComments || []

				if (!isCommentAssertion(comment)) {
					return
				}

				const actual = path.node.argument
				const expected = getExpected(comment)
				path.replaceWith(t.returnStatement(assertIIFE(actual, expected)))
				path.skip()
			}
		}
	}
}
