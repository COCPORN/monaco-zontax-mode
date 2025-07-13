import * as monaco from 'monaco-editor';
import { monarchLanguage } from './tokenizer';
import { CompletionProvider } from './completion';
import { HoverProvider } from './hover';
import { DiagnosticsProvider } from './diagnostics';
import { SchemaRegistration } from 'zontax';

export const ZONTAX_LANGUAGE_ID = 'zontax';

export function setupZontaxMode(initialSchemas: SchemaRegistration[] = []) {
  try {
    monaco.languages.register({ id: ZONTAX_LANGUAGE_ID });

    monaco.languages.setMonarchTokensProvider(ZONTAX_LANGUAGE_ID, monarchLanguage);

    // All providers now create their own parser instance, which is lightweight.
    const completionProvider = new CompletionProvider(initialSchemas);
    const hoverProvider = new HoverProvider(initialSchemas);
    const diagnosticsProvider = new DiagnosticsProvider(initialSchemas);

    const completionProviderRegistration = monaco.languages.registerCompletionItemProvider(
      ZONTAX_LANGUAGE_ID,
      completionProvider
    );
    const hoverProviderRegistration = monaco.languages.registerHoverProvider(
      ZONTAX_LANGUAGE_ID,
      hoverProvider
    );

    // Return a disposable object that can be used to update schemas or dispose of the providers
    return {
      updateSchemas: (schemas: SchemaRegistration[]) => {
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
  } catch (e: any) {
    console.error("Error during Zontax mode setup. See details below.");
    if (e.issues) {
      console.error("Zod validation issues:", JSON.stringify(e.issues, null, 2));
    } else {
      console.error("Full error:", e);
    }
    // Re-throw the error to make it visible in the console
    throw e;
  }
}
