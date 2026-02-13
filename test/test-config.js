/**
 * Test Configuration
 * Configure WebSocket server and test settings
 */

// WebSocket Server Configuration
export const TEST_CONFIG = {
    // Local WebSocket server (for development/testing)
    LOCAL_SERVER: 'ws://localhost:40027',
    
    // Remote servers
    TESTNET_SERVER: 'wss://test-wscw.zetrix.com',
    MAINNET_SERVER: 'wss://wscw.zetrix.com',
    
    // Current server to use (change this to switch servers)
    CURRENT_SERVER: 'LOCAL',  // Options: 'LOCAL', 'TESTNET', 'MAINNET'
    
    // Get the current bridge URL
    getBridgeUrl() {
        switch(this.CURRENT_SERVER) {
            case 'LOCAL':
                return this.LOCAL_SERVER;
            case 'TESTNET':
                return this.TESTNET_SERVER;
            case 'MAINNET':
                return this.MAINNET_SERVER;
            default:
                return this.LOCAL_SERVER;
        }
    },
    
    // Test settings
    useTestnet: true,
    qrcodeMode: true,
    customQrUi: true
};

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.TEST_CONFIG = TEST_CONFIG;
}

export default TEST_CONFIG;

console.log('Test Configuration Loaded');
console.log('Current Server:', TEST_CONFIG.CURRENT_SERVER);
console.log('Bridge URL:', TEST_CONFIG.getBridgeUrl());
