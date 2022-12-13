const { readFileSync, writeFileSync, readdirSync, existsSync } = require("fs");
const { readdir, readFile, writeFile } = require("fs/promises");

const ELIMINATE_DOUBLE_COMMENT = /\/\/ \/\/ var/g

function disable(style) {
    const reg = new RegExp(`var ${style} = require\\('@cseitz/fontawesome-svg-${style}`, 'g')
    return (data) => {
        return data.replace(reg, `// var ${style} = require('@cseitz/fontawesome-svg-${style}`)
    }
}

function enable(style) {
    const reg = new RegExp(`\/{2} var ${style} = require\\('@cseitz/fontawesome-svg-${style}`, 'g')
    return (data) => {
        return data.replaceAll(reg, `var ${style} = require('@cseitz/fontawesome-svg-${style}`)
    }
}

const styles = ['solid', 'regular', 'light', 'thin', 'duotone', 'sharp-solid', 'brands'];

const __root = __dirname + '/dist';
const __define = __root + '/_define.js';
if (existsSync(__define)) {
    const installed = readdirSync(__dirname + '/..').filter(o => o.includes('fontawesome-svg'));
    writeFileSync(__define, readFileSync(__define, 'utf8')
        .replace(/"\$INSTALLED_ICON_LIBRARIES\$"/, (
            "'" + JSON.stringify(installed) + "'"
        ))
    );
    const actions = styles.map(o => {
        if (installed.find(v => v.includes(o))) {
            return enable(o);
        }
        return disable(o);
    })
    ;(async () => {
        const files = (await readdir(__root)).filter(o => o.endsWith('.js') && !o.startsWith('_'));
        console.time(`updated ${files.length - 1} icons`);
        for (const key of files) {
            let data = await readFile(__root + '/' + key, 'utf8');
            for (const action of actions) {
                data = action(data);
            }
            data = data.replaceAll(ELIMINATE_DOUBLE_COMMENT, '//');
            await writeFile(__root + '/' + key, data);
        }
        console.timeEnd(`updated ${files.length - 1} icons`);
    })();
}
