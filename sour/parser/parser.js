const operators = '+-*/>!'

const opPrecidence = new Map([
  ['+', 1],
  ['-', 1],
  ['*', 1],
  ['/', 1],
  
  ['>', 2],
  ['<', 2],
  
  ['&', 3],
  ['|', 3],
])

class Parser extends BaseParser {
  parseStmt() {
    if (this.is('key', 'fun'))   return this.spec(this.parseFun)
    if (this.is('key', 'export'))   return this.spec(this.parseExport)
    if (this.is('key', 'import'))   return this.spec(this.parseImport)
    
    // if (this.is('key', 'class')) return this.spec(this.parseClass)
    // if (this.is('key', 'const')) return this.spec(this.parseConst)
    
    // switch(true) {
      
    //   case this.#isKeyword('var'):    ßreturn this.#parseVar()
      
    //   case this.#isKeyword('while'):  return this.#parseWhile()
    //   case this.#isKeyword('for'):    return this.#parseFor()
      
    //   case this.#isKeyword('return'): return this.#parseRet()
      
    // }
    
    return this.spec(this.parseBlockStmt)
  }
  
  parseBlockStmt() {
    if (this.is('key', 'var')) return this.spec(this.parseVar)
    if (this.is('key', 'if')) return this.spec(this.parseIf)
    
    return this.spec(this.parseExpr)
  }
  
  parseExpr() {
    if(this.is('key', 'new')) return this.spec(this.parseNew)
    
    if(this.is('ident')) return this.spec(this.parseIdent)
    if(this.is('num'))   return this.mayOp(this.next('num'))
    if(this.is('str'))   return this.next('str')
    
    // switch (this.#peekToken().type) {
  //     case 'num' :
  //     case 'str' :
  //     case 'char' :
  //       return this.#mayAs(this.#mayOp(this.#nextToken()))
      
  //     case 'eof': return null
  //     case 'err': return this.#nextToken()
      
  //     case 'cmt': return this.#parseStmt(this.#nextToken())
      
  //     case 'punc': return this.#parsePunc()
      
  //   }
    
    this.unexpected()
  }
  
  
  // stmt
  parseVar() {
    this.skip('key', 'var')
    
    const name = this.next('ident')
    this.skip('punc', ':')
    const valType = this.spec(this.parseType)
    
    return { type: 'var', name, valType }
  }
  
  parseFun() {
    this.skip('key', 'fun')
    
    const name = this.next('ident')
    const params = this.spec(this.parseList, '(', ')', this.parseParam, ',')
    this.skip('punc', ':')
    const ret = this.spec(this.parseType)
    const body = this.spec(this.parseList, '{', '}', this.parseBlockStmt)
    
    return { type: 'fun', name, params, ret, body }
  }
  
  parseClass() {
    this.skip('key', 'class')
    
    const name = this.next('ident')
    const body = this.spec(this.parseList, '{', '}', this.parseStmt)
    
    return { type: 'class', name, body }
  }
  
  parseConst() {
    this.skip('key', 'const')
  }
  
  parseIf() {
    this.skip('key', 'if')
    this.skip('punc', '(')
    
    const cond = this.spec(this.parseExpr)
    
    this.skip('punc', ')')
    
    const body = this.spec(this.parseBody)
    
    return { type: 'if', cond, body }
  }
  
  parseExport() {
    this.skip('key', 'export')
    
    const stmt = this.parseStmt()
    if(!stmt) return {}
    stmt.isExported = true
    return stmt
  }
  
  parseImport() {
    this.skip('key', 'import')
    const path = this.next('str')
    return { type: 'import', path }
  }
  
  
  // expr
  parseIdent() {
    const ident = this.next('ident')
    
    if (this.is('punc', '(')) return this.spec(this.parseCall, ident)
    if (this.is('punc', '=')) return this.spec(this.parseAssign, ident)
    if (this.is('punc', '[')) return this.spec(this.parseIndex, ident)
    if (this.is('punc', '.')) return this.spec(this.parseDot, ident)
    
    // switch (true) {
    //   case this.#isPunc('('): return this.#parseCall(ident)
    //   case ident.value == 'new': return this.#parseNew(ident)
    //   default: return this.#mayAs(this.#mayEqOp(this.#mayDot(ident)))
    // }
    
    return this.mayOp(ident)
  }
  
