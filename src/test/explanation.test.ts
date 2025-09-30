import * as assert from 'assert';
import * as vscode from 'vscode';
import { generateExplanationFromAst, getExplanationFromError } from '../extension';
import * as regexpTree from 'regexp-tree';

suite('Regex Explanation Test Suite', () => {
	vscode.window.showInformationMessage('Start regex explanation tests.');

	test('Should generate explanation for simple regex', () => {
		const ast = regexpTree.parse('/abc/');
		const explanation = generateExplanationFromAst(ast);
		assert.strictEqual(explanation.length, 3);
		assert.strictEqual(explanation[0].description, "Matches the character 'a' literally");
		assert.strictEqual(explanation[1].description, "Matches the character 'b' literally");
		assert.strictEqual(explanation[2].description, "Matches the character 'c' literally");
	});

    test('Should generate explanation for regex with metacharacters', () => {
		const ast = regexpTree.parse('/\\d\\s\\w+/');
		const explanation = generateExplanationFromAst(ast);
		assert.strictEqual(explanation.length, 4);
        assert.strictEqual(explanation[0].description, 'Matches any digit (0-9)');
        assert.strictEqual(explanation[1].description, 'Matches any whitespace character (spaces, tabs, newlines)');
        assert.strictEqual(explanation[2].description, 'Matches any word character (alphanumeric & underscore)');
        assert.strictEqual(explanation[3].description, 'Matches the preceding token 1 or more times (greedy)');
	});

    test('Should generate explanation for regex with quantifiers', () => {
        const ast = regexpTree.parse('/a*b{1,3}?c+/');
        const explanation = generateExplanationFromAst(ast);
        assert.strictEqual(explanation.length, 6);
        assert.strictEqual(explanation[1].description, 'Matches the preceding token 0 or more times (greedy)');
        assert.strictEqual(explanation[3].description, 'Matches the preceding token between 1 and 3 times (non-greedy)');
        assert.strictEqual(explanation[5].description, 'Matches the preceding token 1 or more times (greedy)');
    });

    test('Should generate explanation for regex with groups and anchors', () => {
        const ast = regexpTree.parse('/^(a|b)$/');
        const explanation = generateExplanationFromAst(ast);
        assert.strictEqual(explanation.length, 5);
        assert.strictEqual(explanation[0].description, 'Asserts position at the start of the string');
        assert.strictEqual(explanation[1].description, 'A capturing group. Matches and captures the enclosed expression.');
        assert.strictEqual(explanation[3].description, 'Acts like a boolean OR. Matches the expression before or after it.');
        assert.strictEqual(explanation[4].description, 'Asserts position at the end of the string');
    });

	test('Should generate correct error explanation', () => {
		try {
			regexpTree.parse('/(?<name>/');
            assert.fail('Should have thrown an error');
		} catch (error) {
			const explanation = getExplanationFromError(error, '(?<name>');
			assert.strictEqual(explanation.length, 1);
			assert.strictEqual(explanation[0].isError, true);
            assert.strictEqual(explanation[0].description.includes('Syntax Error'), true);
		}
	});
});