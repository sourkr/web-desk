class Compiler {
    compile(code) {
        const parser = new Parser(code)
        parser.parse()
        
        const body = this.compBody(parser.body)
        body.push('postMessage([0])')
        
        return body.join(';')
    }
    
    compBody(body) {
        return body.map(this.compStmt)
    }
    
    compStmt(stmt) {
        return `postMessage([1,${stmt.args[0].source}])`
    }
}

const compiler = new Compiler()
console.log(compiler.compile(`print("hello")`))