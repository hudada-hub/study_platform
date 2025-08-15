// const fs = require('fs');
// const path = require('path');
// const SVGSpriter = require('svg-sprite');

// // 配置路径 - 使用相对路径避免系统路径问题
// const ICONS_DIR = path.resolve(process.cwd(), 'public/icon');
// const OUTPUT_DIR = path.resolve(process.cwd(), 'public');
// const TYPES_FILE = path.resolve(process.cwd(), 'src/types/icon.ts');

// console.log(OUTPUT_DIR,'OUTPUT_DIR23232')
// // 递归获取所有SVG文件
// function getAllSvgFiles(dir) {
//   const files = [];
//   const items = fs.readdirSync(dir);

//   for (const item of items) {
//     const fullPath = path.join(dir, item);
//     const stat = fs.statSync(fullPath);

//     if (stat.isDirectory()) {
//       // 递归处理子文件夹
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
//   console.log('📂 Icons directory:', ICONS_DIR);
//   console.log('📂 Output directory:', OUTPUT_DIR);
//   console.log('📂 Types file:', TYPES_FILE);

//   // 检查图标目录是否存在
//   if (!fs.existsSync(ICONS_DIR)) {
//     console.error('❌ Icons directory not found:', ICONS_DIR);
//     return;
//   }

//   // 获取所有SVG文件
//   const svgFiles = getAllSvgFiles(ICONS_DIR);

//   if (svgFiles.length === 0) {
//     console.log('❌ No SVG files found in', ICONS_DIR);
//     return;
//   }

//   console.log(`📁 Found ${svgFiles.length} SVG files`);

//   // 创建spriter实例
//   const spriter = new SVGSpriter({

//     mode: {

//       symbol: {
//         dest: '',
//         sprite: 'sprite.svg',
//         inline: false,
//         view:true,
//         // 禁用哈希值，使用固定文件名
//         bust: false
//       }
//     },
//     shape: {
//       id: {
//         generator: (name) => {
//           return name.replace(/\.svg$/, '').replace(/[\/\\]/g, '-');
//         }
//       },
//       // 保持所有图标的原有样式，不进行任何处理
//       transform: []
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

//   // 编译sprite (异步方式)
//   try {
//     const { result } = await spriter.compileAsync();

//     // 写入文件到磁盘
//     for (const mode in result) {
//       for (const resource in result[mode]) {
//         const { path: filePath, contents } = result[mode][resource];
//         // 确保文件直接写入到 public 目录
//         const fullPath = path.join(OUTPUT_DIR, path.basename(filePath));

//         // 确保输出目录存在
//         fs.mkdirSync(path.dirname(fullPath), { recursive: true });
//         fs.writeFileSync(fullPath, contents);
//         console.log(`✅ Generated: ${fullPath}`);
//       }
//     }

//     // 生成TypeScript类型定义
//     let icons = [];
//     try {
//       const shapes = spriter.getShapes();
//       icons = Object.keys(shapes).map(key => {
//         // 确保我们获取到正确的图标名称
//         const shape = shapes[key];
//         return shape.id || key;
//       }).filter(Boolean);

//       generateIconTypes(icons);
//       console.log('✅ Generated TypeScript types');
//     } catch (error) {
//       console.error('❌ Error generating TypeScript types:', error.message);
//       // 如果获取shapes失败，使用文件名作为图标名称
//       icons = svgFiles.map(file => {
//         const relativePath = path.relative(ICONS_DIR, file);
//         return relativePath.replace(/\.svg$/, '').replace(/[\/\\]/g, '-');
//       });
//       generateIconTypes(icons);
//       console.log('✅ Generated TypeScript types (fallback)');
//     }

//     console.log('\n📊 Summary:');
//     console.log(`   - Total icons: ${icons.length}`);
//     console.log(`   - Sprite file: ${path.join(OUTPUT_DIR, 'sprite.svg')}`);
//     console.log(`   - Types file: ${TYPES_FILE}`);
//     console.log('   - 配置说明: 保持原有线条样式，支持通过 CSS 类改变填充颜色');

//   } catch (error) {
//     console.error('❌ Compilation error:', error);
//   }
// }

// // 运行生成器
// generateSprite().catch(console.error);
