const a = (...args) => postMessage(args) // postMessage

const b = (...data) => new Promise((resolve, reject) => {
    a(2, ...data)
    c = resolve
})

let c = () => {}

onmessage = ({ data }) => {
    switch (data[0]) {
        case 2: return eval(data[1])
        case 3: c(data[1])
    }
}
