export interface StringMap {
    [key: string] : string
}

export type ValuesOf<T> = {
 [K in keyof T]: T[K] 
}[keyof T];

export type KeysOf<T> = {
 [K in keyof T]: T[K] extends any? K : never
}[keyof T];