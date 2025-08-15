# 图标生成脚本

这个目录包含了用于生成 SVG sprite 的脚本。

## 脚本说明

### 1. `generate-icons.js` - 原生实现

- **特点**: 使用原生 Node.js 和 cheerio 实现
- **优点**: 依赖少，速度快，适合简单需求
- **输出**: 生成 `public/sprite.svg` 和 `public/types/icon.ts`

### 2. `generate-icons-svg-sprite.js` - 完整功能版本

- **特点**: 使用 svg-sprite 库实现
- **优点**: 功能完整，支持多种输出模式，自动优化
- **输出**: 生成 `public/sprite.svg`、`public/css/sprite.css` 和 `public/types/icon.ts`

### 3. `generate-icons-simple.js` - 简化版本

- **特点**: 使用 svg-sprite 库，只生成 symbol 模式
- **优点**: 轻量级，专注于 symbol sprite 生成
- **输出**: 生成 `public/sprite.svg` 和 `public/types/icon.ts`

## 使用方法

### 安装依赖

```bash
# 如果使用原生脚本，只需要 cheerio
npm install cheerio --save-dev

# 如果使用 svg-sprite 脚本，需要安装 svg-sprite
npm install svg-sprite --save-dev
```

### 运行脚本

```bash
# 使用原生脚本
npm run generate-icons

# 使用完整功能版本
npm run generate-icons-sprite

# 使用简化版本
npm run generate-icons-simple
```

## 文件夹结构支持

所有脚本都支持递归处理嵌套文件夹：

```
public/icon/
├── 1.svg                    # 根目录文件
├── 2.svg
├── creator/
│   ├── activity.svg         # 子文件夹文件
│   └── arrow-down.svg
├── help/
│   ├── book.svg
│   └── box.svg
└── side-menu/
    ├── tab_home_normal.svg
    └── tab_anime_selected.svg
```

生成的图标名称会自动转换为短横线分隔的格式：

- `creator/activity.svg` → `creator-activity`
- `help/book.svg` → `help-book`
- `side-menu/tab_home_normal.svg` → `side-menu-tab_home_normal`

## 输出文件

### 原生脚本

- `public/sprite.svg` - SVG sprite 文件
- `public/types/icon.ts` - TypeScript 类型定义

### svg-sprite 脚本

- `public/sprite.svg` - SVG sprite 文件
- `public/css/sprite.css` - CSS 样式文件（仅完整版本）
- `public/types/icon.ts` - TypeScript 类型定义

## 推荐使用场景

- **简单项目**: 使用 `generate-icons.js`
- **大型项目**: 使用 `generate-icons-svg-sprite.js`
- **只需要 symbol sprite**: 使用 `generate-icons-simple.js`
