#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Fix API Keys Starting...\n');
console.log('Working directory:', rootDir);

// Files to fix
const filesToFix = [
  '.env.example',
  'utils/env.ts',
  'nuxt.config.ts',
  'plugins/env-check.ts'
];

// Function to fix .env.example file
function fixEnvExample() {
  const filePath = path.join(rootDir, '.env.example');
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace hardcoded API keys with placeholders
  content = content.replace(/RESEND_API_KEY=".*"/g, 'RESEND_API_KEY=""');
  content = content.replace(/SUPABASE_ANON_KEY=".*"/g, 'SUPABASE_ANON_KEY=""');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: .env.example');
  return true;
}

// Function to fix utils/env.ts file
function fixEnvTs() {
  const filePath = path.join(rootDir, 'utils/env.ts');
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace hardcoded API keys with empty defaults
  content = content.replace(/SUPABASE_ANON_KEY: z\.string\(\)\.min\(1\)\.default\('.*'\)/g, 
    'SUPABASE_ANON_KEY: z.string().min(1)');
  content = content.replace(/RESEND_API_KEY: z\.string\(\)\.min\(1\)\.optional\(\)/g, 
    'RESEND_API_KEY: z.string().min(1).optional()');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: utils/env.ts');
  return true;
}

// Function to fix nuxt.config.ts file
function fixNuxtConfig() {
  const filePath = path.join(rootDir, 'nuxt.config.ts');
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add comments to explain the environment variables
  content = content.replace(/resendApiKey: process\.env\.RESEND_API_KEY,/g, 
    '// API key for Resend email service\n    resendApiKey: process.env.RESEND_API_KEY,');
  content = content.replace(/key: process\.env\.SUPABASE_ANON_KEY/g, 
    '// Anonymous key for Supabase authentication\n      key: process.env.SUPABASE_ANON_KEY');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: nuxt.config.ts');
  return true;
}

// Function to fix plugins/env-check.ts file
function fixEnvCheck() {
  const filePath = path.join(rootDir, 'plugins/env-check.ts');
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add comments to explain the environment variables
  content = content.replace(/const supabaseKey = process\.env\.SUPABASE_ANON_KEY \|\| ''/g, 
    '// Get Supabase key from environment variables\n  const supabaseKey = process.env.SUPABASE_ANON_KEY || \'\'');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: plugins/env-check.ts');
  return true;
}

// Main function
function main() {
  let fixedCount = 0;
  
  // Fix .env.example
  if (fixEnvExample()) fixedCount++;
  
  // Fix utils/env.ts
  if (fixEnvTs()) fixedCount++;
  
  // Fix nuxt.config.ts
  if (fixNuxtConfig()) fixedCount++;
  
  // Fix plugins/env-check.ts
  if (fixEnvCheck()) fixedCount++;
  
  console.log(`\nFixed ${fixedCount} files`);
  console.log('\nFix completed. Run production-precheck again to verify the changes.');
}

main(); 