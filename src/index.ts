import { createFilter, FilterPattern } from '@rollup/pluginutils';
import { ESLint } from 'eslint';
import fs from 'fs';
import rollup from 'rollup';
import { printLintResult } from './log';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
}

const defaultOptions: Options = {
    exclude: 'node_modules',
};

function lint(options: Options = {}): rollup.Plugin {
    const opts = { ...defaultOptions, ...options };
    const filter = createFilter(opts.include, opts.exclude);
    const cli = new ESLint({});

    const exitSet: Set<string> = new Set();

    return {
        name: 'rollup-plugin-lintes',

        async load(id) {
            const lintIgnore = await cli.isPathIgnored(id);
            if (lintIgnore || !filter(id)) return null;
            if (fs.existsSync(id)) {
                exitSet.add(id);
            } else {
                exitSet.delete(id);
                return null;
            }
            try {
                const result = await cli.lintFiles(id);
                const isHasError = printLintResult(result, id);
                if (isHasError) {
                    throw new Error('rollup-plugin-lintes: load error');
                }
            } catch (error) {
                throw error;
            }
            return null;
        },

        // 针对 vue 中的 script 进行校验
        async transform (code: string, id: string) {
            const lintIgnore = await cli.isPathIgnored(id);
            if (lintIgnore || !filter(id) || exitSet.has(id)) return null;
            
            try {
                const filePath = id.split('?')[0];
                const result = await cli.lintText(code, { filePath });
                const isHasError = printLintResult(result, filePath);
                if (isHasError) {
                    throw new Error('rollup-plugin-lintes: transform error');
                }
            } catch (error) {
                throw error;
            }
            return null;
        },
    };
}

export { lint };
export default lint;

