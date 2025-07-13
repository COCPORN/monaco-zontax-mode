import { ZontaxParser } from 'zontax';
export class HoverProvider {
    constructor(schemas = []) {
        this.parser = new ZontaxParser(schemas);
    }
    updateSchemas(schemas) {
        this.parser = new ZontaxParser(schemas);
    }
    provideHover(model, position, token) {
        const word = model.getWordAtPosition(position);
        if (!word) {
            return { contents: [] };
        }
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };
        const line = model.getLineContent(position.lineNumber);
        const namespaceMatch = line.match(/(\w+)\$/);
        let extension;
        if (namespaceMatch) {
            const namespace = namespaceMatch[1];
            extension = this.parser.getRegisteredExtensions(namespace).find(ext => ext.name === word.word);
        }
        else {
            extension = this.parser.getRegisteredExtensions().find(ext => ext.name === word.word);
        }
        if (extension && extension.description) {
            return {
                range: range,
                contents: [
                    { value: `**${extension.name}**` },
                    { value: extension.description },
                ],
            };
        }
        return { contents: [] };
    }
}
