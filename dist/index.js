import * as monaco from 'monaco-editor';
import { monarchLanguage } from './tokenizer';
import { CompletionProvider } from './completion';
import { HoverProvider } from './hover';
import { DiagnosticsProvider } from './diagnostics';
export const ZONTAX_LANGUAGE_ID = 'zontax';
export function setupZontaxMode(initialSchemas = []) {
    monaco.languages.register({ id: ZONTAX_LANGUAGE_ID });
    monaco.languages.setMonarchTokensProvider(ZONTAX_LANGUAGE_ID, monarchLanguage);
    const completionProvider = new CompletionProvider(initialSchemas);
    const completionProviderRegistration = monaco.languages.registerCompletionItemProvider(ZONTAX_LANGUAGE_ID, completionProvider);
    const hoverProvider = new HoverProvider(initialSchemas);
    const hoverProviderRegistration = monaco.languages.registerHoverProvider(ZONTAX_LANGUAGE_ID, hoverProvider);
    const diagnosticsProvider = new DiagnosticsProvider(initialSchemas);
    // Return a disposable object that can be used to update schemas or dispose of the providers
    return {
        updateSchemas: (schemas) => {
            completionProvider.updateSchemas(schemas);
            hoverProvider.updateSchemas(schemas);
            diagnosticsProvider.updateSchemas(schemas);
        },
        dispose: () => {
            completionProviderRegistration.dispose();
            hoverProviderRegistration.dispose();
            // Diagnostics provider does not have a dispose method
        }
    };
}
