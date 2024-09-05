const listners = []
let moving = null

class Observer {
    constructor(ele) {
        this.ele = ele
        
        this.handleTouch()
        listners.push(this)
    }

    handleTouch() {
        let moving = null
        let res = 0
        
        this.ele.on('touchstart', ev => {
            const touch = ev.touches[0]
            const pos = new Vec2(touch.clientX, touch.clientY)
            console.warn(touch, touch.screenX == touch.clientX)
            if((res = this.onstart(pos)) == 0) return
            
            moving = pos
        })
        
        this.ele.on('touchmove', ev => {
            if(moving == null) return
            
            const touch = new Vec2(
                ev.touches[0].clientX,
                ev.touches[0].clientY
            )
            
            const d = touch.sub(moving)

            moving = touch
            this.onmove(d, res)
        })

        this.ele.on('touchend', () => moving = null)
        this.ele.on('touchcancle', () => moving = null)
    }

    onmove() {}
    onstart() {
        return 1
    }
    
    remove() {
        listners.splice(listners.indexOf(this), 1)
    }
}

class Vec2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y)
    }
}

$(window).on('mousedown', ev => {
    for(let win of listners) {
        if(ev.target === win.ele[0]) {
            // console.log(win)
            const pos = new Vec2(ev.clientX, ev.clientY)
            const res = win.onstart(pos)
            if(res == 0) return
            moving = { win, pos, res }
        }
    }
})

$(window).on('mousemove', ev => {
    if(!moving) return

    const pos = new Vec2(ev.clientX, ev.clientY)
    const dpos = pos.sub(moving.pos)

    moving.win.onmove(dpos, moving.res)
    moving.pos = pos
})

$(window).on('mouseup', () => moving = null)

// window.addEventListener('touchstart', ev => {
//     console.log(ev.target)
// })