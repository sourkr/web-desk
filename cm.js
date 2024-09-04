class ContextMenu {
    constructor() {
        this.root = new $('div')
        this.root.class.add('context-menu')
    }
    
    group() {
        return new ContextMenuGroup(this.root)
    }
    
    showAt(x, y, anchor = 'top-left') {
        const a = anchor.split('-')
        
        this.root.css(a[1], x + 'px')
        this.root.css(a[0], y + 'px')
        
        $(document.body).append(this.root)
    }
}

class ContextMenuGroup {
    constructor(menu) {
        this.group = menu.append(new $('div'))
    }
    
    add(icon, name, click) {
        const item = this.group.append(new $('div'))
        const img = new Image(24, 24)
        const title = new $('span')
        
        img.src = icon
        title.text = name
        item.on('click', click)
        
        item.append(img, title)
    }
}

function $(selector) {
    if(selector instanceof Node) return new Query([selector])
    if(selector instanceof Query) return selector
    if(!this || this == window) return new Query(document.querySelectorAll(selector))
    return $(document.createElement(selector))
}

class Query {
    constructor(elements) {
        this.elements = elements
    }
    
    forEach(cb) {
        for(let i = 0; i < this.elements.length; i++)
            cb(this.elements[i])
    }
    
    append(...childs) {
        childs.forEach(child => {
            if(child instanceof Query) this.element.append(...child.elements)
            else this.element.append(child)
        })
        
        
        return $(childs[0])
    }
    
    css(...pairs) {
        for(let i = 0; i < pairs.length; i += 2) {
            this.forEach(e => e.style.setProperty(pairs[i], pairs[i + 1]))
        }
    }
    
    on(event, listener) {
        this.forEach(e => e.addEventListener(event, listener))
    }
    
    set text(val) {
        this.forEach(e => e.innerText = val)
    }
    
    get element() {
        return this.elements[0]
    }
    
    get class() {
        return new ClassList(this)
    }
}

class ClassList {
    constructor(list) {
        this.list = list
    }
    
    add(name) {
        this.list.forEach(e => e.classList.add(name))
    }
}