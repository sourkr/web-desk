// 3 to 5
class Compiler {
    funs = CPP_BUILTIN_FUNS
    strPool = new StringPool()
    
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
        const data = this.strPool.toString('    ')
        
        return `(module
    (import "env" "write" (func $write (param i32 i32)))
    
    (memory (export "memory") 1)
    
    ${data}
    
    ${body.join('\n    ')}
)`
    }
    
    compBody(body) {
        return body.map(this.compStmt.bind(this)).flat()
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
            
            return fun.compile(stmt, this)
        }
        
        if(stmt.type == 'fun') {
            const name = stmt.name.value
            
            this.funs.set(name, {
                params: [],
                compile: this.compFun
            })
            
            if(name == 'main') {
                return `(func (export "main")
        ${this.compBody(stmt.body).join('\n        ')}
    )`
            }
            
            return `(func ${name}() {${this.compBody(stmt.body).join(';')}}`
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

class StringPool {
    pool = new Map()
    pos = 0
    
    add(str) {
        const index = this.pos
        
        this.pool.set(str, index)
        this.pos += str
        
        return index
    }
    
    toString(tab) {
        return [...this.pool]
            .map(([str, ptr]) => `(data (i32.const ${ptr}) ${raw(str)})`)
            .join('\n' + tab)
    }
}

const code = `
void main() {
    print("Hello, World!\n")
}
`

const compiler = new Compiler()
console.log(compiler.compile(code, msg => console.error(msg)))

function raw(str) {
    str = str.replaceAll('\n', '\\n')
    return `"${str}"`
}