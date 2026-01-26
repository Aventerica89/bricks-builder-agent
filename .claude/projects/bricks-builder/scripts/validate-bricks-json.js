#!/usr/bin/env node

/**
 * Bricks Builder JSON Validator
 * 
 * Validates Bricks Builder JSON exports for:
 * 1. Schema compliance (required fields, types)
 * 2. ID uniqueness and format
 * 3. Parent-child relationship integrity
 * 4. Global class references
 * 5. ACSS variable usage
 */

const fs = require('fs');
const path = require('path');

// ============================================
// SCHEMA DEFINITIONS
// ============================================

const REQUIRED_ROOT_FIELDS = ['content', 'source', 'sourceUrl', 'version', 'globalClasses'];

const REQUIRED_ELEMENT_FIELDS = ['id', 'name', 'parent', 'settings'];

const VALID_ELEMENT_NAMES = [
  'section', 'container', 'block', 'div',
  'heading', 'text', 'text-basic', 'rich-text',
  'image', 'video', 'icon', 'svg',
  'button', 'link', 'nav-menu',
  'form', 'input', 'textarea', 'select',
  'accordion', 'tabs', 'slider', 'carousel',
  'posts', 'template'
];

const ID_PATTERN = /^[a-z0-9]{5,8}$/;

const ACSS_VARIABLE_PATTERN = /var\(--[a-z0-9-]+\)/g;

// ============================================
// VALIDATION FUNCTIONS
// ============================================

class ValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  addError(file, message, location = null) {
    this.errors.push({ file, message, location, severity: 'ERROR' });
  }

  addWarning(file, message, location = null) {
    this.warnings.push({ file, message, location, severity: 'WARNING' });
  }

  addInfo(file, message) {
    this.info.push({ file, message, severity: 'INFO' });
  }

  get isValid() {
    return this.errors.length === 0;
  }

  get summary() {
    return {
      errors: this.errors.length,
      warnings: this.warnings.length,
      info: this.info.length,
      isValid: this.isValid
    };
  }
}

function validateRootStructure(json, filename, result) {
  // Check required root fields
  for (const field of REQUIRED_ROOT_FIELDS) {
    if (!(field in json)) {
      result.addError(filename, `Missing required root field: ${field}`);
    }
  }

  // Validate source field
  if (json.source && json.source !== 'bricksCopiedElements') {
    result.addWarning(filename, `Unexpected source value: ${json.source} (expected: bricksCopiedElements)`);
  }

  // Validate version format
  if (json.version && !/^\d+\.\d+\.\d+$/.test(json.version)) {
    result.addWarning(filename, `Invalid version format: ${json.version}`);
  }

  // Validate content is array
  if (json.content && !Array.isArray(json.content)) {
    result.addError(filename, `content must be an array`);
  }

  // Validate globalClasses is array
  if (json.globalClasses && !Array.isArray(json.globalClasses)) {
    result.addError(filename, `globalClasses must be an array`);
  }
}

function validateElements(json, filename, result) {
  if (!Array.isArray(json.content)) return;

  const ids = new Set();
  const parentRefs = new Set();
  const childRefs = new Set();

  for (const element of json.content) {
    // Check required fields
    for (const field of REQUIRED_ELEMENT_FIELDS) {
      if (!(field in element)) {
        result.addError(filename, `Element missing required field: ${field}`, `id: ${element.id || 'unknown'}`);
      }
    }

    // Validate ID format
    if (element.id) {
      if (!ID_PATTERN.test(element.id)) {
        result.addWarning(filename, `ID doesn't match expected pattern (5-8 alphanumeric): ${element.id}`);
      }

      // Check for duplicate IDs
      if (ids.has(element.id)) {
        result.addError(filename, `Duplicate element ID: ${element.id}`);
      }
      ids.add(element.id);
    }

    // Validate element name
    if (element.name && !VALID_ELEMENT_NAMES.includes(element.name)) {
      result.addInfo(filename, `Custom/unknown element type: ${element.name} (id: ${element.id})`);
    }

    // Track parent references
    if (element.parent && element.parent !== 0) {
      parentRefs.add(element.parent);
    }

    // Track child references
    if (Array.isArray(element.children)) {
      for (const childId of element.children) {
        childRefs.add(childId);
      }
    }
  }

  // Validate parent references exist
  for (const parentId of parentRefs) {
    if (!ids.has(parentId)) {
      result.addError(filename, `Parent reference to non-existent ID: ${parentId}`);
    }
  }

  // Validate child references exist
  for (const childId of childRefs) {
    if (!ids.has(childId)) {
      result.addError(filename, `Child reference to non-existent ID: ${childId}`);
    }
  }

  result.addInfo(filename, `Total elements: ${json.content.length}`);
}