  parseCall(access) {
    const args = this.spec(this.parseList, '(', ')', this.parseExpr, ',')
    return { type: 'call', access, args }
  }
  
  mayAssign(access) {
    if(!this.is('punc', '=')) return access
    return this.parseAssign(access)
  }
  
  parseAssign(access) {
    this.skip('punc', '=')
    const value = this.spec(this.parseExpr)
    return { type: 'assign', access, value }
  }
  
  mayOp(left) {
    for(let char of operators) {
      if(!this.is('punc', char)) continue
      return this.spec(this.parseOp, left)
    }
    
    return left
  }
  
  parseOp(left) {
    // let equals = this.#missing()
    let equals = null
    let str = this.peek().value
    
    const op = this.next('punc')
    
    if(op.value == '!') {
      equals = this.next('punc', '=')
      str += '='
    }
    
    const right = this.spec(this.parseExpr)
    
    return arrangeOp({ type: 'op', left, op, equals, right, str })
  }
  
  parseNew() {
    this.skip('key', 'new')
    const name = this.next('ident')
    this.skip('punc', '[')
    const length = this.next('int')
    this.skip('punc', ']')
    
    return { type: 'array', name, length }
  }
  
  parseIndex(access) {
    this.skip('punc', '[')
    const value = this.spec(this.parseExpr)
    this.skip('punc', ']')
    
    return this.mayAssign({ type: 'index', access, value })
  }
  
  parseDot(access) {
    this.skip('punc', '.')
    const field = this.next('ident')
    
    return this.mayOp({ type: 'dot', access, field })
  }
  
  
  // types
  parseType(colon = true) {
    const name = this.next('ident')
    
    if (this.is('punc', '[')) return this.spec(this.parseTypeArray, name)
    
    return { type: 'ins', name }
  }
  
  parseTypeArray(name) {
    this.skip('punc', '[')
    this.skip('punc', ']')
    
    return { type: 'arr', name }
  }
  
  
  // utils
  parseParam() {
    const name = this.next('ident')
    this.skip('punc', ':')
    const type = this.spec(this.parseType)
    
    return { name, type }
  }
  
  parseList(start, end, parse, sep) {
    const list = []
    
    if(this.hasError) return list
    
    this.skip('punc', start)
    
    if(this.is('punc', end)) return this.skip(), list
    
    while(this.has()) {
      list.push(this.spec(parse))
      
      if(this.is('punc', end)) return this.skip(), list.filter(Boolean)
      if(sep) {
        if(!this.is('punc', sep)) return list
        this.skip('punc', sep)
      }
    }
    
    this.skip('punc', end)
    return list
  }
  
  parseBody() {
    if (this.is('punc', '{')) return this.spec(this.parseList, '{', '}', this.parseStmt)
    return [ this.spec(this.parseExpr) ]
  }
  
  
  // #missing() {
  //   const pos = this.#tokens.peek().start
    
  //   return {
  //     type: 'missing',
  //     start: pos,
  //     end: pos
  //   }
  // }
  
  // #parseImport() {
  //   this.#skip() // 'import'
    
  //   const names = this.#parseList('{', () => {
  //     if(!this.#isIdent()) return error(`unexpected token ${this.#peekToken().value}`, this.#nextToken())
  //     return this.#nextToken()
  //   }, '}')
    
  //   if(!this.#isKeyword('from')) return unexpected(this.#nextToken(), 'import', {})
  //   this.#skip()
    
  //   const path = this.#nextToken()
    
  //   return { type: 'import', names, path }
  // }
  
  // #parseConst() {
  //   let valType
  //   let value
    
