module.exports = {
  parser: 'babel-eslint',

  extends: [
    'standard',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
  ],

  plugins: ['react', 'react-native', 'import', 'jest'],

  settings: {
    'import/core-modules': ['react-native-screens'],
  },

  env: {
    'react-native/react-native': true,
    'jest/globals': true,
  },

  rules: {
    'import/no-unresolved': 2,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint/eslint-plugin'],
      settings: {
        'import/extensions': ['.js', '.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.tsx'],
          },
        },
      },
      rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'as' },
        ],
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-dynamic-delete': 'error',
        '@typescript-eslint/no-empty-interface': [
          'error',
          { allowSingleExtends: true },
        ],
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        '@typescript-eslint/no-extraneous-class': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/triple-slash-reference': 'error',
        '@typescript-eslint/unified-signatures': 'error',

        'default-case': 'off',
        'no-dupe-class-members': 'off',
        'no-unused-vars': 'off',
        'no-array-constructor': 'off',
        'no-use-before-define': 'off',
      },
    },
  ],
};
