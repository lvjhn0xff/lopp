import { Application } from "@adonisjs/core/app";
import { ContainerBindings } from "@adonisjs/core/types";
import { BaseModel } from "@adonisjs/lucid/orm";
import db from "@adonisjs/lucid/services/db";
import fs from "fs"
import RegistryTable from "./models/RegistryTable.js";

interface StringMap 
{
    [key: string] : string
}

export function count() {
   
}

export class LoppHelpers 
{
    static listAllFiles(location: string) {
        return fs.readdirSync(location, { recursive: true })
    }

    static trimCurrentDirectory(location: string) {
        if(location.startsWith("./"))
            return location.substring(2)
        return location
    }

    static replaceWithJSExtension(location: string) {
        if(location.endsWith(".ts"))
            return location.substring(0, location.length - 3) + ".js"
        return location
    }

    static removeExtension(location: string, extension: string) {
        if(location.endsWith(extension))
            return location.substring(0, location.length - 3)
        return location
    }

    static filterByFileExtension(locations: string[], extension: string) : string[] {
        return locations.filter(location => location.endsWith(extension))
    }

    static async mapFilesToModels(files: string[], location: string) {
        const modelMapping : StringMap = {}
        for(let file of files) {
            file = LoppHelpers.trimCurrentDirectory(file)
            file = LoppHelpers.removeExtension(file, ".ts")

            const fullLocation = location + "/" +  file; 
            const Model = (await import(fullLocation)).default

            if(BaseModel.prototype.isPrototypeOf(Model.prototype)) {
                modelMapping[Model.name] = fullLocation 
            }
        }
        return modelMapping
    }
}

export class ModelRegistry 
{
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

export class LoppPlugin 
{   
    public modelRegistry : ModelRegistry = new ModelRegistry()

    public start(app: Application<ContainerBindings>) {
        return app
    }
}

export const loppPlugin = new LoppPlugin()
