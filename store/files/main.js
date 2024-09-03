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

list('/', root, win)

win.append(root)

function update() {
    const list = fs.list(path)
    
    if (list.length == 0) {
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