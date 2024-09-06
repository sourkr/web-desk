const win = new Window()
const term = $(`<pre></pre>`)
const inp = $(`<span contenteditable="true"></span>`)

win.icon.src = '/store/term/icon.png'
win.title.innerText = 'Terminal'
win.append(term[0])

term.html('root@souros:~# ')
term.append(inp)

inp.focus()

term.onclick = () => inp.focus()