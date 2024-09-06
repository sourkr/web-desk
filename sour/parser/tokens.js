const EOF = ''.charAt()
const puncs = '{:}~[,](<=>)+*&|.?;!'
const keywords = [ 'var', 'fun', 'if', 'export', 'import', 'new' ]
const bools = [ 'true', 'false', 'yes', 'no' ]

const isDigit = c => /\d/.test(c)
const isIdent = c => /[a-zA-Z_]/.test(c)

class Tokenizer {
  #chars
  #current
  #start
  
  constructor(input) { this.#chars = new CharStream(input) }
  
  peek() {
    if(this.#current) return this.#current
    return this.#current = this.#next()
  }
  
  next() {
    if(this.#current) {
      const temp = this.#current
      this.#current = null
      return temp
    }
    
    return this.#next()
  }
  
  has() { return this.#chars.has() }
  
  #next() {
    this.#start = this.#chars.pos()
    const c = this.#chars.peek()
    
    switch (true) {
      case c == EOF         : return this.#token('eof', c)
      case /\s/.test(c)     : return this.#chars.next() && this.#token('space', c)
      case isDigit(c)       : return this.#parseNum()
      case isIdent(c)       : return this.#parseIdent()
      case c == '/'         : return this.#parseSlash()
      case c == '-'         : return this.#parseMinus()
      case puncs.includes(c): return this.#token('punc', this.#chars.next())
      case c == "'"         : return this.#parseChar()
      case c == '"'         : return this.#parseStr()
      default               : return this.#token('unknown', this.#chars.next())
    }
  }
  
  #parseStr() {
    this.#chars.next()
    const str = this.#readWhile(c => !(c == '"' || c == EOF))
    
    if(this.#chars.peek() == EOF) {
      const token = this.#token('str', str, str.substr(1))
      token.err = `unexpected end of string 'end of file'`
      return token
    }
    
    this.#chars.next()
    return this.#token('str', `"${str}"`, str)
  }
  
  #parseNum() {
    let str = this.#readWhile(isDigit)
    
    if(this.#chars.peek() == '.' && isDigit(this.#chars.peek(1))) {
      str += this.#chars.next() + this.#readWhile(isDigit)
      return this.#token('float', str)
    }
    
    return this.#token('int', str)
  }
  
  #parseIdent() {
    const str = this.#readWhile(c => /[a-zA-Z0-9_]/.test(c))
    
    if(bools.includes(str)) return this.#token('bool', str)
    if(keywords.includes(str)) return this.#token('key', str)
    
    return this.#token('ident', str)
  }
  
  #readWhile(predicate) {
    let str = ""
    while(predicate(this.#chars.peek()))
      str += this.#chars.next()
    return str
  }
  
  #parseSlash() {
    this.#chars.next()
    
    if(this.#chars.peek() == '/') {
      this.#chars.next()
      const str = this.#readWhile(c => !(c == '\n' || c == EOF))
      return this.#token('cmt', str)
    }
    
    if(this.#chars.peek() == '*') {
      const str = this.#parseMultilineCmt()
      return this.#token('cmt', str)
    }
    
    return this.#token('punc', '/')
  }
  
  #parseMinus() {
    this.#chars.next()
    
    if(/\d/.test(this.#chars.peek())) {
      const num = this.#parseNum()
      num.value = '-' + num.value
      return num
    }
    
    return this.#token('punc', '-')
  }
  
  /**
   * Must be called after '*' is matched and
   * the '/' is consumed.
   */
  #parseMultilineCmt() {
    this.#chars.next() // skip *
    let str = this.#readWhile(c => !(c == '*' || c == EOF))
    // this.#chars.next()
    if(this.#chars.peek(1) != '/') str += '*' + this.#parseMultilineCmt()
    else {
      this.#chars.next()
      this.#chars.next()
    }
    return str
  }
  
  #parseChar() {
    let str = this.#chars.next()
    
    if(this.#chars.peek() == '\\') {
      // const escape = this.#chars.next()
      str += this.#chars.next()
    }
    
    str += this.#chars.next() + this.#chars.next()
    
    return this.#token('char', str, eval(str))
  }
  
  get #lineno() {
    return this.#chars.lineno
  }
  
  #token(type, source, value = source) {
    return { type, source, value, start: this.#start, end: this.#chars.pos() }
  }
}

class CharStream {
  index = 0
  line = 1
  col = 1
  
  constructor(input) { this.input = input }

  peek(n = 0) {
    return this.input.charAt(this.index + n)
  }

  next() {
    const char = this.input.charAt(this.index++)
    
    if (char == '\n') this.line++, this.col = 1
    else this.col++
    
    return char
  }

  has() { return this.index < this.input.length }
  
  pos() { return new Position(this.index, this.line, this.col) }
}

class Position {
  constructor(index, line, col) {
    this.index = index
    this.line  = line
    this.col   = col
  }
}
