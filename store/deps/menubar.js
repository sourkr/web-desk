exports.default = class MenuBar {
    constructor() {
        this.menu = new ContextMenu()
        this.bar = $(`<div><span id="file">File</span></div>`)
        
        const fileTab = this.bar.children('#file')
        
        fileTab.on('click', () => {
            console.log('click')
            this.menu.showAt(fileTab.offset().left, fileTab.offset().top + fileTab.width())
        })
    }
    
    group() {
        return this.menu.group()
    }
}