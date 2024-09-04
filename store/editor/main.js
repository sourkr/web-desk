const win = new Window()

win.icon.src = '/store/editor/icon.png'
win.title.innerText = 'File Editor'

const textarea = new $('textarea')

textarea.css({
    width: '100%',
    height: '100%'
})

win.append(textarea.element)