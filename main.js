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

function panel() {
    setInterval(() => {
        const date = new Date()
        const min = `${date.getMinutes()}`.padStart(2, '0')
        
        $('#date').text(`${date.getHours()}:${min}`)
    }, 1000)
}

function refresh() {
    if(!fs.exists('/settings/desktop.json')) return
    
    const prefrences = JSON.parse(fs.read('/settings/desktop.json'))
    
    if(prefrences.wallpaper == 'default') {
        $('body').css('background-image', 'url(wallpaper.jpg)')
        return
    }
    
    if(!fs.exists(prefrences.file)) return
    $('body').css('background-image', `url(${fs.read(prefrences.file)})`)
}

function exec(file, out) {
    return new Promise((resolve, reject) => {
        const code = fs.read(file)
        const worker = new Worker('worker.js')
        
        worker.onmessage = ({ data }) => {
            switch (data[0]) {
                case 0:
                    worker.terminate()
                    resolve()
                    break
        
                case 1:
                    out(data[1])
                    break
                    
                case 2:
                    new Window()
            }
        }
        
        worker.postMessage([2, code])
    })
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
    const span = $(`<span class="material-symbols-rounded">${code}</span>`)
    span.setSize = s => span.css('font-size', s + 'px')
    return span
}

class IDList {
    #map = new Map()
    #avl = []
    #count = 0
    
    #next() {
        if(this.#avl.length) return this.#avl.shift()
        return this.#count++
    }
    
    add(val) {
        const id = this.#next()
        this.#map.set(id, val)
        return id
    }
    
    remove(id) {
        this.#map.delete(id)
        this.#avl.push(id)
    }
    
    get(id) {
        return this.#map.get(id)
    }
    
    keys() {
        return this.#map.keys()
    }
}

const channels = new IDList()

class Channel {
    static create(cb) {
        return channels.add(cb)
    }
    
    static send(id, data) {
        channels.get(id)(data)
    }
    
    static destroy(id) {
        channels.remove(id)
    }
}

function require(dep) {
    const exports = {}
    eval(fs.read(`/deps/${dep}.js`))
    return exports
}

refresh()
panel()