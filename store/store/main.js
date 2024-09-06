const win = new Window()

win.icon.src = '/store/store/icon.png'
win.title.innerText = 'Store'

async function main() {
    const applist = await (await fetch('store/apps.json')).json()
    const root = document.createElement('div')
    
    root.style.cssText = `width: 100%;`
    
    applist.forEach(async appid => {
        const appdata = await (await fetch(`store/${appid}/entry.json`)).json()
        const app = document.createElement('div')
        const icon = new Image(30, 30)
        const name = document.createElement('span')
        const button = getButton(appdata, appid)
        
        app.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            transition: .5s;
            padding: 5px;
            border-radius: 5px;
            box-sizing: border-box;
        `
        
        icon.src = appdata.icon

        name.innerText = appdata.name
        name.style.cssText = `flex: 1;`
        
        app.onclick = () => appInfo(appdata)
        
        app.onmouseenter = () => app.style.background = 'hsla(0, 0%, 100%, .3)'
        app.onmouseleave = () => app.style.background = 'transparent'
        
        app.append(icon, name, button[0])
        root.append(app)
    })
    
    win.append(root)
}

function getButton(details, id) {
    if(!isInstalled(details.name)) {
        const btn = createButton('Install', async () => {
            const code = await (await fetch(`store/${id}/main.js`)).text()
            
            fs.write(`/apps/${details.name}.json`, JSON.stringify(details))
            fs.write(details.file, code)
            
            btn.replaceWith(getButton(details, id))
        })
        
        return btn
    }
    
    if(hasUpdate(details)) {
        const btn = createButton('Update', async () => {
            const code = await (await fetch(`store/${id}/main.js`)).text()
        
            fs.write(`/apps/${details.name}.json`, JSON.stringify(details))
            fs.write(details.file, code)
            
            btn.replaceWith(getButton(details, id))
        })
        
        return btn
    }
    
    return createButton('Open', () => run(`/${details.name}.js`))
}

function createButton(name, click) {
    const btn = $(`<button class="ripple">${name}</button>`)
    
    btn.css({
        background: 'hsl(215deg, 100%, 50%)',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        transition: '.5s',
        'border-radius': 'calc(1ch + 5px)'
    })
    
    btn.on('mouseenter', () => btn.css('background', 'hsl(215deg, 100%, 60%)'))
    btn.on('mouseleave', () => btn.css('background', 'hsl(215deg, 100%, 50%)'))
    btn.on('click', ev => {
        ev.stopPropagation()
        click()
    })
    
    return btn
}

function isInstalled(name) {
    return fs.exist(Path.join('/apps/', name + '.json'))
}

function hasUpdate(details) {
    const entry = JSON.parse(fs.read(`/apps/${details.name}.json`))
    return details.version != entry.version
}

main()

function appInfo(details) {
    const win = new Window()
    
    win.icon.src = '/store/store/icon.png'
    win.title.innerText = 'Store'
    
    if(isInstalled(details.name)) win.append(createButton('Uninstall', uninstall.bind(details))[0])
}

function uninstall() {
     fs.delete(`/apps/${this.name}.json`)
}