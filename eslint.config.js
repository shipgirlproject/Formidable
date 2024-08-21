const globals = require('globals');
const pluginJs = require('@eslint/js');
const stylisticJs = require('@stylistic/eslint-plugin-js');

module.exports = [
	{
		plugins: {
			'@stylistic/js': stylisticJs
		},
		languageOptions: { globals: globals.node },
		rules: {
			'@stylistic/js/semi': [ 'error' ],
			'@stylistic/js/indent': [ 'error', 'tab', { 'SwitchCase': 1 }],
			'@stylistic/js/space-infix-ops': [ 'error' ],
			'@stylistic/js/key-spacing': [ 'error', { 'mode': 'strict' }],
			'@stylistic/js/keyword-spacing': [ 'error' ],
			'@stylistic/js/quotes': [ 'error', 'single' ],
			'@stylistic/js/comma-dangle': [ 'error', 'never' ],
			'@stylistic/js/brace-style': [ 'error', '1tbs' ],
			'@stylistic/js/object-curly-spacing': [ 'error', 'always', { 'objectsInObjects': false, 'arraysInObjects': false }],
			'@stylistic/js/array-bracket-spacing': [ 'error', 'always', { 'objectsInArrays': false, 'arraysInArrays': false }],
			'@stylistic/js/block-spacing': [ 'error', 'always' ],
			'@stylistic/js/arrow-spacing': 'error',
			'@stylistic/js/switch-colon-spacing': [ 'error', { 'after': true, 'before': false }],
			'@stylistic/js/no-multiple-empty-lines': [ 'error', { 'max': 1 }],
			'@stylistic/js/eol-last': [ 'warn', 'always' ],
			'@stylistic/js/no-trailing-spaces': [ 'warn', { 'ignoreComments': true }]
		}
	},
	pluginJs.configs.recommended
];
