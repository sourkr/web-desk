const win = new Window()
const list = $('<div></div>')

win.icon.src = '/store/taskman/icon.png'
win.title.innerText = 'Task Manager'
win.append(list[0])

function update() {
    list.empty()
    
    windows.forEach(win => {
        list.append(`<div>
            <img src="${$(win.icon).attr('src')}">
            <span>${$(win.title).text()}<span>
            <button>Kill</bunnton>
        </div>`)
        
        list.fild('button').on('click', () => {
            win.close()
            update()
        })
    })
}

const id = setInterval(update, 500)

const closeWindow = win.close.bind(win)

win.close = () => {
    clearInterval(id)
    closeWindow()
}