function validateGlobalClasses(json, filename, result) {
  if (!Array.isArray(json.globalClasses)) return;

  const classIds = new Set();
  const classNames = new Set();
  const referencedClasses = new Set();

  // Collect all referenced global classes from elements
  if (Array.isArray(json.content)) {
    for (const element of json.content) {
      if (element.settings && element.settings._cssGlobalClasses) {
        for (const className of element.settings._cssGlobalClasses) {
          referencedClasses.add(className);
        }
      }
    }
  }

  // Validate global class definitions
  for (const gc of json.globalClasses) {
    if (!gc.id) {
      result.addError(filename, `Global class missing ID`);
    } else if (classIds.has(gc.id)) {
      result.addError(filename, `Duplicate global class ID: ${gc.id}`);
    } else {
      classIds.add(gc.id);
    }

    if (!gc.name) {
      result.addError(filename, `Global class missing name (id: ${gc.id})`);
    } else if (classNames.has(gc.name)) {
      result.addWarning(filename, `Duplicate global class name: ${gc.name}`);
    } else {
      classNames.add(gc.name);
    }

    // Check if class is used
    if (gc.name && !referencedClasses.has(gc.name) && !referencedClasses.has(gc.id)) {
      result.addWarning(filename, `Global class defined but not used: ${gc.name}`);
    }
  }

  // Check for referenced but undefined classes
  for (const refClass of referencedClasses) {
    if (!classNames.has(refClass) && !classIds.has(refClass)) {
      // Could be an ACSS class or external class
      if (refClass.startsWith('acss_') || refClass.includes('--')) {
        result.addInfo(filename, `External/ACSS class referenced: ${refClass}`);
      } else {
        result.addWarning(filename, `Referenced class not defined in globalClasses: ${refClass}`);
      }
    }
  }

  result.addInfo(filename, `Total global classes: ${json.globalClasses.length}`);
}

function validateACSSUsage(json, filename, result) {
  const acssVars = new Set();
  const jsonStr = JSON.stringify(json);
  
  // Find all ACSS variable references
  const matches = jsonStr.match(ACSS_VARIABLE_PATTERN) || [];
  for (const match of matches) {
    acssVars.add(match);
  }

  // Check for hardcoded values that should be variables
  const hardcodedColors = jsonStr.match(/#[0-9a-fA-F]{3,8}/g) || [];
  if (hardcodedColors.length > 0) {
    result.addWarning(filename, `Found ${hardcodedColors.length} hardcoded color values. Consider using ACSS variables.`);
  }

  const hardcodedPx = (jsonStr.match(/"\d+px"/g) || []).filter(v => !v.includes('0px'));
  if (hardcodedPx.length > 5) {
    result.addWarning(filename, `Found ${hardcodedPx.length} hardcoded pixel values. Consider using ACSS spacing variables.`);
  }

  result.addInfo(filename, `ACSS variables used: ${acssVars.size}`);
}

function validateBricksJSON(filePath) {
  const result = new ValidationResult();
  const filename = path.basename(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);

    validateRootStructure(json, filename, result);
    validateElements(json, filename, result);
    validateGlobalClasses(json, filename, result);
    validateACSSUsage(json, filename, result);

  } catch (error) {
    if (error instanceof SyntaxError) {
      result.addError(filename, `Invalid JSON: ${error.message}`);
    } else {
      result.addError(filename, `Error reading file: ${error.message}`);
    }
  }

  return result;
}

// ============================================
// MARKDOWN LINTING
// ============================================

