import { SchemaRegistration } from 'zontax';
export declare const ZONTAX_LANGUAGE_ID = "zontax";
export declare function setupZontaxMode(initialSchemas?: SchemaRegistration[]): {
    updateSchemas: (schemas: SchemaRegistration[]) => void;
    dispose: () => void;
};
