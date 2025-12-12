class LeekSyncClient{

    nodeLeekClient: NodeLeekClient
    path: string;

    leekwarsFiles: leekFileSystem;
    localFiles: leekFileSystem;


    constructor(login: string, password: string, path: string){
        this.nodeLeekClient = new NodeLeekClient();
        this.path = path;
        this.start();
    }

    private async start(){
        this.leekwarsFiles, this.localFiles = await this.loadCachedFS();
        await this.nodeLeekClient.login(this.login, this.password);

        // Fetch leekwars file to ensure our filesystem is up to date since last session
        await this.updateLeekwarsFiles();
    }

    private async updateLeekwarsFiles(){
        
        // Get an updated list of leekwars files
        const newLeekwarsFiles = this.nodeLeekClient.getFiles();

        // Remove in leekwarsFiles all files that aren't present in leekwars anymore
        this.leekwarsFiles.getNames().forEach(filename => {
            if (filename in newLeekwarsFiles) return;
            delete this.leekwarsFiles[filename];
        })

        // fetchAllFiles in leekwars and update leekwarsFiles accordingly (note: use leekwarsFiles to get timestamp on files previously fetched)
        const filesToFetch : {[id: number]: string} = {};
        const fetchRequest = [];
        newLeekwarsFiles.forEach(([name: string, fileId: number]) => {
            if (this.isFolder(name)) {
                this.leekwarsFiles[name] = new LeekFolder(name, fileId);
            }else{
                filesToFetch[fileId] = name;
                fetchRequest.push([fileId, this.leekwarsFiles[name]?.timestamp ?? 0])
            }
        });

        (await this.nodeLeekClient.fetchFiles(fetchRequest)).forEach(aiCode => {
            const name = filesToFetch[aiCode.id];
            this.leekwarsFiles[name] = new LeekScript(name, aiCode.id, aiCode.code, aiCode.modified);
        });
    }

    private async fetchLeekwarsFiles(){
    }
}