import type { languages, Position, CancellationToken, editor } from 'monaco-editor';
import { SchemaRegistration } from 'zontax';
export declare class CompletionProvider implements languages.CompletionItemProvider {
    private parser;
    constructor(schemas?: SchemaRegistration[]);
    updateSchemas(schemas: SchemaRegistration[]): void;
    get triggerCharacters(): string[];
    provideCompletionItems(model: editor.ITextModel, position: Position, context: languages.CompletionContext, token: CancellationToken): languages.ProviderResult<languages.CompletionList>;
}
