const utils = require('@rollup/pluginutils');
const chalk = require('chalk');
const { ESLint } = require('eslint');
const fs = require('fs');

function red(...rest) {
    return chalk.red(...rest);
}

/**
 * 打印 eslint 错误信息
 * @param {[]} messages
 * @param {string} id
 */
function printLintMsg(messages, id) {
    for (let i = 0; i < messages.length; i += 1) {
        const arr = [
            `${id} ${messages[i].ruleId}`,
            `line: ${messages[i].line} ${messages[i].message}`,
            '\n'
        ];
        console.log(red(arr.join('\n')));
    }
}

const defaultOptions = {
    include: null,
    exclude: 'node_modules'
};

function lint(options = {}) {
    const opts = { ...defaultOptions, ...options };
    const filter = utils.createFilter(opts.include, opts.exclude);

    const cli = new ESLint();

    return {
        name: 'rollup-plugin-lintes',

        async load(id) {
            const lintIgnore = await cli.isPathIgnored(id);

            if (lintIgnore || !filter(id) || !fs.existsSync(id)) {
                return null;
            }
            try {
                const result = await cli.lintFiles(id);
                let isHasErr = false;
                for (let i = 0; i < result.length; i += 1) {
                    if ((result[i].errorCount + result[i].warningCount) > 0) {
                        isHasErr = true;
                        printLintMsg(result[i].messages, id);
                        break;
                    }
                }
                if (isHasErr) {
                    throw new Error('eslint error');
                }
            } catch (error) {
                throw error;
            }
            return null;
        },
    };
}

module.exports = lint;
