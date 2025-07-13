import type { languages, Position, CancellationToken, editor } from 'monaco-editor';
import { SchemaRegistration } from 'zontax';
export declare class HoverProvider implements languages.HoverProvider {
    private parser;
    constructor(schemas?: SchemaRegistration[]);
    updateSchemas(schemas: SchemaRegistration[]): void;
    provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Hover>;
}
