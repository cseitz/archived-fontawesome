const { writeFileSync, readdirSync } = require('fs');

const __pkg = __dirname + '/package.json';
const pkg = require(__dirname + '/package.json');


writeFileSync(__pkg, JSON.stringify({
    ...pkg,
    files: readdirSync(__dirname).filter(o => !o.startsWith('index') && (
        o.endsWith('.js') || o.endsWith('.d.ts')
    ))
}, null, 2))
