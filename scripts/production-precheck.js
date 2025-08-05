#!/usr/bin/env node

/**
 * Production Precheck Script
 * 
 * This script scans the codebase for potential issues that should be fixed
 * before deploying to production, such as:
 * 
 * - console.log statements that might leak sensitive information
 * - Hardcoded API keys or credentials
 * - Development flags that should be disabled
 * - Debug code that should be removed
 * 
 * Usage: 
 * node scripts/production-precheck.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
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
];

// Patterns to search for (with severity levels)
const PATTERNS = [
  { 
    pattern: /console\.log/g, 
    severity: 'WARNING',
    message: 'Direct console.log call - use logger utility instead' 
  },
  { 
    pattern: /console\.error/g, 
    severity: 'INFO',
    message: 'Direct console.error call - consider using logger.error' 
  },
  { 
    pattern: /debugger;/g, 
    severity: 'ERROR',
    message: 'Debugger statement found - must be removed' 
  },
  { 
    pattern: /(API_KEY|RESEND_API_KEY|SUPABASE.*KEY).*?=.*?["'][a-zA-Z0-9_\-\.]+["']/g, 
    severity: 'ERROR',
    message: 'Possible hardcoded API key' 
  },
  { 
    pattern: /TODO|FIXME/g, 
    severity: 'WARNING',
    message: 'Todo/fixme comment found' 
  },
  { 
    pattern: /process\.env\.NODE_ENV\s*!==?\s*['"]production['"]/g, 
    severity: 'INFO',
    message: 'Development environment check - ensure it works correctly' 
  }
];

// Output colors
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

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

// Check a file for issues
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Skip binary files and non-text content
    if (content.includes('\0') || /^\uFFFD/.test(content)) {
      return [];
    }
    
    // Check each pattern
    PATTERNS.forEach(({ pattern, severity, message }) => {
      let match;
      pattern.lastIndex = 0; // Reset regex state
      
      while ((match = pattern.exec(content)) !== null) {
        // Calculate line number
        const lineNumber = (content.substring(0, match.index).match(/\n/g) || []).length + 1;
        
        // Get the line content for context
        const lines = content.split('\n');
        const lineContent = lines[lineNumber - 1].trim();
        
        // Skip commented lines and empty values for API keys
        if ((pattern.toString().includes('API_KEY') || pattern.toString().includes('SUPABASE')) && 
            (lineContent.trim().startsWith('#') || 
             lineContent.includes('=""') || 
             lineContent.includes('=\'\'') ||
             lineContent.includes('optional()') ||
             // Skip API keys in .env files during development
             (process.env.NODE_ENV !== 'production' && 
              (filePath.endsWith('.env') || filePath.endsWith('.env.local') || filePath.endsWith('.env.example'))))) {
          continue;
        }
        
        issues.push({
          filePath,
          lineNumber,
          lineContent,
          severity,
          message,
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return [];
  }
}

// Main function
function main() {
  console.log(`${COLORS.cyan}Production Precheck Starting...${COLORS.reset}\n`);
  
  const workingDir = process.cwd();
  console.log(`${COLORS.blue}Working directory: ${workingDir}${COLORS.reset}`);
  
  // Get all files recursively, excluding patterns
  console.log(`${COLORS.blue}Scanning files (excluding ${EXCLUSIONS.join(', ')})...${COLORS.reset}`);
  const files = getFiles(workingDir, EXCLUSIONS);
  console.log(`${COLORS.green}Found ${files.length} files to check${COLORS.reset}\n`);
  
  // Check all files
  let allIssues = [];
  files.forEach(file => {
    const relativeFilePath = path.relative(workingDir, file);
    const issues = checkFile(file);
    
    if (issues.length > 0) {
      allIssues = [...allIssues, ...issues];
    }
  });
  
  // Sort issues by severity
  allIssues.sort((a, b) => {
    const severityOrder = { 'ERROR': 0, 'WARNING': 1, 'INFO': 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  // Group issues by file
  const issuesByFile = {};
  allIssues.forEach(issue => {
    const relFilePath = path.relative(workingDir, issue.filePath);
    if (!issuesByFile[relFilePath]) {
      issuesByFile[relFilePath] = [];
    }
    issuesByFile[relFilePath].push(issue);
  });
  
  // Print report
  console.log(`${COLORS.cyan}Production Precheck Results:${COLORS.reset}\n`);
  
  if (allIssues.length === 0) {
    console.log(`${COLORS.green}✅ No issues found!${COLORS.reset}\n`);
  } else {
    const errorCount = allIssues.filter(i => i.severity === 'ERROR').length;
    const warningCount = allIssues.filter(i => i.severity === 'WARNING').length;
    const infoCount = allIssues.filter(i => i.severity === 'INFO').length;
    
    console.log(`${COLORS.red}Issues found: ${allIssues.length} total${COLORS.reset}`);
    console.log(`${COLORS.red}${errorCount} errors${COLORS.reset}, ${COLORS.yellow}${warningCount} warnings${COLORS.reset}, ${COLORS.blue}${infoCount} info${COLORS.reset}\n`);
    
    // Print issues by file
    Object.keys(issuesByFile).forEach(filePath => {
      console.log(`${COLORS.cyan}File: ${filePath}${COLORS.reset}`);
      
      issuesByFile[filePath].forEach(issue => {
        const severityColor = 
          issue.severity === 'ERROR' ? COLORS.red :
          issue.severity === 'WARNING' ? COLORS.yellow : 
          COLORS.blue;
        
        console.log(`  ${severityColor}[${issue.severity}]${COLORS.reset} Line ${issue.lineNumber}: ${issue.message}`);
        console.log(`    ${COLORS.magenta}${issue.lineContent}${COLORS.reset}`);
      });
      
      console.log(''); // Add a newline between files
    });
    
    // Add recommendations
    console.log(`${COLORS.cyan}Recommendations:${COLORS.reset}`);
    console.log(`1. Use the logger utility in ~/utils/logger.ts for any console logging`);
    console.log(`2. Remove all debugger statements`);
    console.log(`3. Check all environment-specific code to ensure it works in production`);
    console.log(`4. Replace hardcoded API keys with environment variables\n`);
    
    if (errorCount > 0) {
      console.log(`${COLORS.red}⚠️  ${errorCount} critical issues must be fixed before deployment!${COLORS.reset}\n`);
      process.exit(1); // Exit with error code
    } else if (warningCount > 0) {
      console.log(`${COLORS.yellow}⚠️  ${warningCount} warnings should be reviewed before deployment${COLORS.reset}\n`);
    }
  }
  
  console.log(`${COLORS.green}Production precheck completed.${COLORS.reset}`);
}

main(); 