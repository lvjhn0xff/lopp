import { KeysOf, ValuesOf } from "#lopp/types/index"
import db from "@adonisjs/lucid/services/db"
import { Knex } from "knex"


export type FieldTypes = ValuesOf<Knex.TableBuilder> | string 

export interface BaseModelDefinitionOptions {
    modelName?: string | null
    parentName?: string | null 
    fields?: FieldTypes[] | null , 
    children?: string[] | null 
}

export class BaseModelDefinition {
    declare modelName: string | null 
    declare parentName: string | null 
    declare fields: FieldTypes[] | null 
    declare children: string[] | null
    
    constructor(options: BaseModelDefinitionOptions = {}) {
        this.modelName = options.modelName ?? "" 
        this.parentName = options.parentName ?? ""  
        this.fields = options.fields ?? null 
        this.children = options.children ?? null
    }
}

export interface SubTypeMap {
    [key: string] : BaseModelDefinition 
}

export class PolymorphicSchema 
{
    static modelName : string | null = null 
    static parentName : string | null = null
    static fields : FieldTypes[] = []
    static subtypes : SubTypeMap  = {}
    static parent : null = null 
    static children : string[] = []
}

export class BaseModelDecoratee {
    static modelName : string | null = null
}

export function extend
    <T extends { modelName?: string | null }>
    (parent: T, fields: Pick<BaseModelDefinitionOptions, "fields">["fields"]) 
{      
    return class ModelDecoratee<J extends PolymorphicSchema> extends BaseModelDecoratee {
        constructor(SchemaDefinition: J, modelName: string, methodName: string) {
            super()  
            // @ts-ignore 
            ModelDecoratee[methodName](SchemaDefinition, modelName)
        }

        static injectModelName
            <J extends PolymorphicSchema>
            (SchemaDefinition: J, modelName: string) 
        {
            ModelDecoratee.modelName = modelName 
        }

        static registerModel
            <J extends typeof PolymorphicSchema> 
            (SchemaDefinition: J, modelName: string) 
        {
            if(modelName in SchemaDefinition.subtypes!) 
                return 

            const definition = new BaseModelDefinition({
                modelName: modelName, 
                parentName: parent.modelName, 
                fields: fields, 
                children: [] 
            })

            SchemaDefinition.subtypes![modelName] = definition
        }

        static connectToParent
            <J extends typeof PolymorphicSchema>
            (SchemaDefinition: J, modelName: string)
        {
            const definition = SchemaDefinition.subtypes![modelName] 
            const parentName = definition.parentName  
            
            let parentDefinition =
                ModelDecoratee._resolveParent_(SchemaDefinition, parentName as string) 
                 
            parentDefinition = parentDefinition as BaseModelDefinition 

            parentDefinition.children!.push(modelName)
        }

        /** === UTILITY METHODS === **/ 
        static _resolveParent_
            <T extends typeof PolymorphicSchema>
            (SchemaDefinition: T, parentName: string) {
            if(parentName == SchemaDefinition.name) {
                return SchemaDefinition
            }
            else {
                return SchemaDefinition.subtypes![parentName]
            }
        }   
    }
}

export function isRoot
    <T extends typeof PolymorphicSchema>
    (Root: T, modelName: string) 
{
    return Root.modelName == modelName 
}

export function resolveType
    <T extends typeof PolymorphicSchema>
    (Root: T, typeName: string) 
{
    if(isRoot(Root, typeName)) {
        return Root 
    }
    else {
        return Root.subtypes[typeName]
    }
}

export function getModelDefinitions
    <T extends typeof PolymorphicSchema,>
    (SchemaDefinition: T) 
{
    let models = [] 
    for(let key in SchemaDefinition) {
        // @ts-ignore
        let value = SchemaDefinition[key] 
        if(value && Object.getPrototypeOf(value) === BaseModelDecoratee) {
            models.push(key)
        }
    }

    return models 
}

export function runDecoratee    
    <T extends typeof PolymorphicSchema>
    (SchemaDefinition: T, modelName: string, methodName: string) 
{   
    // @ts-ignore
    const decoratee = SchemaDefinition[modelName] 
    const definition = new decoratee(SchemaDefinition, modelName,  methodName) 
    return definition
}

export function bootSchema
    <T extends typeof PolymorphicSchema>
    (SchemaDefinition: T) 
{   
    SchemaDefinition.modelName = SchemaDefinition.name 

    let modelDefinitions = getModelDefinitions(SchemaDefinition) 

    // --- register model ---// 
    for(let modelName of modelDefinitions) {
        runDecoratee(SchemaDefinition, modelName, "injectModelName")
    }

    // --- boot model --- //
    for(let modelName of modelDefinitions) {
        runDecoratee(SchemaDefinition, modelName, "registerModel")
    }

    // --- connect models to parent --- //
    for(let modelName of modelDefinitions) {
        runDecoratee(SchemaDefinition, modelName, "connectToParent")
    }
}