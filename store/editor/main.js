const MenuBar = require('menubar').default

const win = new Window()

win.icon.src = '/store/editor/icon.png'
win.title.innerText = 'File Editor'

const root = $(`<div>
    <textarea></textarea>
</div>`)

const textarea = root.find('textarea')
const menubar = new MenuBar()

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

textarea.before(menubar.bar)

const openGroup = menubar.group()
const saveGroup = menubar.group()

openGroup.add(new FontIcon('file_open'), 'Open New File', () => {
    const channel = Channel.create(path => {
        edit(path)
        Channel.destroy(channel)
    })

    run('/File Manager.js', 'open', channel + '')
})

saveGroup.add(new FontIcon('save'), 'Save', save)
saveGroup.add(new FontIcon('save_as'), 'Save As', saveAs)

if(process.argv[1] && fs.exists(process.argv[1])) {
    opened = process.argv[1]
    textarea.val(fs.read(process.argv[1]))
}

textarea.on('keydown', ev => {
    if(ev.ctrlKey && ev.key == 's') {
        ev.preventDefault()
        save()
    }
    
    if(ev.key == 'Tab') {
        const index = textarea.prop('selectionStart')
        textarea.val(textarea.val().slice(0, index) + '\t' + textarea.val().slice(index))
        ev.preventDefault()
    }
})

win.append(root[0])

function edit(path) {
    $(win.title).text(path)
    textarea.val(fs.read(path))
    opened = path
}

function write(path) {
    fs.write(path, textarea.val())
    opened = path
}

function save() {
    if(opened) we(opened)
    else saveAs()
}

function saveAs() {
    const channel = Channel.create(path => { write(path); Channel.destroy(channel) })
    run('/File Manager.js', 'open', channel + '')
}