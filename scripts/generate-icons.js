// const fs = require('fs');
// const path = require('path');
// const cheerio = require('cheerio');

// // 配置路径
// const ICONS_DIR = path.join(process.cwd(), 'public/icon');
// const OUTPUT_FILE = path.join(process.cwd(), 'public/sprite.svg');
// const TYPES_FILE = path.join(process.cwd(), 'public/types/icon.ts');

// // 递归获取所有SVG文件
// function getAllSvgFiles(dir, baseDir = dir) {
//   const files = [];
//   const items = fs.readdirSync(dir);

//   for (const item of items) {
//     const fullPath = path.join(dir, item);
//     const stat = fs.statSync(fullPath);

//     if (stat.isDirectory()) {
//       // 递归处理子文件夹
//       const subFiles = getAllSvgFiles(fullPath, baseDir);
//       files.push(...subFiles);
//     } else if (item.endsWith('.svg')) {
//       // 计算相对于基础目录的路径作为图标名称
//       const relativePath = path.relative(baseDir, fullPath);
//       const iconName = relativePath.replace(/\.svg$/, '').replace(/[\/\\]/g, '-');
//       files.push({
//         path: fullPath,
//         name: iconName
//       });
//     }
//   }

//   return files;
// }

// // 处理单个SVG文件
// function processSvgFile(filePath) {
//   const content = fs.readFileSync(filePath, 'utf-8');
//   const $ = cheerio.load(content, { xmlMode: true });
//   const svg = $('svg');

//   // 获取viewBox
//   let viewBox = svg.attr('viewBox') || '0 0 24 24';

//   // 获取路径数据
//   const paths = [];
//   svg.find('path, circle, rect, polygon, line, ellipse, polyline').each((_, el) => {
//     paths.push($.html(el));
//   });

//   return {
//     viewBox,
//     content: paths.join('\n    ')
//   };
// }

// // 生成图标类型定义
// function generateIconTypes(icons) {
//   const types = `// 这个文件是自动生成的，请不要手动修改
// export type IconName = ${icons.map(name => `'${name}'`).join(' | ')};
// `;

//   // 确保输出目录存在
//   const outputDir = path.dirname(TYPES_FILE);
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   fs.writeFileSync(TYPES_FILE, types);
// }

// // 主函数
// async function generateSprite() {
//   console.log('🔍 Scanning for SVG files...');

//   // 获取所有SVG文件
//   const svgFiles = getAllSvgFiles(ICONS_DIR);

//   if (svgFiles.length === 0) {
//     console.log('❌ No SVG files found in', ICONS_DIR);
//     return;
//   }

//   console.log(`📁 Found ${svgFiles.length} SVG files`);

//   const icons = [];
//   const spriteContent = [];

//   spriteContent.push(`<?xml version="1.0" encoding="UTF-8"?>
// <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">`);

//   for (const file of svgFiles) {
//     try {
//       const { viewBox, content } = processSvgFile(file.path);
//       icons.push(file.name);

//       spriteContent.push(`
//   <symbol id="${file.name}" viewBox="${viewBox}">
//     ${content}
//   </symbol>`);

//       console.log(`✓ Processed: ${file.name} (${file.path})`);
//     } catch (error) {
//       console.error(`✗ Error processing ${file.path}:`, error.message);
//     }
//   }

//   spriteContent.push('\n</svg>');

//   // 确保输出目录存在
//   const outputDir = path.dirname(OUTPUT_FILE);
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   // 写入sprite文件
//   fs.writeFileSync(OUTPUT_FILE, spriteContent.join(''));
//   console.log(`\n✅ Generated sprite file with ${icons.length} icons`);

//   // 生成类型定义
//   generateIconTypes(icons);
//   console.log('✅ Generated TypeScript types');

//   console.log('\n📊 Summary:');
//   console.log(`   - Total icons: ${icons.length}`);
//   console.log(`   - Sprite file: ${OUTPUT_FILE}`);
//   console.log(`   - Types file: ${TYPES_FILE}`);
// }

// // 运行生成器
// generateSprite().catch(console.error);
