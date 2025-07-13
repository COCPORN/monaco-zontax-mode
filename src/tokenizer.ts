import type { languages } from 'monaco-editor';

export const monarchLanguage = {
  // Set defaultToken to invalid to see what is not covered by the tokenizer.
  defaultToken: 'invalid',

  keywords: [
    // Add all Zod methods that should be highlighted
    'string', 'number', 'boolean', 'object', 'array', 'tuple', 'enum',
    'union', 'literal', 'lazy', 'function', 'effect', 'transformer',
    'optional', 'nullable', 'default', 'catch', 'pipe', 'brand',
    'min', 'max', 'length', 'email', 'url', 'uuid', 'cuid', 'regex',
    'startsWith', 'endsWith', 'datetime', 'int', 'positive', 'negative',
    'nonpositive', 'nonnegative', 'multipleOf', 'finite', 'safe',
    'passthrough', 'strict', 'strip', 'deepPartial', 'pick', 'omit',
    'partial', 'required', 'shape', 'keyof', 'extend', 'merge', 'set',
    'nonempty', 'optional', 'nullable', 'readonly', 'transform', 'refine',
    'superRefine', 'refinement', 'describe', 'and', 'or', 'not',
  ],

  operators: [
    '$',
  ],

  // we include these common regular expressions
  symbols:  /[.(),]/,

  // C style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // comments
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],

      // Root identifier
      [/(Z)(?=\.)/, 'type.identifier'],

      // Namespace and extension must be checked before general identifiers
      [/([a-zA-Z_]\w*)(?=\$)/, 'namespace'],
      [/(?<=\$)([a-zA-Z_]\w*)/, 'extension'],

      // Object properties (identifiers followed by a colon)
      [/[a-zA-Z_][\w]*(?=\s*:)/, 'type.property'],

      // Identifiers and keywords
      [/[a-zA-Z_][\w]*/, {
        cases: {
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],

      // whitespace
      { include: '@whitespace' },

      // delimiters and operators
      [/:/, 'type.property'],
      [/[{}()[\]\.,]/, '@symbols'],
      [/\$/, 'operator'],

      // numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // strings
      [/"([^"]|\\.)*$/, 'string.invalid' ],  // non-teminated string
      [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' } ]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/["\/*]/, 'comment']
    ],
  },
} as languages.IMonarchLanguage;
