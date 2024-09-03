const desktop = document.querySelector('desktop')
const startBtn = document.querySelector('#start')
const startMenu = document.querySelector('start-menu')

const applications = [
    {
        icon: 'browser.webp',
        name: 'Browser',
        start: startBrowser
    }
]


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


function startBrowser(app) {
    const win = new Window(600, 300)
    
    win.icon.src = app.icon
    win.title.innerText = app.name
    
    const root = document.createElement('div')
    const searchBar = document.createElement('input')
    const iframe = document.createElement('iframe')

    iframe.src = 'https://www.google.com/webhp?igu=1'
    iframe.style.cssText = `
        flex: 1;
        border: none;
    `
    
    root.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
    `
    
    
    root.append(searchBar, iframe)
    win.append(root)

    console.log(win)
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