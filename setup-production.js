#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 Setting up SavviWell for production...');

// Check if database is accessible
try {
  console.log('📊 Checking database connection...');
  execSync('npm run db:push', { stdio: 'inherit' });
  console.log('✅ Database schema updated successfully');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}

// Build the application
try {
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application built successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🎉 SavviWell is ready for production!');
console.log('Start with: npm start');