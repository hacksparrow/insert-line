'use strict'

var fs = require('fs')
var os = require('os')

function Inserter(filePath) {
  if (typeof filePath === 'undefined') {
    throw new Error('File path not specified')
  }
  this.filePath = filePath
  return this
}

Inserter.prototype.content = function(lineContent, options) {
  if (typeof lineContent === 'undefined') {
    lineContent = ''
  }
  this.options = {
    prepend: false,
    append: false,
    padding: 0,
    padWith: ' ',
    eol: os.EOL,
    overwrite: false
  }
  if (typeof options !== 'undefined') {
    if ('prepend' in options) this.options.prepend = options.prepend
    if ('append' in options) this.options.append = options.append
    if ('padding' in options) this.options.padding = options.padding
    if ('padWith' in options) this.options.padWith = options.padWith
    if ('eol' in options) this.options.eol = options.eol
    if ('overwrite' in options) this.options.overwrite = options.overwrite
  }
  this.lineContent = lineContent.toString()
  return this
}

Inserter.prototype.at = function(lineNumber) {
  lineNumber = parseInt(lineNumber)
  if (typeof lineNumber !== 'number' || lineNumber <= 0) {
    throw new Error('Invalid line number')
  }
  this.atLineNumber = lineNumber
  return this
} 

Inserter.prototype.prepend = function(lineContent, options) {
  if (typeof options === 'undefined') {
    options = {}
  }
  options.prepend = true
  return this.content(lineContent, options)
}

Inserter.prototype.append = function(lineContent, options) {
  if (typeof options === 'undefined') {
    options = {}
  }
  options.append = true
  return this.content(lineContent, options)
}

Inserter.prototype.then = function(callback) {
  if (typeof this.atLineNumber === 'undefined' && (!this.options.prepend && !this.options.append)) {
    return callback(new Error('Line number not set'))
  }
  var filePath = this.filePath
  var self = this
  fs.access(filePath, function(err) {
    if (err) return callback(err)
    fs.readFile(filePath, 'utf8', function(err, fileContent) {

      if (err) return callback(err)

      var prepend = false 
      var append = false
      var newLines = []
      var updatedContent
      var padWith = self.options.padWith || ''
      var padding = self.options.padding || 0
      var padString = padWith.repeat(padding)
      var skip = false

      var lines = fileContent.split(/\r\n|\r|\n/g);
      if (lines.length + 1 < self.atLineNumber) {
        return callback(new Error('Invalid line'))
      }

      if (self.options.prepend || self.atLineNumber === 1) {
        prepend = true
      } else if (self.options.append || lines.length + 1 === self.atLineNumber) {
        append = true
      }

      if (prepend) {
        updatedContent = padString + self.lineContent + self.options.eol + fileContent
      } else if (append) {
        updatedContent =  fileContent + padString + self.lineContent + self.options.eol
      } else {
        for (var i = 0; i < lines.length; i++) {
          if (self.atLineNumber === i + 1) {
            newLines.push(padString + self.lineContent)
            if (self.options.overwrite) { skip = true }
          }
          if (skip) {
            skip = false
          } else {
            newLines.push(lines[i])
          }
        }
        updatedContent = newLines.join(self.options.eol)
      }

      fs.writeFile(self.filePath, updatedContent, function(err) {
        callback(err)
      })

    })
  })
}

module.exports = function(filePath) {
  return new Inserter(filePath)
}
