class LeekFile{
    protected name: string
    protected id: number
    protected timestamp: number

    constructor(name: string, id: number, timestamp: number){
        this.name = name;
        this.id = id;
        this.timestamp = timestamp;
    }
}

class LeekScript extends LeekFile{
    hash: string

    constructor(name: string, id: number, code: string, timestamp: number){
        super(name, id, timestamp);
        this.hash = this.getHash(code);
    }

    getHash(code: string) : string{
        return "";
    }
}

class LeekFolder extends LeekFile{

}