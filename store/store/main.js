const win = new Window()

win.icon.src = '/store/store/icon.png'
win.title.innerText = 'Store'

async function main() {
    const applist = await (await fetch('store/apps.json')).json()
    const root = document.createElement('div')
    
    root.style.cssText = `
        width: 100%;
        height: 100%;
        overflow-y: scroll;
    `
    
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
        
        app.onclick = ev => {
            if(ev.target != app && ev.target != icon) return
            appInfo(appdata, appid)
        }
        
        app.onmouseenter = () => app.style.background = 'hsla(0, 0%, 100%, .3)'
        app.onmouseleave = () => app.style.background = 'transparent'
        
        app.append(icon, name, button[0])
        root.append(app)
    })
    
    win.append(root)
}

function getButton(details, id) {
    if(!isInstalled(details.name)) {
        const btn = createButton('Install')
        btn.one('click', install.bind(null, details, id, btn))
        return btn
    }
    
    if(hasUpdate(details)) {
        const btn = createButton('Update')
        
        btn.one('click', async () => {
            await update(details, id)
            btn.text('Open')
            btn.on('click', run.bind(null, details.file))
        })
        
        return btn
    }
    
    return createButton('Open', run.bind(null, details.name))
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

function appInfo(details, id) {
    const win = new Window()
    
    win.icon.src = '/store/store/icon.png'
    win.title.innerText = 'Store'
    
    if(isInstalled(details.name)) {
        const btn = createButton('Uninstall')
        
        console.log(btn, btn.get(0))
        win.append(btn.get(0))
        
        btn.one('click', () => {
            uninstall(details, id, btn)
            btn.text('Install')
            // btn.one('click')
        })
    }
}

function uninstall(details, id, btn) {
    fs.delete(`/apps/${this.name}.json`)
    fs.delete(details.file)
    
    btn.text('Install')
    btn.one('click', install.bind(null, details, id, btn))
}

async function install(details, id, btn, win) {
    const code = await (await fetch(`store/${id}/main.js`)).text()
    
    fs.write(`/apps/${details.name}.json`, JSON.stringify(details))
    fs.write(details.file, code)
    
    btn.text('Open')
    btn.on('click', () => run(details.file))
    
    if(win) {
        const btn = createButton('Uninstall')
        win.append(btn.get(0))
        btn.one('click', uninstall.bind(null, details, btn))
    }
}

async function update(details, id) {
    const code = await (await fetch(`store/${id}/main.js`)).text()
    
    fs.write(`/apps/${details.name}.json`, JSON.stringify(details))
    fs.write(details.file, code)
}