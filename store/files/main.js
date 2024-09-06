const win = new Window()
const root = $('<div></div>')
const toolbar = createToolbar()
const files = $('<div></div>')
const stack = []
const mode = process.argv[1] || 'normal'

win.icon.src = 'store/files/icon.png'
win.title.innerText = 'File Manager'

root.css({
    display: 'flex',
    width: '100%',
    height: '100%',
    'flex-direction': 'column'
})

update('/')

root.append(toolbar, files)
win.append(root[0])

root.on('contextmenu', ev => {
    if(ev.target != root[0] && ev.target != files[0]) return
    
    const menu = new ContextMenu()
    const group = menu.group()
    
    group.add(new FontIcon('note_add'), 'Create New File', () => {
        const win = new Window()
        const name = $('<input/>')
        
        win.icon.src = 'store/files/icon.png'
        win.title.innerText = 'File Manager'
        win.append(name[0])
        
        name.on('change', () => {
            fs.write(Path.join(stack.at(-1), name.val()))
            win.close()
        })
    })
    
    menu.showAt(ev.pageX, ev.pageY)
})

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
    
    toolbar.children('input').val(path)
    stack.push(path)
}

function listDir(list, path) {
    list.forEach(filename => {
        const fstat = fs.fstat(Path.join(path, filename))
        if(fstat.isFile()) return
        
        const item = createItem(getIcon('dir.png'), filename)
        
        item.on('click', () => update(Path.join(path, filename)))
        
        files.append(item)
    })
}

function listFile(list, path) {
    list.forEach(filename => {
        const fstat = fs.fstat(Path.join(path, filename))
        if (!fstat.isFile()) return
    
        const item = createItem(getIcon('file.png'), filename)
        
        item.on('click', () => {
            if(filename.endsWith('.js'))
                run(Path.join(path, filename))
            else
                run('/File Editor.js', Path.join(path, filename))
        })
        
        item.on('contextmenu', ev => {
            const menu = new ContextMenu()
            
            menu.group().add(new FontIcon('file_open'), 'Open With File Editor', () => {
                run('/File Editor.js', Path.join(path, filename))
            })
            
            menu.showAt(ev.pageX, ev.pageY)
            ev.preventDefault()
        })

        files.append(item)
    })
}

function getIcon(name) {
    return `/store/files/icon/${name}`
}

function createItem(icon, name) {
    const item = $(`<div class="ripple">
        <img src="${icon}" width="40">
        <span>${name}</span>
    </div>`)
    
    item.css({
        display: 'flex',
        'flex-direction': 'column',
        gap: '10px',
        'align-items': 'center',
        'padding-top': '10px',
        overflow: 'hidden'
    })
    
    return item
}

function createToolbar() {
    const toolbar = $(`<div>
        <span id="back" class="ripple material-symbols-rounded">arrow_back_ios_new</span>
        <input/>
    </div>`)
    
    toolbar.css({
        display: 'flex',
        gap: '5px',
        'align-items': 'center'
    })
    
    toolbar.children('#back').css({
        'font-size': '1rem',
        'padding': '5px'
    })
    
    toolbar.children('input').css({
        border: 'none',
        outline: 'none',
        flex: 1,
        'border-radius': '2ch',
        'padding-inline': '5px'
    })
    
    toolbar.children('#back').on('click', () => {
        stack.pop()
        update(stack.at(-1))
    })
    
    toolbar.children('input').on('change', () => {
        update(toolbar.children('input').val())
    })
    
    return toolbar
}