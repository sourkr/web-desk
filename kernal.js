class Kernal {
    static #KEY = Symbol('kernal-key')
    static #GUI = Symbol('gui-key')
    
    static #proc = new IDList()
    
    static startProcess(path) {
        const worker = new Worker('worker.js')
        const gui = { wins: new IDList() }
        
        const pid = #proc.add({
            name: path,
            [Kernal.#KEY]: worker,
            [Kernal.#GUI]: wins 
        })
        
        let kill = true
        
        worker.onmessage = ({ data }) => {
            switch (data[0]) {
                case 0: // exit
                    if(data[1] == -1 && !kill) return
                    this.killProcess(pid)
                    break;
                    
                case 1: { // gui
                    const ret = guiCall(gui, ...data)
                    worker.postMessage([3, ret)
                }
            }
        }
        
        return pid
    }
    
    static listProcesses() {
        return this.#proc.keys()
    }
    
    static getProcess(pid) {
        return this.#proc.get(pid)
    }
    
    static killProcess(pid) {
        this.#proc.get(pid)[this.#KEY].terminate()
    }
}

function guiCall(obj, type, ...args) {
    switch(type) {
        case 1: return obj.wins.add(new Window())
    }
}