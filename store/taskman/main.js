const win = new Window()
const list = $('<div></div>')

win.icon.src = '/store/taskman/icon.png'
win.title.innerText = 'Task Manager'
win.append(list[0])

function update() {
    list.empty()
    
    windows.forEach(win => {
        const item = $(`<div>
            <span>${$(win.title).text()}</span>
            <button>Kill</bunnton>
        </div>`).appendTo(list)
        
        item.css({
            display: 'flex',
            gap: '5px',
            'align-items': 'center'
        })
        
        item.find('span').before(win.icon).css('flex', 1)
        
        item.find('button').on('click', () => {
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