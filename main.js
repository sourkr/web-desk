const desktop = document.querySelector('desktop')
const startBtn = document.querySelector('#start')
const startMenu = document.querySelector('start-menu')


startBtn.onclick = () => {
    if(startMenu.style.display == 'block')
        startMenu.style.display = 'none'
    else {
        startMenu.style.display = 'block'
        startMenu.innerHTML = ''
        
        applications.forEach(app => {
            const icon = new Image(24, 24)
            const name = document.createElement('span')
            const item = document.createElement('div')
        
            icon.src = app.icon
            name.innerText = app.name
        
            item.onclick = app.start.bind(app, app)
        
            item.append(icon, name)
            startMenu.appendChild(item)
        })
        
        fs.list('apps').forEach(file => {
            const app = JSON.parse(fs.read(`/apps/${file}`))
            const icon = new Image(24, 24)
            const name = document.createElement('span')
            const item = document.createElement('div')
            
            icon.src = app.icon
            name.innerText = app.name
            
            item.onclick = () => eval(fs.read(app.file))
            
            item.append(icon, name)
            startMenu.appendChild(item)
        })
    }
}

document.querySelector('start-menu').style.bottom = (startBtn.getBoundingClientRect().height + 10) + 'px'

window.onclick = ev => {
    if(startBtn.contains(ev.target)) return

    if(startMenu.style.display == 'block' && !startMenu.contains(ev.target)) {
        ev.preventDefault()
        startMenu.style.display = 'none'
    }
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

// startFiles()