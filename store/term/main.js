const win = new Window()
const term = $(`<pre></pre>`)
const inp = $(`<span contenteditable="true"></span>`)

win.icon.src = '/store/term/icon.png'
win.title.innerText = 'Terminal'
win.append(term[0])

term.html('root@souros:~# ')
term.append(inp)

inp.focus()

term.on('click', () => inp.focus())

inp.on('keydown', ev => {
    if(ev.key != 'Enter') return
    
    inp.remove()
    term.append(inp.val())
    runcl(inp.val())
    inp.empty()
    term.append(inp)
})

function runcl(cl) {
    const args = cl.split(' ')
    
    switch (args) {
        // case 'sourc'
        
        default:
            term.append(`bash: ${args[0]}: Command not found`)
    }
}