module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./configs/tsconfig.lint.json'],
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
    'canonical',
    'canonical/prettier',
    'prettier',
  ],

  plugins: [
    '@typescript-eslint',
    'import',
    'unused-imports',
    'sonarjs',
    'promise',
  ],
  globals: {},
  rules: {
    'prefer-promise-reject-errors': 'off',
    'no-console': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    'prefer-arrow-callback': 'warn',
    curly: 'warn',

    quotes: ['warn', 'single', { avoidEscape: true }],

    // this rule, if on, would require explicit return type on the `render` function
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/type-annotation-spacing': 'warn',
    '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
    '@typescript-eslint/consistent-indexed-object-style': 'warn',
    '@typescript-eslint/semi': 'off',

    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    '@typescript-eslint/no-var-requires': 'off',

    // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
    // does not work with type definitions
    'no-unused-vars': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'import/no-unused-modules': [
      'off',
      {
        unusedExports: true,
        missingExports: true,
        // ignoreExports: [
        // '**/*.d.ts',
        // '**/babel.config.js',
        // '**/quasar.conf.js',
        // '**/*.vue',
        // '**/src/boot/*.ts',
        // '**/src/index.ts',
        // '**/router/index.ts',
        // '**/store/index.ts',
        // ],
      },
    ],

    'import/no-unresolved': 'warn',
    'import/extensions': ['warn', 'always', { js: 'never', ts: 'never' }],
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        groups: [
          'builtin',
          'external',
          'internal',
          'sibling',
          'parent',
          'index',
          'object',
          'type',
        ],
      },
    ],

    'import/newline-after-import': 'warn',

    'import/dynamic-import-chunkname': [
      'warn',
      {
        webpackChunknameFormat: '[a-zA-Z0-57-9-/_]+',
      },
    ],

    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    'unicorn/prevent-abbreviations': 'off',
    'unicorn/numeric-separators-style': 'warn',
    'unicorn/no-unsafe-regex': 'warn',
    'unicorn/no-unused-properties': 'warn',
    'unicorn/prefer-replace-all': 'warn',
    'unicorn/filename-case': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-abusive-eslint-disable': 'off',
    'sonarjs/no-all-duplicated-branches': 'warn',
  },
  overrides: [
    {
      extends: ['canonical/typescript'],
      files: '*.ts',
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/semi': 'off',
        '@typescript-eslint/space-before-function-paren': 'off',
        '@typescript-eslint/member-delimiter-style': [
          'warn',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
            multilineDetection: 'brackets',
          },
        ],
        'func-style': 'off',
      },
    },
    {
      extends: ['canonical/json'],
      files: '*.json',
    },
    {
      extends: ['canonical/yaml'],
      files: '*.yaml',
    },
  ],
}
