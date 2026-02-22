const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist', 'com.neko.nekoLyrics.sdPlugin');

console.log('🚀 Starting packaging process...');

if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, {recursive: true, force: true});
}

const dirsToCreate = [
    path.join(distDir, 'plugin'),
];
dirsToCreate.forEach(dir => fs.mkdirSync(dir, {recursive: true}));

const copy = (src, dest) => {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(distDir, dest);
    if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, {recursive: true});
    } else {
        if (!src.includes('license.txt')) {
            console.warn(`⚠️ Warning: Source not found - ${src}`);
        }
    }
};

copy('plugin/dist/index.js', 'plugin/index.js');
// copy('plugin/dist/license.txt', 'plugin/license.txt');

// 4. Copy static directories that aren't bundled (like your executables & UI)
copy('plugin/bin', 'plugin/bin');
copy('plugin/build', 'plugin/build');
copy('propertyInspector', 'propertyInspector');
copy('res', 'res');

// 5. Find all root .json files (like manifest.json) and copy to the ROOT of distDir
const filesInRoot = fs.readdirSync(__dirname);
filesInRoot.forEach(file => {
    if (
        file.endsWith('.json') &&
        file !== 'package.json' &&
        file !== 'package-lock.json'
    ) {
        copy(file, file);
    }
});

const nccDir = path.join(__dirname, 'plugin/dist');

if (fs.existsSync(nccDir)) {
    fs.rmSync(nccDir, {recursive: true, force: true});
}

console.log(`✅ Build complete! Plugin generated at: ${distDir}`);