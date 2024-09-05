const win = new Window()

win.icon.src = '/store/editor/icon.png'
win.title.innerText = 'File Editor'

const textarea = new $('textarea')

textarea.css({
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    resize: 'none'
})

if(fs.exist(process.argv[1])) {
    textarea.element.value = fs.read(process.argv[1])
}

win.append(textarea.element)