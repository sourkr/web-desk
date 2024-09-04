const desktop = document.querySelector('desktop')
const startBtn = document.querySelector('#start')

startBtn.onclick = () => {
    const menu = new ContextMenu()
    
    let group = menu.group()
    
    fs.list('apps').forEach(file => {
        const app = JSON.parse(fs.read(`/apps/${file}`))
        group.add(app.icon, app.name, () => eval(fs.read(app.file)))
    })
    
    menu.showAt(6, 36, 'bottom-left')
}

desktop.oncontextmenu = ev => {
    contextmenu(ev.pageX, ev.pageY, [
        {
            title: 'Add URL',
            click: () => {
                const win = new Window()
                win.title.innerText = 'Add URL App'
                
                const root = document.createElement('div')
                const url = document.createElement('input')
                const btn = document.createElement('button')
                
                btn.innerText = 'Add'
                
                btn.onclick = () => {
                    applications.push({
                        start: () => {
                            const win = new Window()
                            
                            // win.icon.src = app.icon
                            // win.title.innerText = app.name
                            
                            const iframe = document.createElement('iframe')
                            
                            iframe.src = url.value
                            iframe.style.cssText = `
                                    flex: 1;
                                    border: none;
                                `
                            win.append(iframe)
                        }
                    })
                }
                
                root.append(url, btn)
                win.append(root)
            }
        }
    ])
}

function contextmenu(x, y, options) {
    const contextmenu = document.createElement('div')
    
    contextmenu.classList.add('contextmenu')
    contextmenu.style.left = x + 'px'
    contextmenu.style.top = y + 'px'
    
    options.forEach(option => {
        const item = document.createElement('div')
        item.innerText = option.title
        contextmenu.append(item)
        contextmenu.onclick = () => {
            contextmenu.remove()
            option.click()
        }
    })
    
    document.body.append(contextmenu)
}