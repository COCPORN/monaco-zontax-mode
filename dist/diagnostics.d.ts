import { SchemaRegistration } from 'zontax';
export declare class DiagnosticsProvider {
    private parser;
    constructor(schemas?: SchemaRegistration[]);
    updateSchemas(schemas: SchemaRegistration[]): void;
    private setupListeners;
    private validateAllModels;
    private validate;
}
