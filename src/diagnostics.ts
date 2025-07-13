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
      }
    });

    monaco.editor.getModels().forEach(model => {
        if (model.getLanguageId() === ZONTAX_LANGUAGE_ID) {
            this.validate(model);
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
    try {
      this.parser.parse(code);
      monaco.editor.setModelMarkers(model, ZONTAX_LANGUAGE_ID, []);
    } catch (error: any) {
      const markers: monaco.editor.IMarkerData[] = [];
      const message = error.message || 'An unknown error occurred.';
      
      let match;
      // Example error: "Unrecognized method '.doc$description()'"
      const unrecognizedMethodRegex = /Unrecognized method '(.+?)'/;
      
      if ((match = unrecognizedMethodRegex.exec(message))) {
        const problemStr = match[1].replace(/[().]/g, ''); // clean up the string to search for
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
      }

      // If we couldn't find a specific location, fall back to marking line 1
      if (markers.length === 0) {
        markers.push({
          message,
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: model.getLineMaxColumn(1),
        });
      }
      
      monaco.editor.setModelMarkers(model, ZONTAX_LANGUAGE_ID, markers);
    }
  }
}
