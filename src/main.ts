import * as monaco from 'monaco-editor';
import { setupZontaxMode } from './index';
import type { SchemaRegistration } from 'zontax';

// 1. Define your Zontax schemas for testing
const schemas: SchemaRegistration[] = [
  {
    namespace: 'ui',
    extensions: [
      { name: 'label', allowedOn: ['string'], args: ['string'], description: 'A simple label.' },
    ]
  },
  {
    namespace: 'doc',
    extensions: [
      { name: 'description', allowedOn: ['string', 'number', 'object'], args: ['string'], description: 'A description for documentation.' },
    ]
  },
  {
    extensions: [
        { name: 'analyticsId', allowedOn: ['string'], args: ['string'], description: 'An analytics ID.' },
    ]
  }
];

// 2. Initialize the language mode
setupZontaxMode(schemas);

// 3. Create the editor
const editorElement = document.getElementById('editor');
if (editorElement) {
  monaco.editor.create(editorElement, {
    value: `Z.object({
  name: Z.string().min(1).ui$label("Full Name"),
  id: Z.string().uuid().analyticsId("user-id"),
  age: Z.number().positive().doc$description("The age of the user"),
  email: Z.string().email().optional(),
  // Try typing a dot, or "ui$" to see completions.
  // Hover over "label" or "analyticsId" to see descriptions.
  // Try writing invalid code to see errors, e.g., z.string()
})`,
    language: 'zontax',
    theme: 'vs-dark',
  });
} else {
  console.error('Could not find editor element for testing.');
}