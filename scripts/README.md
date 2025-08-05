# Production Scripts

This directory contains scripts for preparing the codebase for production deployment and ensuring security best practices.

## Available Scripts

### 1. Production Precheck (`production-precheck.js`)

Scans the codebase for potential security issues and code quality problems.

**Usage:**
```bash
npm run production-precheck
# or
node scripts/production-precheck.js
```

**What it checks:**
- Direct console.log statements that might leak sensitive information
- Hardcoded API keys or credentials
- Debugger statements
- TODO/FIXME comments
- Environment-specific code

**Output:**
- Lists all issues found, categorized by severity (ERROR, WARNING, INFO)
- Provides recommendations for fixing the issues
- Returns a non-zero exit code if critical issues are found

### 2. Fix Console Logs (`fix-console-logs.js`)

Automatically replaces direct console.log and console.error calls with the logger utility.

**Usage:**
```bash
node scripts/fix-console-logs.js
```

**What it does:**
- Scans the codebase for direct console.log and console.error calls
- Replaces them with logger.log and logger.error
- Adds the necessary import statement for the logger utility
- Skips certain files and directories (node_modules, .git, etc.)

### 3. Fix API Keys (`fix-api-keys.js`)

Removes hardcoded API keys and replaces them with empty placeholders.

**Usage:**
```bash
node scripts/fix-api-keys.js
```

**What it does:**
- Fixes .env.example file by replacing hardcoded API keys with empty placeholders
- Updates utils/env.ts to remove default values for API keys
- Adds comments to explain environment variables in configuration files
- Ensures API keys are properly referenced from environment variables

## Workflow

1. Run the production precheck to identify issues:
   ```bash
   npm run production-precheck
   ```

2. If console.log issues are found, run the fix-console-logs script:
   ```bash
   node scripts/fix-console-logs.js
   ```

3. If API key issues are found, run the fix-api-keys script:
   ```bash
   node scripts/fix-api-keys.js
   ```

4. Run the production precheck again to verify all issues are fixed:
   ```bash
   npm run production-precheck
   ```

5. Address any remaining issues manually if needed.

## Troubleshooting

### Logger Import Issues

If you encounter errors related to logger imports, check that you're using the correct import syntax:

- For individual functions: `import { log, error } from '~/utils/logger'`
- For the logger object: `import { logger } from '~/utils/logger'`

The logger utility supports both styles to maintain compatibility with existing code. 