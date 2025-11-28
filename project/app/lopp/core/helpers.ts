import { StringMap } from "#lopp/types/index"
import { BaseModel } from "@adonisjs/lucid/orm"
import fs from "fs"

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