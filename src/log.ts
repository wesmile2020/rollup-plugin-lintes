import chalk from 'chalk';
import { ESLint, Linter } from 'eslint';

export function logError(...rest: any) {
    console.log(chalk.bold.red(...rest));
}

export function printLintMessages(messages: Linter.LintMessage[], id: string) {
    for (let i = 0; i < messages.length; i += 1) {
        const  msgArr = [
            `${id} (${messages[i].line},${messages[i].column}): error`,
            `${messages[i].ruleId}: ${messages[i].message}`,
        ];
        logError(msgArr.join('\n'));
    }
}

export function printLintResult(result: ESLint.LintResult[] ,id: string) {
    let isHasErr = false;
    for (let i = 0; i < result.length; i += 1) {
        if (result[i].errorCount > 0) {
            isHasErr = true;
        }
        if (result[i].errorCount + result[i].warningCount > 0) {
            printLintMessages(result[i].messages, id);
        }
    }
    return isHasErr;
}