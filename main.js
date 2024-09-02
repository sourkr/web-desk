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

startBtn.onclick = () => {
    if(startMenu.style.display == 'block')
        startMenu.style.display = 'none'
    else startMenu.style.display = 'block'
}

window.onclick = ev => {
    if(startBtn.contains(ev.target)) return

    if(startMenu.style.display == 'block' && !startMenu.contains(ev.target)) {
        ev.preventDefault()
        startMenu.style.display = 'none'
    }
}


function startBrowser(app) {
    const win = new Window()
    
    win.icon.src = app.icon
    win.title.innerText = app.name

    const iframe = document.createElement('iframe')

    //iframe.src = 'https://www.google.com/webhp?igu=1'
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
    `
    
    win.append(iframe)

    console.log(win)
}

