import babel from '@babel/core'
import commentAssertions from './babel-plugin-transform-comment-assertions.js'
import addImports from './babel-plugin-add-imports.js'
import sourceMap from 'source-map'

export const transform_comment_assertions = async ({ code, map, file }) => {
	try {
		const result = babel.transform(code, { plugins: [ addImports([ 'assert' ]), commentAssertions ], sourceMaps: 'both', inputSourceMap: map, filename: file })
		return { code: result.code, map: result.map }
	} catch (error) {
		return await sourceMap.SourceMapConsumer.with(map, null, consumer => {
			throw Object.assign(error, { origin: consumer.originalPositionFor(error.loc) })
		})
	}
}
