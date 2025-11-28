import { Application } from "@adonisjs/core/app"
import { ModelRegistry } from "./model_registry.js"
import { ContainerBindings } from "@adonisjs/core/types"

export class LoppPlugin 
{   
    /** === PROPERTIES === **/
    declare application: Application<ContainerBindings>
    
    public modelRegistry : ModelRegistry = new ModelRegistry()

    /** === METHODS === **/
    public start(app: Application<ContainerBindings>) {
        return app
    }
}

export const loppPlugin = new LoppPlugin()