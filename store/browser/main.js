const win = new Window(600, 400)

win.icon.src = '/store/browser/icon.webp'
win.title.innerText = 'Web Browser'

const root = document.createElement('div')
const searchBar = new $('input')
const iframe = document.createElement('iframe')

searchBar.css('border', 'none')

iframe.src = 'https://www.google.com/webhp?igu=1'
iframe.style.cssText = `
        flex: 1;
        border: none;
    `

root.style.cssText = `
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
    `

searchBar.onchange = () => {
    let url = searchBar.value
    iframe.src = url
}

iframe.onload = () => {
    searchBar.element.value = iframe.contentWindow.location
}

root.append(searchBar.element, iframe)
win.append(root)