#!/usr/bin/env node



interface TestCase {
    name: string;
    pattern: string;
    text: string;
    flags: string;
    expectedMatches: number;
    shouldError?: boolean;
}

interface TestCases {
    [engine: string]: TestCase[];
}

// Test runner functions
function testECMAScript(pattern: string, text: string, flags: string) {
    try {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        const globalRegex = new RegExp(pattern, flags);
        
        while ((match = globalRegex.exec(text)) !== null) {
            matches.push({
                fullMatch: match[0],
                index: match.index,
                groups: match.slice(1),
                endIndex: match.index + match[0].length
            });
            if (!flags.includes('g')) break;
        }
        
        return { matches, engineName: 'ECMAScript' };
    } catch (error: any) {
        return { matches: [], engineName: 'ECMAScript', error: error.message };
    }
}

function testPCRE(pattern: string, text: string, flags: string) {
    try {
        const convertedPattern = pattern.replace(/\(\?P<([^>]+)>/g, '(?<$1>');
        return testECMAScript(convertedPattern, text, flags);
    } catch (error: any) {
        return { matches: [], engineName: 'PCRE (Emulated)', error: error.message };
    }
}

function testGolang(pattern: string, text: string, flags: string) {
    try {
        if (pattern.includes('\\1') || pattern.includes('\\2')) {
            throw new Error('RE2 does not support backreferences');
        }
        const convertedPattern = pattern.replace(/\(\?P<([^>]+)>/g, '(?<$1>');
        return testECMAScript(convertedPattern, text, flags);
    } catch (error: any) {
        return { matches: [], engineName: 'Go RE2 (Emulated)', error: error.message };
    }
}

function runTests() {
    console.log('🧪 Running Regex Engine Tests\\n');
    
    const testCases: TestCases = {
        ecma: [
            {
                name: 'Email validation',
                pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
                text: 'Contact us at john@example.com or support@test.org',
                flags: 'g',
                expectedMatches: 2
            },
            {
                name: 'Backreferences',
                pattern: '(\\w+)\\s+\\1',
                text: 'hello hello world world test',
                flags: 'g',
                expectedMatches: 2
            }
        ],
        pcre: [
            {
                name: 'PCRE named groups',
                pattern: '(?P<user>\\w+)@(?P<domain>\\w+\\.\\w+)',
                text: 'Email: john@example.com and jane@test.org',
                flags: 'g',
                expectedMatches: 2
            }
        ],
        golang: [
            {
                name: 'Go named groups',
                pattern: '(?P<name>\\w+)=(?P<value>\\d+)',
                text: 'config: width=800 height=600 depth=32',
                flags: 'g',
                expectedMatches: 3
            },
            {
                name: 'No backreferences (should fail)',
                pattern: '(\\w+)\\s+\\1',
                text: 'hello hello world',
                flags: 'g',
                expectedMatches: 0,
                shouldError: true
            }
        ],
        python: [
            {
                name: 'Python named groups',
                pattern: '(?P<protocol>https?)://(?P<domain>[^/]+)',
                text: 'Visit https://example.com or http://test.org',
                flags: 'g',
                expectedMatches: 1
            }
        ],
        java: [
            {
                name: 'Java pattern',
                pattern: '\\b[A-Z][a-z]+\\b',
                text: 'Java Python JavaScript Go Rust',
                flags: 'g',
                expectedMatches: 4
            }
        ],
        rust: [
            {
                name: 'Rust pattern',
                pattern: 'fn\\s+(\\w+)\\s*\\(',
                text: 'fn main() { fn test() { fn helper() {',
                flags: 'g',
                expectedMatches: 3
            }
        ]
    };
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    Object.entries(testCases).forEach(([engine, cases]) => {
        console.log(`\\n📋 Testing ${engine.toUpperCase()} Engine:`);
        console.log('─'.repeat(50));
        
        cases.forEach((testCase, index) => {
            totalTests++;
            let result;
            
            switch (engine) {
                case 'ecma':
                    result = testECMAScript(testCase.pattern, testCase.text, testCase.flags);
                    break;
                case 'pcre':
                case 'python':
                    result = testPCRE(testCase.pattern, testCase.text, testCase.flags);
                    break;
                case 'golang':
                    result = testGolang(testCase.pattern, testCase.text, testCase.flags);
                    break;
                default:
                    result = testECMAScript(testCase.pattern, testCase.text, testCase.flags);
            }
            
            const passed = testCase.shouldError 
                ? (result.error || result.matches.length === 0)
                : (result.matches.length === testCase.expectedMatches);
            
            if (passed) {
                passedTests++;
                console.log(`✅ ${testCase.name}`);
                if (testCase.shouldError && result.error) {
                    console.log(`   Expected error: ${result.error}`);
                } else {
                    console.log(`   Found ${result.matches.length}/${testCase.expectedMatches} matches`);
                }
            } else {
                failedTests++;
                console.log(`❌ ${testCase.name}`);
                console.log(`   Expected: ${testCase.expectedMatches} matches`);
                console.log(`   Got: ${result.matches.length} matches`);
                if (result.error) {
                    console.log(`   Error: ${result.error}`);
                }
            }
        });
    });
    
    console.log('\\n' + '='.repeat(50));
    console.log(`📊 Test Results:`);
    console.log(`   Total: ${totalTests}`);
    console.log(`   Passed: ${passedTests} ✅`);
    console.log(`   Failed: ${failedTests} ❌`);
    console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

export { runTests };