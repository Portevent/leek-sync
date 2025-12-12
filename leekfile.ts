class LeekFile{
    public name: string
    public id: number
    public timestamp: number
    public code: string = "";
    public folder: boolean = true;

    constructor(name: string, id: number, timestamp: number){
        this.name = name;
        this.id = id;
        this.timestamp = timestamp;
    }
}

class LeekScript extends LeekFile{
    hash: string
    code: string

    constructor(name: string, id: number, code: string, timestamp: number){
        super(name, id, timestamp);
        this.hash = this.getHash(code);
        this.code = code;
    }

    getHash(code: string) : string{
        return "";
    }
}

class LeekFolder extends LeekFile{

    constructor(name: string, id: number){
        super(name, id, 0);
        this.folder = true;
    }
}