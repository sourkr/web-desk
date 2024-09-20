const CPP_BUILTIN_FUNS = new Map()

CPP_BUILTIN_FUNS.set('print', {
    params: ['str'],
    ret: 'void',
    compile: (stmt, comp) => {
        const msg = stmt.args[0];
        const ptr = comp.strPool.add(msg.value)
        
        return [
            `i32.const ${ptr}`,
            `i32.const ${msg.value.length - 1}`,
            `call $write`
        ]
    }
})