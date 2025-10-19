#!/usr/bin/env node

/**
 * Queue Worker Script
 * 
 * This script starts the Bee-Queue workers to process email jobs.
 * Run this in a separate process from your main Next.js application.
 * 
 * Usage:
 *   node scripts/queue-worker.js
 *   npm run queue:worker
 */

const path = require('path');

// Set up environment
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Import queue processors to start them
require('../src/lib/queue/processors');

console.log('🚀 Starting queue workers...');
console.log('📧 Email queue worker started');
console.log('📝 Waitlist queue worker started');
console.log('⏳ Waiting for jobs...');

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down queue workers...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down queue workers...');
  process.exit(0);
});