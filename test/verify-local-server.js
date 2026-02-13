#!/usr/bin/env node

/**
 * WebSocket Server Connection Test
 * Verifies connection to local WebSocket server
 */

import WebSocket from 'ws';

const SERVER_URL = 'ws://localhost:40027/websocket/server';
const TIMEOUT = 5000; // 5 seconds

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║  WebSocket Server Connection Test                     ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log(`Testing connection to: ${SERVER_URL}\n`);

let connected = false;
let timeout;

const ws = new WebSocket(SERVER_URL);

// Set timeout
timeout = setTimeout(() => {
    if (!connected) {
        console.log('❌ Connection timeout after 5 seconds\n');
        console.log('Troubleshooting:');
        console.log('1. Verify server is running on port 40027');
        console.log('2. Check server accepts WebSocket connections');
        console.log('3. Verify path: /websocket/server');
        console.log('4. Check firewall settings\n');
        ws.close();
        process.exit(1);
    }
}, TIMEOUT);

ws.on('open', () => {
    connected = true;
    clearTimeout(timeout);
    
    console.log('✅ WebSocket connection established!\n');
    console.log('Connection Details:');
    console.log(`  URL: ${SERVER_URL}`);
    console.log(`  Ready State: ${ws.readyState} (OPEN)`);
    console.log(`  Protocol: ${ws.protocol || 'none'}\n`);
    
    // Send a test message
    console.log('📤 Sending test ping...');
    ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    
    // Wait for response or close after 2 seconds
    setTimeout(() => {
        console.log('\n✅ Connection test successful!');
        console.log('Your local WebSocket server is ready for testing.\n');
        ws.close();
        process.exit(0);
    }, 2000);
});

ws.on('message', (data) => {
    console.log('📥 Received message from server:');
    try {
        const parsed = JSON.parse(data);
        console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
        console.log(data.toString());
    }
});

ws.on('error', (error) => {
    clearTimeout(timeout);
    console.log('❌ Connection error:\n');
    console.log(`  Error: ${error.message}\n`);
    console.log('Troubleshooting:');
    console.log('1. Is the WebSocket server running?');
    console.log('   Check: netstat -an | findstr :40027');
    console.log('2. Is the server accepting WebSocket connections?');
    console.log('3. Check server logs for errors');
    console.log('4. Verify the server path: /websocket/server\n');
    process.exit(1);
});

ws.on('close', (code, reason) => {
    if (connected) {
        console.log(`\n🔌 Connection closed (Code: ${code})`);
        if (reason) {
            console.log(`   Reason: ${reason}`);
        }
    }
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Test interrupted');
    ws.close();
    process.exit(0);
});