  //   const kw = this.#nextToken()
    
  //   if (!this.#isIdent()) return unexpected(this.#nextToken(), 'const', { kw })
  //   const name = this.#nextToken()
    
  //   if (this.#isPunc(':')) {
  //     this.#nextToken() // skip ':'
    
  //     valType = this.#parseType()
  //   }
    
  //   if (this.#isPunc('=')) {
  //     this.#nextToken() // skip '='
    
  //     value = this.#parseExpr()
  //     if (is_error(value)) return unexpected(value, 'const', { kw, name, valType })
  //   }
    
  //   if (!(valType || value)) return unexpected(this.#nextToken(), 'const', { kw, name, valType, value })
    
  //   return { type: 'const', kw, name, valType, value }
  // }
  
  // #parseWhile() {
  //   this.#skip() // 'while'
    
  //   if (!this.#isPunc('(')) return unexpected(this.#nextToken(), 'while', {})
  //   this.#skip()
    
  //   const condition = this.#parseExpr()
    
  //   if (!this.#isPunc(')')) return unexpected(this.#nextToken(), 'while', { condition })
  //   this.#skip()
    
  //   const body = this.#parseBody()
    
  //   return { type: 'while', condition, body }
  // }
  
  // #parseFor() {
  //   this.#skip() // 'for'
    
  //   if (!this.#isPunc('(')) return unexpected(this.#nextToken(), 'for', {})
  //   this.#skip()
    
  //   const initialisation = this.#parseStmt()
    
  //   if (!this.#isPunc(';')) return unexpected(this.#nextToken(), 'for', { initialisation })
  //   this.#skip()
    
  //   const condition = this.#parseExpr()
    
  //   if (!this.#isPunc(';')) return unexpected(this.#nextToken(), 'for', { initialisation, condition })
  //   this.#skip()
    
  //   const incrementation = this.#parseExpr()
    
  //   if (!this.#isPunc(')')) return unexpected(this.#nextToken(), 'for', { initialisation, condition, incrementation })
  //   this.#skip()
    
  //   const body = this.#parseBody()
    
  //   return { type: 'for', initialisation, condition, incrementation, body }
  // }
  
  // #parseRet() {
  //   const kw = this.#nextToken()
  //   const value = this.#parseExpr()
    
  //   return { type: 'ret', kw, value }
  // }
  
  // #parseBody() {
  //   const body = []
    
  //   if(!this.#isPunc('{')) return body.push(this.#parseStmt())
    
  //   return this.#parseBlock()
  // }
  
  // #parseBlock() {
  //   const body = []
    
  //   if(!this.#isPunc('{')) return error(`unexpected token ${this.#peekToken().value}`, this.#nextToken())
  //   this.#nextToken()
    
  //   while (true) {
  //     if(this.#isPunc('}')) {
  //       this.#skip() // '}'
  //       break
  //     }
      
  //     const stmt = this.#parseStmt()
  //     body.push(stmt || error(`unexpected token`))
  //     if(is_error(stmt)) break 
  //   }
    
  //   return body
  // }
  
  
  // #parsePunc() {
  //   switch (true) {
  //     case this.#isPunc('<'): return this.#parseEle()
  //     case this.#isPunc('['): return this.#parseArray()
  //     case this.#isPunc('-'): return this.#parseNeg()
  //     case this.#isPunc('~'): return this.#parseBind()
  //     case this.#isPunc('{'): return this.#parseObject()
      
  //     default: return error(`unexpected token ${stringify(this.#peekToken())}`, this.#nextToken())
  //   }
  // }
  
  // #parseEle() {
  //   const name = this.#parseTagStart()
  //   this.#parseTagEnd()
    
  //   return { type: 'ele', name }
  // }
  
  // #parseTagStart() {
  //   this.#nextToken() // skip '<'
  //   const name = this.#nextToken()
  //   this.#nextToken() // skip '>'
    
  //   return name
  // }
  
