const win = new Window()

win.icon.src = '/store/editor/icon.png'
win.title.innerText = 'File Editor'

const textarea = $('<textarea></textarea>')

let opened = null

textarea.css({
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    resize: 'none'
})

if(process.argv[1] && fs.exist(process.argv[1])) {
    opened = process.argv[1]
    textarea.val(fs.read(process.argv[1]))
}

textarea.on('keydown', ev => {
    if(ev.ctrlKey && ev.key == 's') {
        ev.preventDefault()
        if(opened) fs.write(opened, textarea.val())
    }
})

win.append(textarea[0])