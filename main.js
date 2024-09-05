$('#start').on('click', () => {
    const menu = new ContextMenu()
    
    let group = menu.group()
    
    fs.list('apps').forEach(file => {
        const app = JSON.parse(fs.read(`/apps/${file}`))
        group.add(new ImageIcon(app.icon), app.name, () => run(app.file))
    })
    
    menu.showAt(6, 36, 'bottom-left')
})



function run(...argv) {
    const code = fs.read(argv[0])
    const process = { argv }
    
    // console.log(code)
    eval(code)
}

function ImageIcon(src) {
    const image = new Image()
    image.src = src
    
    image.setSize = s => {
        image.width = s
        image.height = s
    }
    
    return image
}

function FontIcon(code) {
    const span = new $('span')
    
    span.class.add('material-symbols-rounded')
    span.text = code
    
    span.setSize = s => {
        span.css('font-size', s + 'px')
    }
    
    return span
} 