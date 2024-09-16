const win = new Window()

const term = $(`<pre><span id="out"></span><span id="inp" contenteditable="true"></span></pre>`)

const out = term.children('#out')
const inp = term.children('#inp')

win.icon.src = '/store/term/icon.png'
win.title.innerText = 'Terminal'
win.append(term[0])

term.css({
    width: '100%',
    height: '100%'
})

// out.css('display', 'inline')

out.html(getInfo())
inp.focus()

term.on('click', () => inp.focus())

inp.on('keydown', async ev => {
    if(ev.key != 'Enter') return
    
    const cl = inp.text()
    
    out.append(inp.html()).append('<br>')
    inp.empty()
    await runcl(cl)
    if(!out.text().endsWith('\n')) out.append('\n')
    out.append(getInfo())
    inp.empty()
    
    ev.preventDefault()
})

async function runcl(cl) {
    const args = cl.split(' ')
    
    switch (args[0]) {
        case 'exec':{
            const encoder = new TextEncoder()
            const buffer = encoder.encode(fs.read(args[1]))
            
            const wasm = await WebAssembly.instantiate(buffer, {
                env: {
                    write(addr, len) {
                        const mem = wasm.instance.exports.memory
                        const bytes = new Uint8Array(mem.buffer, addr, len)
                        const str = new TextDecoder().decode(bytes)
                        
                        out.append(str)
                    }
                }
            })
            
            console.log(wasm.instance.exports.main())
            break
        }
        
        case 'pwd':
            out.append('/')
            break
            
        case 'wasm':
            try {
                const wabt = await WabtModule()
                const module = wabt.parseWat(args[2], fs.read(args[2]))
                module.validate()
                const { buffer } = module.toBinary({})
                const decoder = new TextDecoder()
                fs.write(args[1], decoder.decode(buffer))
            } catch (e) {
                out.append(e.message.replace('parseWat failed:\n', ''))
            }
            break;
        
        default:
            out.append(`bash: ${args[0]}: Command not found`)
    }
}

// function runCommand(args) {
    
// }

function getInfo() {
    return `root@webos:~# `
}