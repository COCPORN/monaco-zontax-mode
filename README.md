# Monaco Zontax Mode

Provides a rich editing experience for the Zontax language within the Monaco Editor.

This package includes:
- Syntax highlighting for Zontax schemas.
- IntelliSense for Zod methods and registered Zontax extensions.
- On-hover documentation for registered extensions.
- Real-time error diagnostics and linting.

## Installation

```bash
pnpm add monaco-zontax-mode
# or
npm install monaco-zontax-mode
# or
yarn add monaco-zontax-mode
```

## Usage

To use this language mode, you need to import it and initialize it with your Zontax schema registrations.

```typescript
import * as monaco from 'monaco-editor';
import { setupZontaxMode } from 'monaco-zontax-mode';
import { SchemaRegistration } from 'zontax';

// 1. Define your Zontax schemas
const schemas: SchemaRegistration[] = [
  {
    namespace: 'ui',
    extensions: [
      { name: 'label', args: ['string'], allowedOn: ['string'], description: 'The display label for a field.' },
      { name: 'hidden', args: [], allowedOn: ['string', 'number'], description: 'Hides the field in the UI.' },
    ]
  },
  {
    // Global extensions
    extensions: [
      { name: 'analyticsId', args: ['string'], allowedOn: ['string'], description: 'The ID for analytics tracking.' },
    ]
  }
];

// 2. Initialize the language mode
const zontaxMode = setupZontaxMode(schemas);

// 3. Create the editor
monaco.editor.create(document.getElementById('editor'), {
  value: 'Z.string().ui$label("Username")',
  language: 'zontax',
  theme: 'vs-dark',
});

// You can update the schemas at any time
// zontaxMode.updateSchemas(newSchemas);

// To clean up, dispose of the providers
// zontaxMode.dispose();
```

## Development

To build the project, run:
```bash
pnpm install
pnpm build
```