  // #parseTagEnd() {
  //   this.#nextToken() // skip '<'
  //   this.#nextToken() // skip '/'
  //   const name = this.#nextToken()
  //   this.#nextToken() // skip '>'
  
  //   return name
  // }
  
  // #mayCall(access) {
  //   if(this.#isPunc('(')) return this.#parseCall(access)
  //   return access
  // }
  
  // #parseNeg() {
  //   const sign = this.#nextToken()
  //   const value = this.#parseExpr()
    
  //   return { type: 'neg', sign, value }
  // }
  
  // #parseAssign(access) {
  //   this.#skip() // '='
    
  //   if(this.#isPunc('=')) {
  //     const operator = this.#nextToken()
  //     const right = this.#parseExpr()
      
  //     return { type: 'op', left: access, right, operator }
  //   }
    
  //   const value = this.#parseExpr()
    
  //   return { type: 'assign', access, value }
  // }
  
  // #parseNew(kw) {
  //   if(!this.#isIdent()) return unexpected(this.#nextToken(), 'new', { kw })
  //   const name = this.#nextToken()
  //   const args = []
    
  //   if(!this.#isPunc('(')) return unexpected(this.#nextToken(), 'new', { kw, name, args })
  //   this.#skip() // '('
    
  //   if(this.#isPunc(')')) {
  //     this.#skip()
  //     return { type: 'new', kw, name, args }
  //   }
    
  //   while (true) {
  //     args.push(this.#parseExpr())
      
  //     if(this.#isPunc(')')) {
  //       this.#skip()
  //       return { type: 'new', kw, name, args }
  //     }
      
  //     if(!this.#isPunc(',')) return unexpected(this.#nextToken(), 'new', { kw, name, args })
  //     this.#skip()
  //   }
    
  //   return { type: 'new', kw, name, args }
  // }
  
  // #mayDot(left) {
  //   if(!this.#isPunc('.')) return left
    
  //   this.#skip() // skip .
    
  //   if(!this.#isIdent()) return unexpected(this.#nextToken(), 'dot', { left })
  //   const right = this.#nextToken()
    
  //   return this.#mayCall(this.#mayAssign(this.#mayDot({ type: 'dot', left, right })))
  // }
  
  // #parseArray() {
  //   this.#skip() // skip '['
    
  //   const values = []
    
  //   let sClose
    
  //   if(this.#isPunc(']')) sClose = this.#nextToken()
    
  //   while (!sClose) {
  //     values.push(this.#parseExpr())
      
  //     if(this.#isPunc(']')) {
  //       sClose = this.#nextToken()
  //       break
  //     }
      
  //     if(!this.#isPunc(',')) return unexpected(this.#nextToken(), 'array', { values })
  //     this.#skip() // ','
  //   }
    
  //   let valType
    
  //   if(this.#isPunc(':')) {
  //     this.#skip() // ':'
  //     valType = this.#parseType()
  //   }
    
  //   return { type: 'array', values,valType }
  // }
  
  // #mayOp(left) {
  //   const operator = this.#peekToken()
    
  //   if (operator.type != 'punc') return left
    
  //   if (arithmeric.includes(operator.value)) {
  //     this.#skip()
      
  //     if (this.#isPunc('=')) {
  //       this.#skip()
        
  //       const right = this.#parseExpr()
        
  //       return arrange_op({ type: 'op', left, right, operator, isEquals: true })
  //     }
      
  //     const right = this.#parseExpr()
      
  //     return arrange_op({ type: 'op', left, right, operator })
  //   }
    
  //   if (single.includes(operator.value)) {
  //     this.#skip()
      
  //     if (this.#isPunc('=')) {
  //       this.#skip()
        
  //       const right = this.#parseExpr()
        
  //       return { type: 'op', left, right, operator, isEquals: true }
  //     }
      
  //     const right = this.#parseExpr()
      
  //     return arrange_op({ type: 'op', left, right, operator })
  //   }
    
