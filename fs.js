const FS_NAME = 'webos'
const fds = new Map()

if(!localStorage.getItem(FS_NAME)) localStorage.setItem(FS_NAME, JSON.stringify({
    type: 'dir',
    files: {}
}))

const filesys = JSON.parse(localStorage.getItem(FS_NAME))

class FileSystem {
    exist(path) {
        return this.#file(path) != null
    }
        
    open(path) {
        const file = this.#file(path)
        if(file == null) return null
        let index = this.#index()
        fds.set(index, file)
        return index
    }
    
    list(path) {
        return Object.keys(this.#file(path).files)
    }
    
    #createFile(path) {
        const parent = this.#file(Path.parent(path))
        
        parent.files[Path.filename(path)] = {
            type: 'file',
            data: ''
        }
        
        this.#save()
    }
    
    mkdir(path) {
        const parent = this.#file(Path.parent(path))
        
        parent.files[Path.filename(path)] = {
            type: 'dir',
            files: {}
        }
        
        this.#save()
    }
    
    write(path, data) {
        if(!this.exist(path)) this.#createFile(path)
        
        this.#file(path).data = data
        this.#save()
    }
    
    read(path) {
        return this.#file(path).data
    }
    
    #save() {
        localStorage.setItem(FS_NAME, JSON.stringify(filesys))
    }
    
    #index() {
        let i = 0
        while(true) if(!fds.has(i)) return i
    }
    
    #file(path) {
        const segs = Path.segments(path)
        let doc = filesys
        
        for(let seg of segs) {
            if(doc.type != 'dir') return null
            if(!doc.files[seg]) return null
            
            doc = doc.files[seg]
        }
        
        return doc
    }
}

class Path {
    static segments(path) {
        return path.split('/').filter(Boolean)
    }
    
    static parent(path) {
        return this.segments(path)
            .slice(0, -1)
            .join('/')
    }
    
    static filename(path) {
        return this.segments(path).at(-1)
    }
}

const fs = new FileSystem()