if(!fs.exists('/settings')) fs.mkdir('/settings')
if(!fs.exists('/settings/desktop.json')) fs.write('/settings/desktop.json', '{}')

const prefrences = JSON.parse(fs.read('/settings/desktop.json'))
const win = new Window()
const root = $(`<div>
    <lable for="wallpaper">Wallpaper</lable>
    
    <select id="wallpaper">
        <option value="default">Default</option>
        <option value="custom">Custom</option>
    </select>
    
    Custom: <button>Choose</button> <span></span>
</div>`).appendTo(win.window)

$(win.title).text('Desktop Preferences')

root.find('#wallpaper').on('change', () => {
    prefrences.wallpaper = root.find('#wallpaper').val()
    fs.write('/settings/desktop.json', JSON.stringify(prefrences))
    refresh()
})

root.find('button').on('click', () => {
    const channel = Channel.create(path => {
        Channel.destroy(channel)
        root.find('span').text(path)
        prefrences.file = path
        fs.write('/settings/desktop.json', JSON.stringify(prefrences))
        refresh()
    })
    
    run('/File Manager.js', 'open', channel + '')
})