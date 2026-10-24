// ESLint for the quick app: the .js modules and the <script> block of each
// .ux page. Run with `npm run lint`.
const js = require('@eslint/js')
const globals = require('globals')

// Lints only the <script> of a .ux file. Blank lines stand in for the
// template above it, so reported line numbers match the file.
const ux = {
  preprocess(text) {
    const match = /<script>([\s\S]*?)<\/script>/.exec(text)
    if (!match) return []
    const before = text.slice(0, match.index + '<script>'.length)
    const padding = before.split('\n').length - 1
    return [{ text: '\n'.repeat(padding) + match[1], filename: 'script.js' }]
  },
  postprocess(messages) {
    return messages.flat()
  }
}

module.exports = [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'tools/', 'eslint.config.js']
  },
  {
    files: ['src/**/*.ux'],
    plugins: { klikband: { processors: { ux } } },
    processor: 'klikband/ux'
  },
  {
    files: ['src/**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // The toolkit's own check assumes browser and node globals (setTimeout, ...)
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      ...js.configs.recommended.rules,
      // Empty catch blocks are used on purpose around APIs some devices lack
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  }
]
