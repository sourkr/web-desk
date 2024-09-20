const skipable = ['space', 'cmt']

class BaseParser {
  errors = []
  body = []
  
  #tokens
  #spec
  #file
  
  constructor(code, file){
    this.code = code
    this.#tokens = new Tokenizer(code)
    this.#file = file
  }
  
  parse() {
    while(this.#tokens.has()) {
        if(this.is('eof')) break
        this.body.push(this.spec(this.parseStmt))
    }
    
    this.body = this.body.filter(Boolean)
  }
  
  peek() {
    const tok = this.#tokens.peek()
    if(skipable.includes(tok.type)) return this.#tokens.next(), this.peek()
    return tok
  }
  
  next(type, value) {
    if(type) {
      if (!this.#spec.isComplete) return { type: 'missing', start: this.#spec.pre?.end }
      
      if(!this.is(type, value)) {
        this.#err(`(3) expecting ${errTokMsg(type, value)} but got ${errTokMsg(this.peek())}`, this.peek())
        this.#spec.isComplete = false
        return { type: 'missing', start: this.#spec.pre?.end, end: this.peek().start }
      }
      
      this.#spec.pre = this.peek()
      if(!this.#spec.first) this.#spec.first = this.peek() 
      return this.next()
    }
    
    const tok = this.#tokens.next()
    if(skipable.includes(tok.type)) return this.next()
    return tok
  }
  
  skip(type, value) {
    if (type) return this.next(type, value)
    
    this.#check()
    if(!this.#spec.first) this.#spec.first = this.peek()
    this.#spec.pre = this.next()
  }
  
  has() { return this.#tokens.has() }
  
  is(type, value) {
    const tok = this.peek()
    return tok.type == type && (value ? tok.value == value : true)
  }
  
  spec(callback, ...args) {
    const old = this.#spec
    this.#spec = old ? { ...old, first: null } : { isComplete: true }
    const stmt = callback.apply(this, args)
    const spec = this.#spec
    this.#spec = old
    
    if(!stmt) return
    stmt.isComplete = spec.isComplete
    stmt.start = spec.first?.start
    stmt.end = spec.pre?.end
    
    if(old) {
      old.first = old.first || spec.first
      old.pre = spec.pre
    }
    
    return stmt
  }
  
  #check() {
    if(!this.#spec) {
      throw new Error(`parser method must passed in this.spec(this.someParserMethod) insted of invoking directly.`)
    }
  }
  
  unexpected() {
    this.#err(`(1) unexpected ${errTokMsg(this.peek(), true)}`, this.next())
  }
  
  #err(msg, tok) {
    const err = { msg: `ParseError: ${msg}`, file: this.#file, start: tok.start, end: tok.end }
    this.errors.push(err)
  }
  
  get hasError() {
    return !this.#spec.isComplete
  }
}

// const alias = {
//   'ident': 'identifier',
// }

function errTokMsg(token, source) {
  if (typeof token == 'string') token = { type: token, source }
  
  switch (token.type) {
    case 'ident':
    case 'bool':
    case 'int':
    case 'float':
    case 'punc':
      if(source === true) return `token ${errTokMsg(token)}`
      return token.source ? `'${token.source}'` : "'identifier'"
    
    case 'key': return `keyword '${token.source}'`
    case 'char': return `char '${token.source}'`
    case 'str': return `token ${token.source}`
    
    case 'eof': return `end of file`
  }
}