// 3 to 5
class Compiler {
    funs = new Map([
        [ 'print', { args: [ 'str' ], compile: stmt => `postMessage([1,${stmt.args[0].source}])`} ]
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
        body.push('postMessage([0])')
        
        return body.join(';')
    }
    
    compBody(body) {
        return body.map(this.compStmt.bind(this))
    }
    
    compStmt(stmt) {
        if(stmt.type == 'var') {
            return `let ${stmt.name.value}`
        }
        
        if(stmt.type == 'assign') {
            return `${stmt.access.value}=${stmt.value.source}`
        }
        
        if(stmt.type == 'call') {
            const name = stmt.access.value
            
            if(!this.funs.has(name)) this.err(`(4) cannot find function ${name}`, stmt.access)
            const fun = this.funs.get(name)
            
            if(stmt.args.length != fun.args.length) this.err(`(5) required 1 arguments but got ${stmt.args.length}`, stmt.args)
            
            return fun.compile(stmt)
        }
        
        if(stmt.type == 'fun') {
            const name = stmt.name.value
            
            this.funs.set(name, {
                args: [],
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
`fun main(): void {
    print("Hello, Wolrd!")
}

main()`

const compiler = new Compiler()
console.log(compiler.compile(code, msg => console.error(msg)))