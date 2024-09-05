const windows = new Set()

const def = {
    width: 400,
    height: innerHeight / 2
}

if(innerWidth < def.width) def.width = 300

class Window {
    constructor(width = def.width, height = 300) {
        this.createFrame(width, height)
        
        this.y = innerHeight / 2 - this.height / 2
        this.x = innerWidth / 2 - this.width / 2
        
        windows.add(this)
    }
    
    createFrame(width, height) {
        this.frame = $(`<div class="frame"></div>`).appendTo($('desktop'))
        
        this.width = width
        this.height = height
        
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
            <span id="close" class="material-symbols-rounded ripple">close</span>
        `
        
        this.titlebar.append(this.icon, this.title, this.icons)
        this.frame.append(this.titlebar, this.window)
        
        const observer = new Observer($(this.title))
        
        observer.onmove = dpos => {
            this.y += dpos.y
            this.x += dpos.x
        }
        
        const resizer = new Observer(this.frame)
        
        resizer.onstart = pos => {
            const rect = this.frame[0].getBoundingClientRect()
            const right = rect.right + 10
        
            if (pos.y > rect.bottom - 5 && pos.y < rect.bottom) return 1
            if (pos.x > right - 100 && pos.x < right) return 2
        
            return 0
        }
        
        resizer.onmove = (pos, type) => {
            if (type == 1) this.height += pos.y
            if (type == 2) this.width += pos.x
        }
        
        this.observer = observer
        this.resizer = resizer
        this.icons.children[2].onclick = () => this.close()
    }

    append(child) {
        this.window.append(child)
    }
    
    close() {
        this.observer.remove()
        this.resizer.remove()
        this.frame.remove()
        windows.delete(this)
    }

    set width(px) {
        this.frame.css('width', px + 'px')
    }
    
    set height(px) {
        this.frame.css('height', px + 'px')
    }

    get width() {
        return parseFloat(this.frame.css('width'))
    }
    
    get height() {
        return parseFloat(this.frame.css('height'))
    }

    set y(px) {
        this.frame.css('top', px + 'px')
    }

    set x(px) {
        this.frame.css('left', px + 'px')
    }

    get y() {
        return this.frame.offset().top
    }

    get x() {
        return this.frame.offset().left
    }
}
