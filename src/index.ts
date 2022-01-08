import { createFilter, FilterPattern } from '@rollup/pluginutils';
import { ESLint } from 'eslint';
import fs from 'fs';
import rollup from 'rollup';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    failOnError?: boolean;
}

const defaultOptions: Options = {
    include: /\.(js(x?)|ts(x?))$/,
    exclude: /node_modules/,
};

function lint(options: Options = {}): rollup.Plugin {
    const opts = { ...defaultOptions, ...options };
    const filter = createFilter(opts.include, opts.exclude);
    const cli = new ESLint({});
    let formatter: ESLint.Formatter | undefined;

    return {
        name: 'rollup-plugin-lintes',

        async load(id) {
            if (!filter(id) || !fs.existsSync(id)) return null;
            const lintIgnore = await cli.isPathIgnored(id);
            if (lintIgnore) return null;
            try {
                const result = await cli.lintFiles(id);
                let isHasError = false;
                for (let i = 0; i < result.length; i += 1) {
                    if (result[i].errorCount > 0) {
                        isHasError = true;
                        break;
                    }
                }
                if (!formatter) {
                    formatter = await cli.loadFormatter('stylish');
                }
                const errorText = formatter.format(result);
                if (errorText) {
                    console.log(errorText);
                }
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

