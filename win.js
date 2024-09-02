class Window {
    constructor(width = 300, height = 200) {
        this.frame = document.createElement('div')
        
        this.frame.classList.add('frame')
        this.width = width
        this.height = height

        desktop.appendChild(this.frame)
        
        this.frame.style.top = `${innerHeight/2 - this.height/2}px`
        this.frame.style.left = `${innerWidth/2 - this.width/2}px`

        this.titlebar = document.createElement('div')
        this.window = document.createElement('div')

        this.titlebar.classList.add('titlebar')
        this.window.classList.add('window')

        this.icon = new Image(20, 20)
        this.title = document.createElement('span')
        this.icons = document.createElement('span')
        
        this.title.classList.add('title')
        this.icons.classList.add('icons')

        this.icons.innerHTML = `
            <span class="material-symbols-rounded">minimize</span>
            <span class="material-symbols-rounded">crop_square</span>
            <span class="material-symbols-rounded">close</span>
        `

        this.titlebar.append(this.icon, this.title, this.icons)
        this.frame.append(this.titlebar, this.window)
        
        const observer = new Observer(this.title)
        
        observer.onmove = dpos => {
            this.y += dpos.y
            this.x += dpos.x
        }
    }

    append(child) {
        this.window.append(child)
    }

    set width(px) {
        this.frame.style.width = px + 'px'
    }
    
    set height(px) {
        this.frame.style.height = px + 'px'
    }

    get width() {
        return parseFloat(this.frame.style.width)
    }
    
    get height() {
        return parseFloat(this.frame.style.height)
    }

    set y(px) {
        this.frame.style.top = px + 'px'
    }

    set x(px) {
        this.frame.style.left = px + 'px'
    }

    get y() {
        return parseFloat(this.frame.style.top)
    }

    get x() {
        return parseFloat(this.frame.style.left)
    }
}
