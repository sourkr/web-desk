const win = new Window()

win.icon.src = 'store/files/icon.png'
win.title.innerText = 'File Manager'

const root = $('<div></div>')
const bar = $('<input/>')
const files = $('<div></div>')

root.css({
    display: 'flex',
    width: '100%',
    'flex-direction': 'column'
})


bar.css({
    border: 'none',
    outline: 'none',
    'border-radius': '5px',
    padding: '0 5px'
})

update('/')

root.append(bar, files)
win.append(root[0])

function update(path) {
    const list = fs.list(path)
    const size = 80
    const count = Math.floor((win.width - 10) / size)
    
    files.empty()
    files.css({
        display: 'grid',
        'grid-template-columns': `repeat(${count},${size}px)`,
        // 'align-items': 'start',
        // 'justify-content': 'start',
        gridTemplateRows: 'fit-content(100%)'
    })
    
    listDir(list, path)
    listFile(list, path)
    
    bar.val(path)
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
        files.append(doc)
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
            if(filename.endsWith('.js'))
                eval(fs.read(Path.join(path, filename)))
            else
                run('/File Editor.js', Path.join(path, filename))
        }
        
        doc.oncontextmenu = ev => {
            const menu = new ContextMenu()
            
            menu.group().add(new FontIcon('file_open'), 'Open With File Editor', () => {
                run('/File Editor.js', Path.join(path, filename))
            })
            
            menu.showAt(ev.pageX, ev.pageY)
            ev.preventDefault()
        }

        doc.append(icon, name)
        files.append(doc)

    })
}

function getIcon(name) {
    return `/store/files/icon/${name}`
}
