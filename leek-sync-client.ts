class LeekSyncClient{

    nodeLeekClient: NodeLeekClient
    path: string;

    leekwarsFilesystem: {[file: string]: LeekFile}= {}; // TODO : Renamme to chache ?
    localFilesystem: {[file: string]: LeekFile}= {};


    constructor(login: string, password: string, path: string){
        this.nodeLeekClient = new NodeLeekClient();
        this.path = path;
        this.start(login, password);
    }

    private async start(login: string, password: string){
        this.leekwarsFilesystem, this.localFilesystem = await this.loadCachedFS();
        await this.nodeLeekClient.login(login, password);

        // Fetch leekwars file to ensure our filesystem is up to date since last session
        await this.updateLeekwarsFiles();
        await this.updateLocalFiles();

        // Compare both local filesystem and assert that hash match
        // Ask what to do if something doesn't correspond (maybe have a boolean that indicate which got modified since last session to help understand what changes)
        // Sync toward localfiles or toward leekwars
        // Open watcher, push modifications to leekwars and update filestorage accordingly
    }

    private async updateLeekwarsFiles(){
        
        // Get an updated list of leekwars files
        const newLeekwarsFiles = this.nodeLeekClient.getFiles();

        // Remove in leekwarsFilesystem all files that aren't present in leekwars anymore
        Object.keys(this.leekwarsFilesystem).forEach(filename => {
            if (filename in newLeekwarsFiles) return;
            delete this.leekwarsFilesystem[filename];
        })

        // fetchAllFiles in leekwars and update leekwarsFiles accordingly (note: use leekwarsFiles to get timestamp on files previously fetched)
        const filesToFetch : {[id: number]: string} = {};
        const fetchRequests: Array<Array<number>> = [];
        newLeekwarsFiles.forEach(([name: string, fileId: number]) => {
            if (this.isFolder(name)) {
                this.leekwarsFilesystem[name] = new LeekFolder(name, fileId);
            }else{
                filesToFetch[fileId] = name;
                fetchRequests.push([fileId, this.leekwarsFilesystem[name]?.timestamp ?? 0])
            }
        });
        
        // Update all file in local filesystem with new code and timestamp
        (await this.nodeLeekClient.fetchFiles(fetchRequests)).forEach(aiCode => {
            const name = filesToFetch[aiCode.id];
            this.leekwarsFilesystem[name] = new LeekScript(name, aiCode.id, aiCode.code, aiCode.modified);
        });
    }
    private async updateLocalFiles(){
        // Turn on watcher
        // Wait to list all already existing file

        const newLeekwarsFiles = {"a/b/file.leek": 159182659};

        // Remove in localFilesCache all files that aren't present in files anymore

        // update hashes
    }

}