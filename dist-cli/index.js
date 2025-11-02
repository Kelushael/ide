#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
const program = new Command();
program
    .name('ide3')
    .description('Terminal AI coding agent with dynamic GUI spawning')
    .version('1.0.0');
program
    .command('exec <code>')
    .description('Execute code with AI assistance')
    .option('-l, --language <lang>', 'Programming language', 'javascript')
    .action(async (code, options) => {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    const language = options.language || 'javascript';
    console.log(chalk.cyan.bold('\n⚡ Code Executor\n'));
    console.log(chalk.gray(`Language: ${language}`));
    console.log(chalk.gray(`Code: ${code}\n`));
    try {
        let command;
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'js':
                command = `node -e "${code.replace(/"/g, '\\"')}"`;
                break;
            case 'python':
            case 'py':
                command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
                break;
            case 'bash':
            case 'sh':
                command = code;
                break;
            default:
                throw new Error(`Unsupported language: ${language}`);
        }
        const { stdout, stderr } = await execAsync(command);
        console.log(chalk.green('✔ Execution complete\n'));
        if (stdout) {
            console.log(chalk.white('📤 Output:'));
            console.log(stdout);
        }
        if (stderr) {
            console.log(chalk.yellow('\n⚠️  Warnings:'));
            console.log(stderr);
        }
    }
    catch (error) {
        console.log(chalk.red('✖ Execution failed\n'));
        console.error(chalk.red('❌ Error:'), error.stderr || error.message);
        process.exit(1);
    }
});
program
    .command('gui')
    .description('Launch GUI dashboard in browser')
    .option('-p, --port <port>', 'Port for GUI server', '3000')
    .action(async (options) => {
    console.log(chalk.cyan.bold('\n🖥️  IDE3 GUI\n'));
    console.log(chalk.yellow('GUI feature coming soon!'));
    console.log(chalk.gray('This will launch a beautiful web dashboard.\n'));
});
program
    .command('chat')
    .description('Start interactive AI chat session')
    .action(async () => {
    const { ChatSession } = await import('./chat-session.js');
    const session = new ChatSession();
    await session.start();
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    console.log(chalk.cyan.bold('\n🚀 IDE3 - AI Coding Agent\n'));
    program.outputHelp();
    console.log(chalk.gray('\nExamples:'));
    console.log(chalk.gray('  $ ide3 exec "console.log(\'Hello World\')"'));
    console.log(chalk.gray('  $ ide3 exec "print(\'Hello\')" --language python'));
    console.log(chalk.gray('  $ ide3 gui'));
    console.log(chalk.gray('  $ ide3 chat\n'));
}
