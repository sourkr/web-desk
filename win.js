const def = {
    width: 400,
    height: innerHeight / 2
}

if(innerWidth < def.width) def.width = 300

class Window {
    constructor(width = def.width, height = 300) {
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
        
        const resizer = new Observer(this.frame)
        
        resizer.onstart = pos => {
            const rect = this.frame.getBoundingClientRect()
            const right = rect.right + 10
            console.log(rect)
            console.log(pos.x, right, pos.x > right - 10,pos.x < right)
            
            if(pos.y > rect.bottom - 5 && pos.y < rect.bottom) return 1
            if(pos.x > right - 100 && pos.x < right) return 2
            
            return 0
        }
        
        resizer.onmove = (pos, type) => {
            console.log(type)
            if(type == 1) this.height += pos.y
            if(type == 2) this.width += pos.x
        }
        
        this.icons.children[2].onclick = () => {
            observer.remove()
            resizer.remove()
            this.frame.remove()
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
    
    // set bottom(px) {
    //     this.frame.style.width = px + 'px'
    // }
    
    // get bottom() {
    //     return parseFloat(this.frame.style.width)
    // }
}
