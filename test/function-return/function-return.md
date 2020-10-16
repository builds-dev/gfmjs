```js
;[ 'foo', 'bar', 'baz' ].map(function (value) {
	return typeof value; /* => 'string' */
})

;[ '1', 2 ].map(function (value) {
	return typeof value;
	// => 'string'
})
```
