import {defineStore} from "pinia";


export const useMakeFormDataStore = defineStore('makeFormDataStore', {
    state: () => ({
        fileListUrls: [],
        type: 'default type',
        character: 'other',
        title: 'default title',
        description: 'default description',
        illustrator: 'default illustrator',
        uploadComplete: false
    } ),
    actions: {
        clearFileListUrls() {
            this.fileListUrls = []
        },
        getAll() {
            return {
                fileListUrls: this.fileListUrls,
                type: this.type,
                character: this.character,
                title: this.title,
                description: this.description,
                illustrator: this.illustrator,
            }
        },
        pushFileListUrls(url) {
            this.fileListUrls.push(url)
        },
        getFileListUrls() {
            return this.fileListUrls
        },
        setDefaultValue(title, description, illustrator) {
            this.title = title
            this.description = description
            this.illustrator = illustrator
        },
        setUploadComplete() {
            this.uploadComplete = true
        },
        setState(data){
            for(let item of data){
                for(let data in item){
                    if (this.hasOwnProperty(data)){
                        this[data] = item[data]
                    }
                }
            }

        }
    },
});