function lintMarkdown(filePath) {
  const result = new ValidationResult();
  const filename = path.basename(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let inCodeBlock = false;
    let lastHeadingLevel = 0;
    let hasTitle = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // Track code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) continue;

      // Check for title (H1)
      if (line.startsWith('# ') && !hasTitle) {
        hasTitle = true;
      }

      // Check heading hierarchy
      const headingMatch = line.match(/^(#{1,6})\s/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        if (level > lastHeadingLevel + 1 && lastHeadingLevel > 0) {
          result.addWarning(filename, `Heading level skipped (H${lastHeadingLevel} to H${level})`, `line ${lineNum}`);
        }
        lastHeadingLevel = level;
      }

      // Check for trailing whitespace
      if (line.endsWith(' ') || line.endsWith('\t')) {
        result.addInfo(filename, `Trailing whitespace`, `line ${lineNum}`);
      }

      // Check for very long lines (outside code blocks)
      if (line.length > 200) {
        result.addWarning(filename, `Line exceeds 200 characters (${line.length})`, `line ${lineNum}`);
      }

      // Check for broken links (basic pattern)
      const brokenLinkMatch = line.match(/\[([^\]]+)\]\(\s*\)/);
      if (brokenLinkMatch) {
        result.addError(filename, `Empty link target: [${brokenLinkMatch[1]}]()`, `line ${lineNum}`);
      }
    }

    if (!hasTitle) {
      result.addWarning(filename, `Missing H1 title`);
    }

    result.addInfo(filename, `Total lines: ${lines.length}`);

  } catch (error) {
    result.addError(filename, `Error reading file: ${error.message}`);
  }

  return result;
}

// ============================================
// MAIN EXECUTION
// ============================================

function findFiles(dir, extension, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findFiles(fullPath, extension, files);
    } else if (item.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  const baseDir = path.resolve(__dirname, '..');
  const knowledgeDir = path.resolve(baseDir, '../../knowledge/bricks');
  
  console.log('=' .repeat(60));
  console.log('BRICKS BUILDER PROJECT VALIDATION');
  console.log('=' .repeat(60));
  console.log('');

  const allResults = [];

  // Find and validate JSON files
  console.log('## JSON VALIDATION');
  console.log('-'.repeat(40));
  
  const jsonFiles = [
    ...findFiles(path.join(knowledgeDir, 'patterns'), '.json'),
    ...findFiles(path.join(baseDir, 'campaigns'), '.json')
  ];

  for (const file of jsonFiles) {
    // Skip large ACSS settings files
    if (file.includes('acss-settings') || file.includes('acss-active')) {
      console.log(`SKIP  Skipping ACSS settings: ${path.basename(file)}`);
      continue;
    }
    
    const result = validateBricksJSON(file);
    allResults.push(result);
    
    const icon = result.isValid ? 'PASS' : 'FAIL';
    console.log(`${icon} ${path.basename(file)}`);
    
    for (const err of result.errors) {
      console.log(`   ERROR: ${err.message}${err.location ? ` (${err.location})` : ''}`);
    }
    for (const warn of result.warnings) {
      console.log(`   WARN: ${warn.message}${warn.location ? ` (${warn.location})` : ''}`);
    }
  }

  console.log('');
  console.log('## MARKDOWN LINTING');
  console.log('-'.repeat(40));

  const mdFiles = [
    ...findFiles(knowledgeDir, '.md'),
    ...findFiles(baseDir, '.md')
  ];

  for (const file of mdFiles) {
    const result = lintMarkdown(file);
    allResults.push(result);
    
    const icon = result.isValid ? 'PASS' : 'FAIL';
    console.log(`${icon} ${path.basename(file)}`);
    
    for (const err of result.errors) {
      console.log(`   ERROR: ${err.message}${err.location ? ` (${err.location})` : ''}`);
    }
    for (const warn of result.warnings.slice(0, 3)) {
      console.log(`   WARN: ${warn.message}${warn.location ? ` (${warn.location})` : ''}`);
    }
    if (result.warnings.length > 3) {
      console.log(`   ... and ${result.warnings.length - 3} more warnings`);
    }
  }

  // Summary
  console.log('');
  console.log('=' .repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('=' .repeat(60));
  
  const totalErrors = allResults.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = allResults.reduce((sum, r) => sum + r.warnings.length, 0);
  const totalFiles = allResults.length;
  const validFiles = allResults.filter(r => r.isValid).length;

  console.log(`Files checked: ${totalFiles}`);
  console.log(`Files valid: ${validFiles}/${totalFiles}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  console.log('');

  if (totalErrors === 0) {
    console.log('All validations passed!');
    process.exit(0);
  } else {
    console.log('Validation failed with errors');
    process.exit(1);
  }
}

main();
