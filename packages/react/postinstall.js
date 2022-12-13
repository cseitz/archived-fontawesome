const { readFileSync, writeFileSync, readdirSync, existsSync } = require("fs");


const __define = __dirname + '/_define.js';
if (existsSync(__define)) {
    writeFileSync(__define, readFileSync(__define, 'utf8')
        .replace(/"\$INSTALLED_ICON_LIBRARIES\$"/, (
            "'" + JSON.stringify(readdirSync(__dirname + '/..').filter(o => o.includes('fontawesome-svg'))) + "'"
        ))
    )
}