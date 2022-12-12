const { writeFileSync } = require('fs');

const __pkg = __dirname + '/package/package.json';
const fa = require(__pkg);
const { name } = require(__dirname + '/package.json');

if (!fa.name.startsWith('@cseitz')) {

    const names = [
        fa.name.includes('svg') ? 'svg' : null,
        ...fa.name.split('/').pop().split('-').filter(o => o != 'pro' && o != 'svg' && o != 'icons' && o != 'free'),
    ].filter(o => o);

    const newName = name + names.join('-');

    console.log(newName, { name, names });

    writeFileSync(__pkg, JSON.stringify({
        ...fa,
        version: '1.0.1',
        name: newName,
    }, null, 2))

}