#!/usr/bin/env node

/**
 * Fix Console Logs Script
 * 
 * This script automatically replaces direct console.log calls with our logger utility.
 * It also fixes other common issues found by the production-precheck script.
 * 
 * Usage: 
 * node scripts/fix-console-logs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files and directories to exclude
const EXCLUSIONS = [
  'node_modules',
  '.git',
  '.nuxt',
  '.output',
  'dist',
  'scripts',
  '*.md',
  'utils/logger.ts', // Don't modify our logger utility
];

// Patterns to replace
const REPLACEMENTS = [
  {
    // Replace console.log with logger.log
    pattern: /console\.log\(/g,
    replacement: (match, file) => {
      // Check if we need to import the logger
      const fileContent = fs.readFileSync(file, 'utf8');
      if (!fileContent.includes('import { log') && !fileContent.includes('from \'~/utils/logger\'')) {
        // Add import at the top of the file, after other imports
        const lines = fileContent.split('\n');
        let lastImportIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import ')) {
            lastImportIndex = i;
          }
        }
        
        if (lastImportIndex >= 0) {
          lines.splice(lastImportIndex + 1, 0, 'import { log } from \'~/utils/logger\';');
          fs.writeFileSync(file, lines.join('\n'), 'utf8');
        }
      }
      
      return 'log(';
    }
  },
  {
    // Replace console.error with logger.error
    pattern: /console\.error\(/g,
    replacement: (match, file) => {
      // Check if we need to import the logger
      const fileContent = fs.readFileSync(file, 'utf8');
      if (!fileContent.includes('import { error') && !fileContent.includes('from \'~/utils/logger\'')) {
        // Add import at the top of the file, after other imports
        const lines = fileContent.split('\n');
        let lastImportIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import ')) {
            lastImportIndex = i;
          }
        }
        
        if (lastImportIndex >= 0) {
          // Check if we already have log imported
          if (fileContent.includes('import { log } from \'~/utils/logger\';')) {
            // Replace with combined import
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes('import { log } from \'~/utils/logger\';')) {
                lines[i] = 'import { log, error as logError } from \'~/utils/logger\';';
                break;
              }
            }
          } else {
            lines.splice(lastImportIndex + 1, 0, 'import { error as logError } from \'~/utils/logger\';');
          }
          fs.writeFileSync(file, lines.join('\n'), 'utf8');
        }
      }
      
      return 'logError(';
    }
  }
];

// Get all files recursively
function getFiles(dir, excludePatterns = []) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents
    .filter(dirent => {
      // Check if this path should be excluded
      return !excludePatterns.some(pattern => {
        if (pattern.startsWith('*')) {
          // Extension exclusion
          const ext = pattern.substring(1);
          return dirent.name.endsWith(ext);
        }
        return dirent.name === pattern;
      });
    })
    .map(dirent => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res, excludePatterns) : res;
    });
  
  return Array.prototype.concat(...files);
}

// Fix a file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Skip binary files and non-text content
    if (content.includes('\0') || /^\uFFFD/.test(content)) {
      return false;
    }
    
    // Only process TypeScript and Vue files
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.vue') && !filePath.endsWith('.js')) {
      return false;
    }
    
    // Apply replacements
    for (const { pattern, replacement } of REPLACEMENTS) {
      const newContent = content.replace(pattern, () => replacement(pattern, filePath));
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return false;
  }
}

// Fix .env.example file
function fixEnvExample() {
  const filePath = path.resolve(process.cwd(), '.env.example');
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace API keys with placeholders
      content = content.replace(/RESEND_API_KEY=".*"/g, 'RESEND_API_KEY="your-resend-api-key"');
      content = content.replace(/SUPABASE_ANON_KEY=".*"/g, 'SUPABASE_ANON_KEY="your-supabase-anon-key"');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed .env.example file');
      return true;
    } catch (error) {
      console.error('Error fixing .env.example:', error.message);
      return false;
    }
  }
  return false;
}

// Main function
function main() {
  console.log('Fix Console Logs Starting...\n');
  
  const workingDir = process.cwd();
  console.log(`Working directory: ${workingDir}`);
  
  // Get all files recursively, excluding patterns
  console.log(`Scanning files (excluding ${EXCLUSIONS.join(', ')})...`);
  const files = getFiles(workingDir, EXCLUSIONS);
  console.log(`Found ${files.length} files to check\n`);
  
  // Fix files
  let fixedCount = 0;
  files.forEach(file => {
    const relativeFilePath = path.relative(workingDir, file);
    const fixed = fixFile(file);
    
    if (fixed) {
      console.log(`Fixed: ${relativeFilePath}`);
      fixedCount++;
    }
  });
  
  // Fix .env.example
  fixEnvExample();
  
  console.log(`\nFixed ${fixedCount} files`);
  console.log('\nFix completed. Run production-precheck again to verify the changes.');
}

main(); 