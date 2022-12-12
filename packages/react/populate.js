const { writeFileSync, readdirSync, readFileSync } = require('fs');
const { EOL } = require('os');

const __pkg = __dirname + '/package.json';
const pkg = require(__dirname + '/package.json');

const __dist = process.env.NODE_AUTH_TOKEN ? __dirname : __dirname + '/dist';

console.log({ __dist })

const files = readdirSync(__dist).filter(o => !o.startsWith('index') && (
    o.endsWith('.js') || o.endsWith('.d.ts')
));

if (!__dist.endsWith('dist')) {
    writeFileSync(__pkg, JSON.stringify({
        ...pkg,
        files,
    }, null, 2));
}



writeFileSync(__dist + '/index.d.ts', (
    readFileSync(__dist + '/index.d.ts', 'utf8') + (
        files.filter(o => o.endsWith('.d.ts'))
            .map(o => `/// <reference path="./${o}" />`)
            .join(EOL)
    )
))
