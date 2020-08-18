import { Plugin } from 'rollup';
import { FilterPattern } from '@rollup/pluginutils';

interface Options {
    include: FilterPattern;
    exclude: FilterPattern;
}

function lint(opts: Options): Plugin;

export default lint;
