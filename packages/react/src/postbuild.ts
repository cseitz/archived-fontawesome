import { copyFileSync, existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';


readdirSync(__dirname + '/../dist').filter(o => o.endsWith('.d.ts'))
    .filter(o => !(o.startsWith('_index'))).forEach(o => {
        unlinkSync(__dirname + '/../dist/' + o);
    })

copyFileSync(__dirname + '/../dist/_index.d.ts', __dirname + '/../dist/index.d.ts');
unlinkSync(__dirname + '/../dist/_index.d.ts');

const __define = __dirname + '/../dist/_define.js';
if (existsSync(__define)) {
    writeFileSync(__define, readFileSync(__define, 'utf8')
        .replace(/"\$INSTALLED_ICON_LIBRARIES\$"/, (
            "'" + JSON.stringify([]) + "'"
        ))
    )
}