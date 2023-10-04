import {Pool} from "mysql2/promise";

export abstract class AbstractModel<T> {
    abstract table: string;

    abstract findById(id: number) : Promise<T | null>;
    abstract getAll() : Promise<Array<T>>;
    abstract save(o?: T) : Promise<number>;
}


export class ModelError extends Error {};
export class BaseModel {
    constructor(protected pool: Pool) {
    }

}
