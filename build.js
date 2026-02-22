const fs = require('fs');
const path = require('path');

// Target output directory
const distDir = path.join(__dirname, 'dist', 'com.neko.nekoLyrics.sdPlugin');

console.log('🚀 Starting build...');

// 1. Clean old directory
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}

// 2. Create directory structure
const dirsToCreate = [
    path.join(distDir, 'plugin'),
    // We don't need to explicitly create 'res' here if we are copying a whole folder into it,
    // but it's safe to ensure the base exists.
];
dirsToCreate.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Simple copy wrapper
const copy = (src, dest) => {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(distDir, dest);
    if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
        console.warn(`⚠️ Warning: Source not found - ${src}`);
    }
};

// 3. Copy specific single files
copy('plugin/main.js', 'plugin/main.js');
copy('plugin/SongStorage.js', 'plugin/SongStorage.js');
copy('plugin/index.js', 'plugin/index.js');

// 4. Copy specific directories
copy('plugin/bin', 'plugin/bin');
copy('plugin/utils', 'plugin/utils');
copy('propertyInspector', 'propertyInspector');
copy('res', 'res'); // <--- Copies your root 'res' folder to 'distDir/res'

// 5. Find all root .json files (except package stuff) and copy to the ROOT of distDir
const filesInRoot = fs.readdirSync(__dirname);
filesInRoot.forEach(file => {
    if (
        file.endsWith('.json') &&
        file !== 'package.json' &&
        file !== 'package-lock.json'
    ) {
        // Note: destination is just the filename, placing it in the root of distDir
        copy(file, file);
    }
});

console.log(`✅ Build complete! Plugin generated at: ${distDir}`);