const fs = require('fs');
const path = require('path');

const basePath = 'd:/Project/Code/Web/san_pham_cslt_web14/san-pham-cslt-web-01/tim-phong-tro';
const dataPath = path.join(basePath, 'core/utils/data.js');
let datajs = fs.readFileSync(dataPath, 'utf8');

// Insert the helper function at the top of data.js if not already there
if (!datajs.includes('function getBasePathFromScript()')) {
    const helper = `function getBasePathFromScript() {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        let src = script.getAttribute('src');
        if (src && src.includes('core/utils/data.js')) {
            return src.replace('core/utils/data.js', '');
        }
    }
    return '';
}
const windowBasePath = getBasePathFromScript();
`;
    datajs = helper + '\n' + datajs;
}

for (let i = 1; i <= 15; i++) {
    const pFolder = path.join(basePath, 'assets/images/images-phong', 'phong'+i);
    if(fs.existsSync(pFolder)) {
        const files = fs.readdirSync(pFolder).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
        if (files.length > 0) {
            const imgPath = 'assets/images/images-phong/phong'+i+'/'+files[0];
            const regex = new RegExp(`(id:\\s*${i},\\s*[\\s\\S]*?image:\\s*")[^"]+(")`, 'm');
            datajs = datajs.replace(regex, `$1" + windowBasePath + "${imgPath}$2`);
        }
    }
}
fs.writeFileSync(dataPath, datajs, 'utf8');
console.log('Update Complete');
