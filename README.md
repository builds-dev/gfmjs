# gfmjs

`gfmjs` is a JavaScript test runner for GitHub Flavored Markdown files. It extracts JavaScript code blocks, transforms `// => expected` style comments into actual assertions, and executes the code, reporting syntax errors, runtime errors, and failed assertions.

Inspired by [`jsmd`](https://github.com/vesln/jsmd).

## features

Single-line `// => expected` and Block/Multi-line comments `/* => expected */`. are supported.
Newlines, extra lines, and spaces are fine.

```js
const x = 123

x // => 123

x
// => 123

x
/*
	=>
		123
*/
```

Any expression should work as an expected value.

```js
const expected = [ 1, 2, 3 ]
const foo = value => {
	value // => expected.shift()
}
foo(1)
foo(2)
foo(3)
```

It has a sourcemap back to the original markdown file so errors should include the original location.

CommonJS and/or ESM modules can be required or imported.

## usage

```sh
$ gfmjs ./README.md
```

```sh
# write the javascript bundle to a file
$ gfmjs -o ./build/README.js ./README.md
```

## sadness

No tests! It seems to work. Use with caution until someone has time to write tests. If you have time, please PR some tests.
