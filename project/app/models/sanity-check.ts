import { BaseModel } from "@adonisjs/lucid/orm";

class PolymorphicModel extends BaseModel {}

export class A extends PolymorphicModel {
    static table = "A"
}

export class B extends A {

}

export class C extends B {

}

export class D extends BaseModel {
}
