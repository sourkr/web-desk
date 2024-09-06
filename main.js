$('#start').on('click', () => {
    const categories = new Map()
    const menu = new ContextMenu()
    const group = menu.group()
    
    categories.set('All Programs', new Set())
    
    fs.list('apps').forEach(file => {
        const entry = JSON.parse(fs.read(`/apps/${file}`))
        
        categories.get("All Programs").add(entry)
        
        entry.categories.forEach(category => {
            if(!categories.has(category)) categories.set(category, new Set())
            categories.get(category).add(entry)
        })
    })
    
    categories.forEach((entries, category) => {
        const sub = group.sub(new ImageIcon(`/icons/${category}.png`), category).group()
        
        entries.forEach(entry => {
            sub.add(new ImageIcon(entry.icon), entry.name, () => run(`/${entry.file}`))
        })
    })
    
    menu.showAt(6, 36, 'bottom-left')
})

function exec(file) {
    const code = fs.read(file)
    const worker = new Worker('worker.js')
    
    worker.onmessage = ({ data }) => {
        if(data[0] == 93) worker.terminate()
    }
    
    worker.postMessage([2, code])
}


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