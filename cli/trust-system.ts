/**
 * Trust System for Directory Security
 * Prevents IDE3 from operating in untrusted directories
 */

import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as readline from 'readline';

const TRUST_FILE = path.join(os.homedir(), '.ide3-trusted-dirs.json');

/**
 * Load trusted directories
 */
async function loadTrustedDirs(): Promise<Set<string>> {
  try {
    const data = await fs.readFile(TRUST_FILE, 'utf-8');
    return new Set(JSON.parse(data));
  } catch {
    return new Set();
  }
}

/**
 * Save trusted directories
 */
async function saveTrustedDirs(dirs: Set<string>): Promise<void> {
  await fs.writeFile(TRUST_FILE, JSON.stringify([...dirs], null, 2));
}

/**
 * Check if current directory is trusted
 */
export async function checkDirectoryTrust(): Promise<boolean> {
  const cwd = process.cwd();
  const trusted = await loadTrustedDirs();

  if (trusted.has(cwd)) {
    return true;
  }

  // Show trust prompt
  console.log('─'.repeat(120));
  console.log(chalk.bold.yellow('\n⚠️  Do you trust the files in this folder?\n'));
  console.log(chalk.cyan(`   ${cwd}\n`));
  console.log(chalk.gray('   IDE3 may read, write, or execute files in this directory.'));
  console.log(chalk.gray('   Only proceed if you trust the source of these files.\n'));
  console.log(chalk.green('   ❯ 1. Yes, I trust this folder (proceed)'));
  console.log(chalk.gray('     2. No, exit for now\n'));
  console.log('─'.repeat(120));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.cyan('\nYour choice: '), async (answer) => {
      rl.close();

      if (answer === '1' || answer === '') {
        // Trust this directory
        trusted.add(cwd);
        await saveTrustedDirs(trusted);
        console.log(chalk.green('\n✓ Directory trusted\n'));
        resolve(true);
      } else {
        console.log(chalk.yellow('\n⊘ Exiting...\n'));
        resolve(false);
      }
    });
  });
}

/**
 * List trusted directories
 */
export async function listTrustedDirs(): Promise<string[]> {
  const trusted = await loadTrustedDirs();
  return [...trusted];
}

/**
 * Remove trust for current directory
 */
export async function untrustCurrentDir(): Promise<void> {
  const cwd = process.cwd();
  const trusted = await loadTrustedDirs();

  if (trusted.has(cwd)) {
    trusted.delete(cwd);
    await saveTrustedDirs(trusted);
    console.log(chalk.yellow(`\n⊘ Removed trust for: ${cwd}\n`));
  } else {
    console.log(chalk.gray('\n  This directory was not trusted.\n'));
  }
}

/**
 * Clear all trusted directories
 */
export async function clearAllTrust(): Promise<void> {
  await saveTrustedDirs(new Set());
  console.log(chalk.yellow('\n⊘ All trust cleared\n'));
}
