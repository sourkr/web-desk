const win = new Window(600, 400)

win.icon.src = '/store/browser/icon.webp'
win.title.innerText = 'Web Browser'

const root = document.createElement('div')
const searchBar = document.createElement('input')
const iframe = document.createElement('iframe')

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

root.append(searchBar, iframe)
win.append(root)