const win = new Window()

win.icon.src = 'store.png'
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
        const install = document.createElement('button')

        app.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        `
        
        icon.src = appdata.icon
        icon.style.cssText = `padding: 5px;`
        
        name.innerText = appdata.name
        name.style.cssText = `flex: 1;`
        
        install.innerText = 'Install'
        
        install.onclick = async () => {
            const code = await (await fetch(`store/${appid}/main.js`)).text()
            
            fs.write(`/apps/${appdata.name}.json`, JSON.stringify(appdata))
            fs.write(appdata.file, code)
        }
        
        app.append(icon, name, install)
        root.append(app)
    })
    
    win.append(root)
}

function noext(path) {
    return Path.filename(path).split('.').filter(Boolean)[0]
}

main()