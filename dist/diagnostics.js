import * as monaco from 'monaco-editor';
import { ZontaxParser } from 'zontax';
import { ZONTAX_LANGUAGE_ID } from './index';
export class DiagnosticsProvider {
    constructor(schemas = []) {
        this.parser = new ZontaxParser(schemas);
        this.setupListeners();
    }
    updateSchemas(schemas) {
        this.parser = new ZontaxParser(schemas);
        this.validateAllModels();
    }
    setupListeners() {
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
    validateAllModels() {
        monaco.editor.getModels().forEach(model => {
            if (model.getLanguageId() === ZONTAX_LANGUAGE_ID) {
                this.validate(model);
            }
        });
    }
    validate(model) {
        const code = model.getValue();
        try {
            this.parser.parse(code);
            monaco.editor.setModelMarkers(model, ZONTAX_LANGUAGE_ID, []);
        }
        catch (error) {
            const markers = [];
            // This is a simplified error handling. A real implementation would
            // need to parse the error message to get the line and column number.
            markers.push({
                message: error.message,
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: model.getLineMaxColumn(1),
            });
            monaco.editor.setModelMarkers(model, ZONTAX_LANGUAGE_ID, markers);
        }
    }
}
