declare module 'zontax' {
  export interface Extension {
    name: string;
    args: string[];
    allowedOn: string[];
    description?: string;
  }

  export interface SchemaRegistration {
    namespace?: string;
    extensions: Extension[];
  }

  export type RegistrationsMap = {
    _global: Extension[];
    [namespace: string]: Extension[];
  };

  export class ZontaxParser {
    constructor(schemas: SchemaRegistration[]);
    parse(code: string): { schema: string; definition: any };
    getRegistrations(): RegistrationsMap;
  }
}
