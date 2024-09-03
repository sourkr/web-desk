const applications = [
    {
        icon: 'browser.webp',
        name: 'Browser',
        start: startBrowser
    }, {
        icon: 'file-manager.png',
        name: 'File Manager',
        start: startFiles
    }
]

function startBrowser(app) {
    const win = new Window(600, 400)

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
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
    `
    
    searchBar.onchange = () => {
        let url = searchBar.value
        iframe.src = url
    }
    
    root.append(searchBar, iframe)
    win.append(root)
}

function startFiles(app) {
    const win = new Window()

    win.icon.src = app.icon
    win.title.innerText = app.name

    const root = document.createElement('div')
    
    root.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `
    
    list('/', root, win)

    win.append(root)
}

function list(path, root, win) {
    const list = fs.list(path)
    
    if(list.length == 0) {
        root.innerText = 'No Files'
        return
    }
    
    const size = 80
    const width = win.width - 10
    const cols = Math.floor(width / size)
    const coltemp = `repeat(${cols}, ${size}px)`
    
    root.style.display = 'grid'
    root.style.gridTemplateColumns = coltemp
    root.style.alignItems = 'start'
    root.style.justifyContent = 'start'
    
    list.forEach(filename => {
        const doc = document.createElement('div')
        const icon = new Image(40, 40)
        const name = document.createElement('span')
        
        doc.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
        `
        
        icon.src = 'file.png'
        name.innerText = filename
        
        doc.append(icon, name)
        root.append(doc)
    })
}