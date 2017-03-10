# insert-line

Node module for inserting lines to an existing file.

## Usage

### Instantiation

```js
const insertLine = require('insert-line')
```

### API

`insertLine` accepts a file path, after which you can call the chained methods: `content()` to specify the content and
`at()` to specify the line number. Finally, you must call `then()` and pass your callback function.

If you need to prepend a line to a file, you can use the shortcut method `prepend()`, instead of calling `content()` and `at()`.
If you need to append a line to a file, you can use the shortcut method `append()`, instead of calling `content()` and `at()`.

`content()`, `prepend()`, and `append()` can be configured to specify the tab character, tab count, EOL character, and the
option to overwrite the existing line.

**`insertLine(<filePath>)`**

`filePath`: path to the file to insert the line.

**`.at(<lineNumer>)`**

`lineNumer`: line number, where to insert the content. By default, the existing line will be pushed below. To overwrite the
current line, specify `overwrite: true`, in the `options` object passed to `content()`, `prepend()`, or `append()`.

**`.content([lineContent], [options])`**

`lineContent`: the content to be inserted at the line. If not specified, it defaults to an empty string.
`options`: the options object supports the following options.

  . `prepend`: whether to prepend or not, defaults to `false`
  . `append`: whether to append or not, defaults to `false`
  . `padding`: padding amount, defaults to `0`
  . `padWith`: character to be used for padding, defaults to ' ',
  . `eol`: end of line character, defaults to `os.EOL`
  . `overwrite`: whether to overwrite the existing line, defaults to `false`

**`.prepend([lineContent], [options])`**

Shortcut for adding a new line at the beginning of a file, with a combination of `at()` and `content()`.
Refer to the documentation of `.content()` for details about `lineContent` and `options`.

**`.append([lineContent], [options])`**

Shortcut for adding a new line at the end of a file, with a combination of `at()` and `content()`.
Refer to the documentation of `.content()` for details about `lineContent` and `options`.

**`.then(<callback>)`**

`callback`: callback function which will be executed after the line has been successfully inserted, or an error was encountered.

## LICENSE

[MIT](LICENSE)