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
    out.append(getInfo())
    inp.empty()
    
    ev.preventDefault()
})

async function runcl(cl) {
    const args = cl.split(' ')
    
    switch (args[0]) {
        case 'sourc': {
            const compiler = new Compiler()
            const code = fs.read(args[2])
            const output = compiler.compile(code, msg => out.append(msg))
            fs.write(args[1], output)
            break
        }
        
        case 'exec': {
            await exec(args[1], msg => out.append(msg))
            break
        }
        
        default:
            out.append(`bash: ${args[0]}: Command not found`)
    }
}

// function runCommand(args) {
    
// }

function getInfo() {
    return `root@webos:~# `
}