// const fs = require('fs');
// const path = require('path');
// const SVGSpriter = require('svg-sprite');

// // 配置路径 - 使用相对路径避免系统路径问题
// const ICONS_DIR = path.resolve('public/icon');
// const OUTPUT_DIR = path.resolve('public');
// const TYPES_FILE = path.resolve('src/types/icon.ts');

// // 递归获取所有SVG文件
// function getAllSvgFiles(dir) {
//   const files = [];
//   const items = fs.readdirSync(dir);

//   for (const item of items) {
//     const fullPath = path.join(dir, item);
//     const stat = fs.statSync(fullPath);

//     if (stat.isDirectory()) {
//       const subFiles = getAllSvgFiles(fullPath);
//       files.push(...subFiles);
//     } else if (item.endsWith('.svg')) {
//       files.push(fullPath);
//     }
//   }

//   return files;
// }

// // 生成TypeScript类型定义
// function generateIconTypes(icons) {
//   const types = `// 这个文件是自动生成的，请不要手动修改
// // 运行 npm run generate-icons-sprite 来更新此文件

// export type IconName = ${icons.map(name => `'${name}'`).join(' | ')};
// `;

//   const outputDir = path.dirname(TYPES_FILE);
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   fs.writeFileSync(TYPES_FILE, types);
// }

// // 主函数
// async function generateSprite() {
//   console.log('🔍 Scanning for SVG files...');
//   console.log('📂 Icons directory:', ICONS_DIR);
//   console.log('📂 Output directory:', OUTPUT_DIR);
//   console.log('📂 Types file:', TYPES_FILE);

//   // 检查图标目录是否存在
//   if (!fs.existsSync(ICONS_DIR)) {
//     console.error('❌ Icons directory not found:', ICONS_DIR);
//     return;
//   }

//   const svgFiles = getAllSvgFiles(ICONS_DIR);

//   if (svgFiles.length === 0) {
//     console.log('❌ No SVG files found in', ICONS_DIR);
//     return;
//   }

//   console.log(`📁 Found ${svgFiles.length} SVG files`);

//   // 创建spriter实例 - 只生成symbol模式
//   const spriter = new SVGSpriter({
//     dest: OUTPUT_DIR,
//     mode: {
//       symbol: {
//         dest: '',
//         sprite: 'sprite.svg',
//         inline: false
//       }
//     },
//     shape: {
//       id: {
//         generator: (name) => {
//           // name 现在已经是相对于 ICONS_DIR 的路径
//           return name.replace(/\.svg$/, '').replace(/[\/\\]/g, '-');
//         }
//       }
//     }
//   });

//   // 添加SVG源文件
//   for (const file of svgFiles) {
//     try {
//       const content = fs.readFileSync(file, 'utf-8');
//       // 使用相对路径作为名称，确保ID生成器能正确处理
//       const relativePath = path.relative(ICONS_DIR, file);
//       spriter.add(file, relativePath, content);
//       console.log(`✓ Added: ${relativePath}`);
//     } catch (error) {
//       console.error(`✗ Error processing ${file}:`, error.message);
//     }
//   }

//   // 编译sprite
//   try {
//     const { result } = await spriter.compileAsync();

//     // 写入文件
//     for (const mode in result) {
//       for (const resource in result[mode]) {
//         const { path: filePath, contents } = result[mode][resource];
//         const fullPath = path.join(OUTPUT_DIR, filePath);

//         fs.mkdirSync(path.dirname(fullPath), { recursive: true });
//         fs.writeFileSync(fullPath, contents);
//         console.log(`✅ Generated: ${filePath}`);
//       }
//     }

//     // 生成TypeScript类型定义
//     const icons = Object.keys(spriter.getShapes());
//     generateIconTypes(icons);
//     console.log('✅ Generated TypeScript types');

//     console.log('\n📊 Summary:');
//     console.log(`   - Total icons: ${icons.length}`);
//     console.log(`   - Sprite file: ${path.join(OUTPUT_DIR, 'sprite.svg')}`);
//     console.log(`   - Types file: ${TYPES_FILE}`);

//   } catch (error) {
//     console.error('❌ Compilation error:', error);
//   }
// }

// // 运行生成器
// generateSprite().catch(console.error);
