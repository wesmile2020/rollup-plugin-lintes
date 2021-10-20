import chalk from 'chalk';
import { ESLint, Linter } from 'eslint';

export function logError(...rest: unknown[]) {
    console.log(chalk.bold.red(...rest));
}

export function logWarning (...rest: unknown[]) {
    console.log(chalk.bold.yellow(...rest))
}

export function printLintMessages(messages: Linter.LintMessage[], id: string, mode: 'warning' | 'error') {
    for (let i = 0; i < messages.length; i += 1) {
        const  msgArr = [
            `${id} (${messages[i].line},${messages[i].column}): ${mode}`,
            `${messages[i].ruleId}: ${messages[i].message}`,
        ];
        if (mode === 'warning') {
            logWarning(msgArr.join('\n'))
        } else {
            logError(msgArr.join('\n'))
        }
    }
}

export function printLintResult(result: ESLint.LintResult[] ,id: string) {
    let isHasErr = false;
    for (let i = 0; i < result.length; i += 1) {
        if (result[i].errorCount > 0) {
            isHasErr = true;
            printLintMessages(result[i].messages, id, 'error');
        }
        if (result[i].warningCount > 0) {
            printLintMessages(result[i].messages, id, 'warning')
        }
    }
    return isHasErr;
}