  //   if (double.includes(operator.value)) {
  //     this.#skip()
      
  //     if (!this.#isPunc(operator.value)) return unexpected(this.#nextToken(), 'op', {})
  //     // const double = this.#nextToken()
  //     this.#skip()
      
  //     const right = this.#parseExpr()
      
  //     return arrange_op({ type: 'op', left, right, operator, isDouble: true })
  //   }
    
  //   return left
  // }
  
  // #mayEqOp(left) {
  //   if(!this.#isPunc()) return left
    
  //   const operator = this.#peekToken()
    
  //   if(arithmeric.includes(operator.value)) {
  //     this.#skip()
      
  //     if(this.#isPunc('=')) {
  //       this.#skip()
        
  //       const right = this.#parseExpr()
        
  //       return arrange_op({ type: 'op', left, right, operator, isEquals: true })
  //     }
      
  //     if (this.#isPunc(operator.value)) {
  //       if (this.#isPunc('+'))
  //         return { type: 'unary', access: left, operator, second: this.#nextToken() }
  //     }
      
  //     const right = this.#parseExpr()
      
  //     return arrange_op({ type: 'op', left, right, operator })
  //   }
    
  //   if(single.includes(operator.value)) {
  //     this.#skip()
      
  //     if (this.#isPunc('=')) {
  //       this.#skip()
  //       const right = this.#parseExpr()
  //       return arrange_op({ type: 'op', left, right, operator, isEquals: true })
  //     }
      
  //     const right = this.#parseExpr()
      
  //     return arrange_op({ type: 'op', left, right, operator })
  //   }
    
  //   return left
  // }
  
  // #mayAs(expr) {
  //   if(!this.#isKeyword('as')) return expr
    
  //   const kw = this.#nextToken()
  //   const castType = this.#parseType()
    
  //   return { type: 'as', expr, kw, castType }
  // }
  
  // #mayAssign(access) {
  //   if(!this.#isPunc('=')) return access
  //   this.#skip()
    
  //   const value = this.#parseExpr()
    
  //   return { type: 'assign', access, value }
  // }
  
  // #parseBind() {
  //   this.#skip() // '~'
    
  //   const name = this.#nextToken()
  //   const params = this.#parseList('(', this.#parseType.bind(this), ')')
    
  //   return { type: 'bind', name, params }
  // }
  
  // #parseObject() {
  //   this.#skip()
    
  //   if(!this.#isPunc('}')) return unexpected(this.#nextToken(), 'obj', {})
  //   return { type: 'obj' }
  // }
}

// function stringify(obj) {
//   if(!obj) return 'end of file'
  
//   if(obj.type == 'ident') return obj.value
//   if(obj.type == 'punc') return obj.value
//   if(obj.type == 'unknown') return obj.value
//   if(obj.type == 'eof') return obj.value
  
//   return JSON.stringify(obj)
// }

// function is_error(expr) {
//   return !expr || expr.type == 'err'
// }

// function unexpected(token, type, data) {
//   let err = token?.type == 'err'
//     ? token
//     : error(`unexpected token ${stringify(token)}`, token)
  
//   return { ...data, type, err }
// }

// function error(msg, token) {
//   return { type: 'err', msg, lieno: token.lieno }
// }

// function ret_err(err, type, data) {
//   return { type, err, ...data }
// }

function getOpPrecidence(op) {
  if (op.type != 'op') return 0
  
  return opPrecidence.get(op.op.value) || 0
}

function arrangeOp(op) {
  // console.log(op)
  const precidence = getOpPrecidence(op)
  const leftPrecidence = getOpPrecidence(op.left)
  const rightPrecidence = getOpPrecidence(op.right)
  
  if(rightPrecidence > precidence) {
    const left = { type: 'op', left: op.left, right: op.right.left, operator: op.operator }
    const right = op.right.right
    
    op.arraged = { type: 'op', left, right, operator: op.right.operator }
    return op
  }
  
  return op.arraged = op
}