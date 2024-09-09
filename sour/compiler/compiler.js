// 3 to 5
class Compiler {
    funs = new Map([
        [ 'print', { params: [ 'str' ], compile: stmt => `a(1,${stmt.args[0].source})`, ret: 'void'} ],
        [ 'guiCall', { params: [ 'num' ], compile: stmt => `await b(${stmt.args[0].source})`, ret: 'num'} ],
    ])
    
    compile(code, out) {
        const parser = new Parser(code)
        
        this.code = code
        this.out = out
        
        parser.parse()
        
        if(parser.errors.length) {
            parser.errors.forEach(err => out(formatError(code, err)))
            return
        }
        
        const body = this.compBody(parser.body)
        body.push('a(0,-1)')
        
        return `(async()=>{${body.join(';')}})()`
    }
    
    compBody(body) {
        return body.map(this.compStmt.bind(this))
    }
    
    compStmt(stmt) {
        if(stmt.type == 'var') {
            return `let ${stmt.name.value}`
        }
        
        if(stmt.type == 'assign') {
            return `${stmt.access.value}=${this.compStmt(stmt.value)}`
        }
        
        if(stmt.type == 'call') {
            const name = stmt.access.value
            
            if(!this.funs.has(name)) this.err(`(4) cannot find function ${name}`, stmt.access)
            const fun = this.funs.get(name)
            
            if(stmt.args.length != fun.params.length) this.err(`(5) required 1 arguments but got ${stmt.args.length}`, stmt.args)
            
            for(let i = 0; i < fun.params.length; i++) {
                if(fun.params[i] != stmt.args[i].type)
                    this.err(`(6) ${stmt.args[i].type} cannot be assigned to ${fun.params[i]}`, stmt.args[i])
            }
            
            console.log(fun)
            return fun.compile(stmt)
        }
        
        if(stmt.type == 'fun') {
            const name = stmt.name.value
            
            this.funs.set(name, {
                params: [],
                compile: this.compFun
            })
            
            return `function ${name}() {${this.compBody(stmt.body).join(';')}}`
        }
        
        console.warn(stmt)
    }
    
    compFun(fun) {
        return `${fun.access.value}(${fun.args.map(e => e.source)})`
    }
    
    err(msg, tok) {
        this.out(formatError(this.code, { msg: `CompileError: ${msg}`, ...tok }))
    }
}

function formatError(code, err) {
    const e = `${err.msg}\n`
    const lineno = err.start.line || -1
    const line = code.split('\n')[lineno - 1]

    const pointer = ''.padEnd(lineno.toString().length) +
        '    ' +
        ''.padEnd(err.start?.col - 1) +
        '^'.padEnd(err.end?.col - err.start?.col, '^')

    return `${e}\n ${lineno} | ${line}\n${pointer}\n`
}

const code = 
`var win: num
win = guiCall(1)`

const compiler = new Compiler()
console.log(compiler.compile(code, msg => console.error(msg)))