import { copyFileSync, readdirSync, unlinkSync } from 'fs';



readdirSync(__dirname + '/../files/icons').filter(o => o.endsWith('.d.ts')).forEach(o => {
    unlinkSync(__dirname + '/../files/icons/' + o);
})

unlinkSync(__dirname + '/../files/index.d.ts');
// unlinkSync(__dirname + '/../dist/_define.d.ts');
copyFileSync(__dirname + '/../build/__index.d.ts', __dirname + '/../dist/index.d.ts');
copyFileSync(__dirname + '/../files/_define.d.ts', __dirname + '/../dist/_define.d.ts');