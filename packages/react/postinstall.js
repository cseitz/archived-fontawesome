const { readFileSync, writeFileSync, readdirSync } = require("fs");


const __define = __dirname + '/dist/_define.js';
writeFileSync(__define, readFileSync(__define, 'utf8')
    .replace(/\$INSTALLED_ICON_LIBRARIES\$/, (
        JSON.stringify(readdirSync(__dirname + '/..').filter(o => o.includes('fontawesome-svg')))
    ))
);