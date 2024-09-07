const menus = new Set()

class ContextMenu {
    constructor(parent) {
        this.parent = parent
        this.root = $('<div class="context-menu"></div>')
    }
    
    group() {
        return new ContextMenuGroup(this)
    }
    
    showAt(x, y, anchor = 'top-left') {
        const a = anchor.split('-')
        
        this.root.css(a[1], x + 'px')
        this.root.css(a[0], y + 'px')
        
        $('body').append(this.root)
        menus.add(this)
    }
    
    hide(selfOnly) {
        this.root.remove()
        menus.delete(this)
        
        if(this.parent && !selfOnly) this.parent.hide()
    }
}

class ContextMenuGroup {
    constructor(menu) {
        this.menu = menu
        this.group = $('<div></div>').appendTo(menu.root)
    }
    
    add(icon, name, click) {
        const item = $('<div class="ripple"></div>').appendTo(this.group)
        const title = $(`<span>${name}</span>`)
        
        icon.setSize(24)
        
        item.on('click', () => {
            if(!click()) this.menu.hide()
        })
        
        item.append(icon, title)
        
        return item
    }
    
    sub(icon, name) {
        const menu = new ContextMenu(this.menu)
        
        const item = this.add(icon, name, () => this.showSub(item, menu))
        
        // item.on('mouseenter', () => this.showSub(item, menu))
        
        return menu
    }
    
    showSub(item, menu) {
        const rect = item[0].getBoundingClientRect()
        
        this.menu.sub?.hide?.(true)
        menu.showAt(rect.right + 5, rect.top)
        this.menu.sub = menu
        
        return true
    }
    
    remove(sub) {
        this.susb
    }
}

function ripple(ele, ev) {
    const rippe = $('<span></span>').appendTo(ele)
    const size = 4 * Math.max(ele.width(), ele.height())
    
    ele.css('position', 'relative').css('overflow', 'hidden')
    
    rippe.css({
        position: 'absolute',
        background: 'hsl(0 0 50 / .5)',
        'border-radius': '50%',
        width: size + 'px',
        height: size + 'px',
        top: (ev.pageY - ele.offset().top - size / 2) + 'px',
        left: (ev.pageX - ele.offset().left - size / 2) + 'px',
        // transition: '.5s',
        scale: 0,
        opacity: 1,
        'transition-property': 'scale opacity',
    })
    
    requestAnimationFrame(() => {
        rippe.css('transition', '.5s')
            .css('scale', '1')
            .css('opacity', '0')
    })
    
    setTimeout(() => rippe.remove(), 500)
}

let preventClick = false

$(window).on('mousedown', ev => {
    let prevent = menus.size != 0
    
    for(let menu of menus) {
        if($.contains(menu.root[0], ev.target))
            prevent = false
    }
    
    if(prevent) {
        menus.forEach(menu => menu.hide())
        ev.preventDefault()
        ev.stopImmediatePropagation()
        preventClick = true
        return
    }
    
    if($(ev.target).hasClass('ripple')) ripple($(ev.target), ev)
    else {
        const parent = $(ev.target).parent('.ripple')
        // console.log(parent)
        if(parent.length) ripple(parent, ev)
    }
})

window.addEventListener('click', ev => {
    if(preventClick) {
        ev.preventDefault()
        ev.stopImmediatePropagation()
        preventClick = false
    }
}, true)