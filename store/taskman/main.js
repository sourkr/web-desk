const win = new Window()
const list = $('<div></div>')

win.icon.src = '/store/taskman/icon.png'
win.title.innerText = 'Task Manager'
win.append(list[0])

function update() {
    list.empty()
    
    windows.forEach(win => {
        list.append(`<div>${$(win.title).text()}</div>`)
    })
}

const id = setInterval(update, 500)

const closeWindow = win.close.bind(win)

win.close = () => {
    clearInterval(id)
    closeWindow()
}