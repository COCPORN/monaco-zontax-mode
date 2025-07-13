import type { languages, Position, CancellationToken, editor } from 'monaco-editor';
import { ZontaxParser, SchemaRegistration, Extension } from 'zontax';

export class HoverProvider implements languages.HoverProvider {
  private parser: ZontaxParser;

  constructor(schemas: SchemaRegistration[] = []) {
    this.parser = new ZontaxParser(schemas);
  }

  public updateSchemas(schemas: SchemaRegistration[]) {
    this.parser = new ZontaxParser(schemas);
  }

  public provideHover(
    model: editor.ITextModel,
    position: Position,
    token: CancellationToken
  ): languages.ProviderResult<languages.Hover> {
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
    const registrations = this.parser.getRegistrations();
    const allExtensions: Extension[] = Object.values(registrations).flat();
    
    const extension = allExtensions.find(ext => ext.name === word.word);

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
