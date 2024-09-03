const win = new Window()

win.icon.src = 'store/youtube/icon.png'
win.title.innerText = 'Youtube'

const iframe = document.createElement('iframe')

iframe.src = 'https://youtube.com'
iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
`

win.append(iframe)