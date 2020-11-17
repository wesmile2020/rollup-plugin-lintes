# rollup-plugin-lintes

a rollup plugin for eslint

## options
- include: FilterPattern; default is null.
- exclude: FilterPattern; default is 'node_modules'

## usage
```javascript
const { lint } = require('rollup-plugin-lintes');

module.exports = {
    plugins: [lint()]
};
```