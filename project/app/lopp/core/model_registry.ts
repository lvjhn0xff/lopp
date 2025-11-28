// import { LoppHelpers, RegistryTable, StringMap } from "#lopp";
import { LoppHelpers } from "#lopp/core/helpers";
import RegistryTable from "#lopp/models/registry_table";
import { StringMap } from "#lopp/types/index";

export class ModelRegistry 
{
    /** === PROPERTIES  **/
    public scanLocations : StringMap  = {
        "./app/models" : "#models/"
    }

    public modelMapping : StringMap = {}

    public registryTable : string = ""

    public verbose : boolean = false;

    /** === METHODS === */
    public setScanLocations(locations: StringMap) {
        this.scanLocations = locations
    }
    
    public async getCompleteModelMapping() {
        const scanLocations = this.scanLocations; 
        let fullModelMapping : StringMap = {}
        for(let [scanLocation, scanImportLocation] of Object.entries(scanLocations)) {
            if(this.verbose) {
                console.log(":: ===== Registering for " + scanImportLocation + " ===== #")
            }
            let files = LoppHelpers.listAllFiles(scanLocation) as string[]
            files = LoppHelpers.filterByFileExtension(files, ".ts")
            const modelMapping = 
            await LoppHelpers.mapFilesToModels(files, scanImportLocation)
            fullModelMapping = {
                ...fullModelMapping, 
                ...modelMapping
            }
        }
        return fullModelMapping
    }
    
    public async getModelCount() {
        return (await RegistryTable.query().count("id", "total"))[0].$extras["total"]
    }
    
    public async loadModelMapping() {
        this.modelMapping = await this.getCompleteModelMapping()
    }
    
    public async reset() {
        await RegistryTable.truncate()
    }
    
    public async update() {
        const modelMapping = this.modelMapping;
        
        for(let modelName in modelMapping) {
            if(this.verbose) {
                console.log(":: Registering " + modelName)
            }
            if(!(await RegistryTable.query().where("modelName", modelName).first() == null))
                continue 
            await RegistryTable.create({ modelName })
        }
    }
}

