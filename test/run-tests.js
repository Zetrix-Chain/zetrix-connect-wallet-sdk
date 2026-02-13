#!/usr/bin/env node

/**
 * Test Runner for Zetrix Wallet Connect SDK
 * Runs all unit and integration tests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   Zetrix Wallet Connect SDK - Test Suite                 ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Test results tracking
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
};

// Run tests from a directory
async function runTestsInDirectory(dirPath, category) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📂 ${category} Tests`);
    console.log('='.repeat(60));
    
    try {
        const files = fs.readdirSync(dirPath);
        const testFiles = files.filter(file => file.endsWith('.test.js'));
        
        if (testFiles.length === 0) {
            console.log(`⚠️  No test files found in ${dirPath}`);
            return;
        }
        
        for (const file of testFiles) {
            const testPath = path.join(dirPath, file);
            console.log(`\n📝 Running: ${file}`);
            console.log('-'.repeat(60));
            
            try {
                // Dynamically import the test file
                await import(`file:///${testPath.replace(/\\/g, '/')}`);
                
                
                results.passed++;
                console.log(`✅ ${file} completed`);
            } catch (error) {
                results.failed++;
                console.error(`❌ ${file} failed:`);
                console.error(error.message);
            }
            
            results.total++;
        }
    } catch (error) {
        console.error(`❌ Error reading directory ${dirPath}:`, error.message);
    }
}

// Run all tests
async function runAllTests() {
    const testDir = __dirname;
    
    // Run unit tests
    const unitTestDir = path.join(testDir, 'unit');
    if (fs.existsSync(unitTestDir)) {
        await runTestsInDirectory(unitTestDir, 'Unit');
    } else {
        console.log('\n⚠️  Unit test directory not found');
    }
    
    // Run integration tests
    const integrationTestDir = path.join(testDir, 'integration');
    if (fs.existsSync(integrationTestDir)) {
        await runTestsInDirectory(integrationTestDir, 'Integration');
    } else {
        console.log('\n⚠️  Integration test directory not found');
    }
    
    // Print summary
    printSummary();
}

// Print test summary
function printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    console.log(`Total Tests:    ${results.total}`);
    console.log(`✅ Passed:      ${results.passed}`);
    console.log(`❌ Failed:      ${results.failed}`);
    console.log(`⏭️  Skipped:     ${results.skipped}`);
    console.log('='.repeat(60));
    
    const successRate = results.total > 0 
        ? ((results.passed / results.total) * 100).toFixed(2) 
        : 0;
    
    console.log(`\n📈 Success Rate: ${successRate}%`);
    
    if (results.failed === 0 && results.total > 0) {
        console.log('\n🎉 All tests passed! 🎉\n');
        process.exit(0);
    } else if (results.total === 0) {
        console.log('\n⚠️  No tests were run\n');
        process.exit(1);
    } else {
        console.log(`\n❌ ${results.failed} test(s) failed\n`);
        process.exit(1);
    }
}

// Handle CLI arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node run-tests.js [options]');
    console.log('\nOptions:');
    console.log('  --help, -h      Show this help message');
    console.log('  --unit          Run only unit tests');
    console.log('  --integration   Run only integration tests');
    console.log('  --verbose, -v   Show detailed output');
    console.log('\nExamples:');
    console.log('  node run-tests.js');
    console.log('  node run-tests.js --unit');
    console.log('  node run-tests.js --integration --verbose');
    process.exit(0);
}

// Wrap in async IIFE to use await at top level
(async () => {
    if (args.includes('--unit')) {
        const unitTestDir = path.join(__dirname, 'unit');
        await runTestsInDirectory(unitTestDir, 'Unit');
        printSummary();
    } else if (args.includes('--integration')) {
        const integrationTestDir = path.join(__dirname, 'integration');
        await runTestsInDirectory(integrationTestDir, 'Integration');
        printSummary();
    } else {
        // Run all tests
        await runAllTests();
    }
})();
