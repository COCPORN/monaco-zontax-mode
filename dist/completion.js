import * as monaco from 'monaco-editor';
import { ZontaxParser } from 'zontax';
const zodKeywords = [
    'string', 'number', 'boolean', 'object', 'array', 'tuple', 'enum',
    'union', 'literal', 'lazy', 'function', 'effect', 'transformer',
    'optional', 'nullable', 'default', 'catch', 'pipe', 'brand',
    'min', 'max', 'length', 'email', 'url', 'uuid', 'cuid', 'regex',
    'startsWith', 'endsWith', 'datetime', 'int', 'positive', 'negative',
    'nonpositive', 'nonnegative', 'multipleOf', 'finite', 'safe',
    'passthrough', 'strict', 'strip', 'deepPartial', 'pick', 'omit',
    'partial', 'required', 'shape', 'keyof', 'extend', 'merge', 'set',
    'nonempty', 'optional', 'nullable', 'readonly', 'transform', 'refine',
    'superRefine', 'refinement', 'describe', 'and', 'or', 'not',
];
export class CompletionProvider {
    constructor(schemas = []) {
        this.parser = new ZontaxParser(schemas);
    }
    updateSchemas(schemas) {
        this.parser = new ZontaxParser(schemas);
    }
    get triggerCharacters() {
        return ['.', '$'];
    }
    provideCompletionItems(model, position, context, token) {
        const word = model.getWordUntilPosition(position);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };
        const line = model.getLineContent(position.lineNumber).trim();
        const triggerChar = context.triggerCharacter;
        const suggestions = [];
        if (triggerChar === '.') {
            zodKeywords.forEach(keyword => {
                suggestions.push({
                    label: keyword,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: keyword,
                    range: range,
                });
            });
            const globalExtensions = this.parser.getRegisteredExtensions();
            globalExtensions.forEach(ext => {
                suggestions.push({
                    label: ext.name,
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: ext.name,
                    range: range,
                });
            });
            const namespaces = this.parser.getRegisteredNamespaces();
            namespaces.forEach(ns => {
                suggestions.push({
                    label: ns,
                    kind: monaco.languages.CompletionItemKind.Module,
                    insertText: `${ns}$`,
                    range: range,
                });
            });
        }
        else if (triggerChar === '$') {
            const namespaceMatch = line.match(/(\w+)\$$/);
            if (namespaceMatch) {
                const namespace = namespaceMatch[1];
                const namespacedExtensions = this.parser.getRegisteredExtensions(namespace);
                namespacedExtensions.forEach(ext => {
                    suggestions.push({
                        label: ext.name,
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: ext.name,
                        range: range,
                    });
                });
            }
        }
        return {
            suggestions: suggestions,
        };
    }
}
