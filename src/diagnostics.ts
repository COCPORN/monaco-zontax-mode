import * as monaco from 'monaco-editor';
import { ZontaxParser, SchemaRegistration } from 'zontax';
import { ZONTAX_LANGUAGE_ID } from './index';

export class DiagnosticsProvider {
  private parser: ZontaxParser;

  constructor(schemas: SchemaRegistration[] = []) {
    this.parser = new ZontaxParser(schemas);
    this.setupListeners();
  }

  public updateSchemas(schemas: SchemaRegistration[]) {
    this.parser = new ZontaxParser(schemas);
    this.validateAllModels();
  }

  private setupListeners(): void {
    monaco.editor.onDidCreateModel(model => {
      if (model.getLanguageId() === ZONTAX_LANGUAGE_ID) {
        this.validate(model);
        model.onDidChangeContent(() => this.validate(model));
      }
    });

    monaco.editor.getModels().forEach(model => {
        if (model.getLanguageId() === ZONTAX_LANGUAGE_ID) {
            this.validate(model);
            model.onDidChangeContent(() => this.validate(model));
        }
    });
  }

  private validateAllModels(): void {
    monaco.editor.getModels().forEach(model => {
      if (model.getLanguageId() === ZONTAX_LANGUAGE_ID) {
        this.validate(model);
      }
    });
  }

  private validate(model: monaco.editor.ITextModel): void {
    const code = model.getValue();
    const markers: monaco.editor.IMarkerData[] = [];

    // --- Step 1: Check for lowercase 'z' error, ignoring comments ---
    const lowercaseZRegex = /z\.(object|string|number|etc)/g;
    let match;
    while ((match = lowercaseZRegex.exec(code)) !== null) {
      const position = model.getPositionAt(match.index);
      const tokens = monaco.editor.tokenize(model.getLineContent(position.lineNumber), ZONTAX_LANGUAGE_ID);
      const token = tokens[0].find(t => t.offset + 1 >= position.column);
      
      if (token && !token.type.startsWith('comment')) {
        markers.push({
          message: "Zontax schemas must start with a capital 'Z'.",
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column + 1,
        });
      }
    }

    // --- Step 2: Run the Zontax parser ---
    try {
      this.parser.parse(code);
    } catch (error: any) {
      const message = error.message || 'An unknown error occurred.';
      let errorMatch;
      const unrecognizedMethodRegex = /Unrecognized method '(.+?)'/;
      
      if ((errorMatch = unrecognizedMethodRegex.exec(message))) {
        const problemStr = errorMatch[1].replace(/[().]/g, '');
        const searchResult = model.findMatches(problemStr, true, false, true, null, false);
        
        if (searchResult.length > 0) {
          const { range } = searchResult[0];
          markers.push({
            message,
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: range.startLineNumber,
            startColumn: range.startColumn,
            endLineNumber: range.endLineNumber,
            endColumn: range.endColumn,
          });
        }
      } else {
         markers.push({
          message,
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: model.getLineMaxColumn(1),
        });
      }
    }
    
    monaco.editor.setModelMarkers(model, ZONTAX_LANGUAGE_ID, markers);
  }
}
