import { createFilter, FilterPattern } from '@rollup/pluginutils';
import { ESLint } from 'eslint';
import fs from 'fs';
import rollup from 'rollup';
import { printLintResult } from './log';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    failOnError?: boolean;
}

const defaultOptions: Options = {
    exclude: 'node_modules',
};

function lint(options: Options = {}): rollup.Plugin {
    const opts = { ...defaultOptions, ...options };
    const filter = createFilter(opts.include, opts.exclude);
    const cli = new ESLint({});


    return {
        name: 'rollup-plugin-lintes',

        async load(id) {
            const lintIgnore = await cli.isPathIgnored(id);
            if (lintIgnore || !filter(id) || !fs.existsSync(id)) return null;
            try {
                const result = await cli.lintFiles(id);
                const isHasError = printLintResult(result, id);
                if (isHasError && opts.failOnError) {
                    throw new Error('rollup-plugin-lintes: load error');
                }
            } catch (error) {
                if (opts.failOnError) {
                    throw error;
                }
            }
            return null;
        },
    };
}

export { lint };
export default lint;

