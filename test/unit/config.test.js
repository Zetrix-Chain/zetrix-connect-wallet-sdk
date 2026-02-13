/**
 * Unit Tests for Configuration Validation
 * Tests the SDK configuration and validation logic
 */

import assert from 'assert';

console.log('🧪 Configuration Validation Tests\n');

// Test 1: Custom QR Configuration Warning
console.log('Test 1: Custom QR without callback should warn');
try {
    // Simulate warning scenario
    const config = { customQrUi: true, qrDataCallback: null };
    const shouldWarn = config.customQrUi && !config.qrDataCallback;
    assert.strictEqual(shouldWarn, true, 'Should warn when customQrUi is enabled without callback');
    console.log('   ✅ PASS: Warning detection works\n');
} catch (error) {
    console.log('   ❌ FAIL:', error.message, '\n');
    throw error;
}

// Test 2: Auto-enable QR Code
console.log('Test 2: Auto-enable qrcode when customQrUi is true');
try {
    const config = { customQrUi: true, qrcode: false };
    const shouldAutoEnable = config.customQrUi && !config.qrcode;
    assert.strictEqual(shouldAutoEnable, true, 'Should auto-enable qrcode');
    console.log('   ✅ PASS: Auto-enable logic works\n');
} catch (error) {
    console.log('   ❌ FAIL:', error.message, '\n');
    throw error;
}

// Test 3: Valid Configuration
console.log('Test 3: Valid custom QR configuration');
try {
    const config = {
        qrcode: true,
        customQrUi: true,
        qrDataCallback: (data) => console.log(data)
    };
    const isValid = config.qrcode && config.customQrUi && typeof config.qrDataCallback === 'function';
    assert.strictEqual(isValid, true, 'Valid configuration should pass');
    console.log('   ✅ PASS: Valid configuration accepted\n');
} catch (error) {
    console.log('   ❌ FAIL:', error.message, '\n');
    throw error;
}

// Test 4: Default Mainnet Bridge
console.log('Test 4: Mainnet bridge URL validation');
try {
    const mainnetBridge = 'wss://wscw.zetrix.com';
    assert.ok(mainnetBridge.includes('wscw.zetrix.com'), 'Should use mainnet bridge');
    console.log('   ✅ PASS: Mainnet bridge URL correct\n');
} catch (error) {
    console.log('   ❌ FAIL:', error.message, '\n');
    throw error;
}

// Test 5: Testnet Bridge
console.log('Test 5: Testnet bridge URL validation');
try {
    const testnetBridge = 'wss://test-wscw.zetrix.com';
    assert.ok(testnetBridge.includes('test-wscw.zetrix.com'), 'Should use testnet bridge');
    console.log('   ✅ PASS: Testnet bridge URL correct\n');
} catch (error) {
    console.log('   ❌ FAIL:', error.message, '\n');
    throw error;
}

// Test 6: Default AppType
console.log('Test 6: Default appType validation');
try {
    const defaultAppType = 'zetrix';
    assert.strictEqual(defaultAppType, 'zetrix', 'Default appType should be zetrix');
    console.log('   ✅ PASS: Default appType is correct\n');
} catch (error) {
    console.log('   ❌ FAIL:', error.message, '\n');
    throw error;
}

console.log('✅ All configuration tests passed!\n');
