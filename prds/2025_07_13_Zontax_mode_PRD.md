# PRD: Monaco Editor Language Mode for Zontax

Date: 2025-07-13

## Objective

To provide a rich, productive, and error-free editing experience
for Zontax schema strings within any environment that uses the
Monaco Editor (such as VS Code, web-based IDEs, and custom
applications). This will elevate Zontax from a powerful library
to a professional-grade language with first-class tooling.

### Project structure

The project should be structured as follows (directory structure only, implementation details are up for discussion, including naming of files):

```
prds/
    2025_07_13_Zontax_mode_PRD.md
src/
    index.ts
    parser.ts
    tokenizer.ts
    completion.ts
    hover.ts
    diagnostics.ts
README.md
package.json
pnpm-lock.yaml
tscconfig.json
CHANGELOG.md
```

## Core Features

### Syntax Highlighting

Visually distinguish the different parts of the Zontax language
to improve readability and reduce errors. The highlighting
should differentiate:

- Root Identifier: The Z object should have a distinct color,
  clearly marking the start of a Zontax schema.
- Zod Methods: Standard Zod methods (.string, .object, .min,
  etc.) should share a consistent color, similar to standard
  function calls.
- Namespaces: The namespace part of an extension call (ui in
  ui$label) should have a unique color to identify it as a
  namespace.
- Extensions: The extension name itself (label in ui$label or
  analyticsId) should have its own color to stand out as a piece
  of metadata.
- Separators: The $ separator should be highlighted as a special
  operator to make the namespace syntax unambiguous.

Example Highlighting:

```
Z (type), string (method), min (method), ui
(namespace), $ (operator), label (extension)
```

```
Z.string().min(3).ui$label("Username")
```

### IntelliSense & Auto-Completion

Provide context-aware suggestions to speed up development and
reduce typos. The completion provider should be aware of the
schemas registered with the Zontax parser instance.

- Zod Method Completion: After a type is defined (e.g.,
  Z.string()), suggest applicable Zod methods (.min, .max,
  .optional, etc.).
- Global Extension Completion: After a Zod chain, suggest the
  names of all registered global extensions.
- Namespace Completion: After a Zod chain, suggest the names of
  all registered namespaces.
- Namespaced Extension Completion: After a user types a
  namespace$, suggest only the extension names that are
  registered within that specific namespace.

### Error Highlighting & Diagnostics (Linting)

Provide real-time feedback on syntax and registration errors.

- Invalid Root: Flag the use of lowercase z. as an error,
  suggesting Z. to enforce the correct syntax.
- Unregistered Methods (`strict` mode): When the parser is
  configured in strict mode, flag any unregistered global or
  namespaced extension as an error.
- Malformed Syntax: Flag malformed namespace syntax, such as
  ui$$label or ui$.

### Hover Information

Provide on-hover documentation for registered extensions to
improve discoverability and reduce the need to look up
definitions.

- When a user hovers over a registered extension (e.g.,
  ui$label), a tooltip should appear displaying the description
  from its Extension schema definition.

## Implementation Strategy

The language mode can be implemented directly on the main UI
thread, providing a simple and effective integration. A Web
Worker is not required for functionality but can be considered
an optional optimization for applications handling extremely
large schemas.

- Schema Provisioning: The Monaco editor instance will be
  provided with the necessary Zontax schema definitions (the
  array of SchemaRegistration objects) upon initialization.
- Parser Instantiation: A single instance of the ZontaxParser
  will be created and configured with the provided schemas.
- Tokenizer: Use Monaco's declarative monarch library for the
  initial token-based syntax highlighting. This is a simple and
  effective way to achieve the visual distinction required.
- Updating the schemas should be possible during runtime (consult reference code to see a working implementation of it)
- Provider Registration:
  - `monaco.languages.registerCompletionItemProvider`: Will be
    implemented to provide IntelliSense. Its logic will
    directly query the ZontaxParser instance to get lists of
    registered global extensions, namespaces, and namespaced
    extensions.
  - `monaco.languages.registerHoverProvider`: Will be
    implemented to show on-hover documentation by looking up
    the extension in the parser's registrations.
- Diagnostics (Linting):
  - An event listener on the model's onDidChangeContent will
    trigger a re-parse of the document's content using the main
    ZontaxParser instance.
  - Any errors caught during the parse will be used to create
    and set diagnostic markers (e.g., red underlines) on the
    model.

### Reference code

For your convenience, a similar reference implementation which implements JSONata with dynamic schema can be found in this directory:

- `prds/reference_implementation`

This implementation will likely be very similar.

The README.md for Zontax can be found here:

- `prds/zontax/README.md`

It should contain the needed documentation for the Zontax parser.

### Technology

We prefer `pnpm`.

### Non-Goals (for v1)

- Tokenizer: Use Monaco's declarative monarch library for the
  initial token-based syntax highlighting. This is a simple and
  effective way to achieve the visual distinction required.
- Language Service Worker: For the advanced, context-aware
- Code Formatting: A "Prettier-style" auto-formatter for Zontax
  strings is out of scope for the initial version.
- Deep Zod Validation: The linter will focus on Zontax-specific
  syntax and registration errors. It will not validate the logic
  of the Zod chain itself (e.g., it will not flag .min(5).max(3)
  as an error). This remains the responsibility of the Zod
  library itself at runtime.
