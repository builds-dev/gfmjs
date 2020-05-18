export default names => ({ types: t, transform }) => {
	return {
		visitor: {
			Program (path, { file, opts }) {
				// NOTE: very basic - import name from name;
				names.forEach(name => {
					path.unshiftContainer(
						'body',
						t.importDeclaration(
							[ t.ImportDefaultSpecifier(t.Identifier(name)) ],
							t.stringLiteral(name)
						)
					)
				})
			}
		}
	}
}
