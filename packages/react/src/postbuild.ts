import { copyFileSync, existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';


readdirSync(__dirname + '/../dist').filter(o => o.endsWith('.d.ts'))
    .filter(o => !(o.startsWith('_index'))).forEach(o => {
        unlinkSync(__dirname + '/../dist/' + o);
    })

copyFileSync(__dirname + '/../dist/_index.d.ts', __dirname + '/../dist/index.d.ts');
unlinkSync(__dirname + '/../dist/_index.d.ts');
