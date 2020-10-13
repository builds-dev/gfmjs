```js
const expected = [ 1, 2, 3 ]
const foo = value => {
	value // => expected.shift()
}
foo(1)
foo(2)
foo(3)
foo(4)
```
