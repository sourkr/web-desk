const win = new Window()

win.icon.src = 'store/files/icon.png'
win.title.innerText = 'File Manager'

const root = document.createElement('div')

root.style.cssText = `
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

update('/', root, win)

win.append(root)

function update(path) {
    const list = fs.list(path)
    const size = 80
    const count = Math.floor((win.width - 10) / size)
    
    root.innerHTML = ''
    root.style.display = 'grid'
    root.style.gridTemplateColumns = `repeat(${count},${size}px)`
    root.style.alignItems = 'start'
    root.style.justifyContent = 'start'
    root.style.gridTemplateRows = 'fit-content(100%)'
    // root.style.gap = '10px'
    
    listDir(list, path)
    listFile(list, path)
}

function listDir(list, path) {
    list.forEach(filename => {
        const fstat = fs.fstat(Path.join(path, filename))
        if(fstat.isFile()) return
        
        const doc = document.createElement('div')
        const icon = new Image(40, 40)
        const name = document.createElement('span')
    
        doc.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding-top: 10px;
            overflow: hidden;
        `
    
        icon.src = getIcon('dir.png')
    
        name.innerText = filename
        name.style.cssText = `
            text-align: center;
            word-wrap: break-word;
        `
    
        doc.onclick = () => {
            update(Path.join(path, filename))
        }
    
        doc.append(icon, name)
        root.append(doc)
    })
}

function listFile(list, path) {
    list.forEach(filename => {
        const fstat = fs.fstat(Path.join(path, filename))
        if (!fstat.isFile()) return

        const doc = document.createElement('div')
        const icon = new Image(40, 40)
        const name = document.createElement('span')

        doc.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding-top: 10px;
            overflow: hidden;
        `

        icon.src = getIcon('file.png')

        name.innerText = filename
        name.style.cssText = `
            text-align: center;
            width: 80px;
            word-wrap: break-word;
        `

        doc.onclick = () => {
            eval(fs.read(Path.join(path, filename)))
        }

        doc.append(icon, name)
        root.append(doc)
    })
}

function getIcon(name) {
    return `/store/files/icon/${name}`
}

function gridItem(icon, name, click) {}