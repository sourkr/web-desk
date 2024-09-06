const win = new Window()

win.icon.src = '/store/editor/icon.png'
win.title.innerText = 'File Editor'

const root = $(`<div>
    <div id="menu-bar">
        <span id="file">File</span>
    </div>
    <textarea></textarea>
</div>`)

const fileTab = root.find('#file')
const textarea = root.find('textarea')

let opened = null

root.css({
    width: '100%',
    height: '100%',
    display: 'flex',
    'flex-direction': 'column'
})

textarea.css({
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    resize: 'none'
})

fileTab.on('click', () => {
    const menu = new ContextMenu()
    const group = menu.group()
    
    group.add(new FontIcon('file_open'), 'Open New File', () => {
        const channel = Channel.create(path => {
            edit(path)
            Channel.destroy(channel)
        })
        
        run('/File Manager.js', 'open', channel + '')
    })
    
    menu.showAt(fileTab.offset().left, fileTab.offset().top + fileTab.outerHeight())
})


if(process.argv[1] && fs.exist(process.argv[1])) {
    opened = process.argv[1]
    textarea.val(fs.read(process.argv[1]))
}

textarea.on('keydown', ev => {
    if(ev.ctrlKey && ev.key == 's') {
        ev.preventDefault()
        if(opened) fs.write(opened, textarea.val())
    }
})

win.append(root[0])


function edit(path) {
    $(win.title).text(path)
    textarea.val(fs.read(path))
    opened = path
}