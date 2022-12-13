import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import { parse, stringify } from 'yaml';
import camelCase from 'lodash/camelCase';
import { IconDefinition } from './_define';
import { EOL } from 'os';


// const STYLE = process.env.FONTAWESOME_STYLE;

console.log(execSync(`npm install --no-save @fortawesome/fontawesome-pro`).toString('utf8'));

const LIMIT_ICONS = undefined; //20; //undefined;

const allIcons = parse(
    readFileSync((
        require.resolve('@fortawesome/fontawesome-pro/metadata/icons.yml')
    ), 'utf8')
);

const iconDefinitions = Object.entries(allIcons)
    .map(([name, data]) => {
        return {
            ...data as any,
            name,
        } as IconDefinition;
    })


// const packs = {
//     "duotone": "@fortawesome/pro-duotone-svg-icons",
//     "regular": "@fortawesome/pro-regular-svg-icons",
//     "solid": "@fortawesome/pro-solid-svg-icons",
//     "light": "@fortawesome/pro-light-svg-icons",
//     "thin": "@fortawesome/pro-thin-svg-icons",
//     "brands": "@fortawesome/pro-brands-svg-icons",
//     "sharp-solid": "@fortawesome/sharp-solid-svg-icons"
// } as const;

// console.log(allIcons);

const indexDefines: string[] = [];
// const indexReferences: string[] = [];
function registerIcon(def: IconDefinition) {
    const faName = camelCase('fa ' + def.name);
    Object.assign(def, {
        faName,
    })
    const Name = def.faName.slice(2);
    const IconName = 'Icon' + Name;
    const NameIcon = isNaN(Number(Name.slice(0, 1))) ? `${Name}Icon` : `Number${Name}Icon`;
    // indexDefines.push(`export { ${NameIcon} } from './${camelCase(def.name)}';`);
    // indexReferences.push(`/// <reference path="./${camelCase(def.name)}.d.ts" />`)
    const imports = def.styles.map(o => [o, [
        // `__tryImportDefault("@cseitz/fontawesome-svg-${o}/${def.faName}")`,
        `// @ts-ignore`,
        // `const ${o}_fa = __tryRequire('${o}', require('@cseitz/fontawesome-svg-${o}/${def.faName}'));`,
        // `var ${o} = null; try { if (_installed('fontawesome-svg-${o}')) { ${o} = require('@cseitz/fontawesome-svg-${o}/${def.faName}'); }; } catch(err) {};`,
        `var ${o} = require('@cseitz/fontawesome-svg-${o}/${def.faName}');`
        // `import ${o} from '@cseitz/fontawesome-svg-${o}/${def.faName}';`,
        // `const ${o} = import('@cseitz/fontawesome-svg-${o}/${def.faName}').catch(err => null);`
        // `try {`,
        // `} catch(err) {}`
    ].join(EOL)]);
    // const imports = def.styles.map(o => [o, `// @ts-ignore${EOL}import ${o} from '@cseitz/fontawesome-svg-${o}/${def.faName}';`]);
    // const imports = def.styles.map(o => [o, `// @ts-ignore${EOL}import ${o} from './${o}/${def.faName}';`]);
    // const imports = [STYLE].map(o => [o, `// @ts-ignore${EOL}import ${o} from './${o}/${def.faName}';`]);
    const iconName = `icon${Name}`;
    const fileData = `import { _defineIcon, _installed } from './_define';
${imports.map(o => o[1]).join(EOL)}
/** FontAwesome Icon: [${def.name}](https://fontawesome.com/icons/${def.name}) - ${def.label}
 * @styles  ${def.styles.map(o => `\`${o}\``).join(', ')}
 * @changes ${def.changes.map(o => `\`${o}\``).join(', ')}
*/
export const ${NameIcon} = _defineIcon(${JSON.stringify(def)}, { ${imports.map(o => o[0]).join(', ')} });
export default ${NameIcon};`;
    return [
        camelCase(def.name) + '.ts',
        fileData,
    ]
}

const defines = iconDefinitions.map(registerIcon);

// console.log(defines.slice(0, 20));

// console.log(indexDefines.slice(0, 10))

// console.log(defines.find(o => o[0].includes('github'))[1]);

// sed -i 's/__importDefault(require/__importDefault(tryRequire/' ./dist/0.js

mkdirSync(__dirname + '/../build', { recursive: true });
mkdirSync(__dirname + '/../dist', { recursive: true });
// execSync(`cp -R ${__dirname}/../fa ${__dirname}/../build`);

const dirs = readdirSync(__dirname + '/../dist');
dirs.map(o => {
    if (o.includes('.')) {
        unlinkSync(__dirname + '/../dist/' + o);
    }
});

defines.slice(0, LIMIT_ICONS).forEach(o => writeFileSync(__dirname + '/../build/' + o[0], o[1]));

writeFileSync(__dirname + '/../build/index.tsx', readFileSync(__dirname + '/index.tsx', 'utf8') + indexDefines.slice(0, LIMIT_ICONS).join(EOL));
writeFileSync(__dirname + '/../build/_define.tsx', readFileSync(__dirname + '/_define.tsx'));

writeFileSync(__dirname + '/../build/_define.tsx', readFileSync(__dirname + '/_define.tsx'));

// const dirs = readdirSync(__dirname + '/../fa');
// dirs.map(o => execSync(`cp -R ${__dirname}/../fa/${o} ${__dirname}/../build/${o}`));
