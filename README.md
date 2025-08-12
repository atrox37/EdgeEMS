# Framework

This template should help get you started developing with Vue 3 and TypeScript in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of the types inside `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over Mode [here](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669).

## Features

- ⚡️ [Vite](https://cn.vitejs.dev/) - 极速的前端构建工具
- 🖖 [Vue 3](https://cn.vuejs.org/) - 渐进式 JavaScript 框架
- 🎯 [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- 🎨 [Element Plus](https://element-plus.org/) - Vue 3 的组件库
- 📦 [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库
- 🛣️ [Vue Router](https://router.vuejs.org/) - Vue.js 官方路由管理器
- 🎨 [SCSS](https://sass-lang.com/) - CSS 预处理器
- 📊 [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- 🌍 [Vue I18n](https://vue-i18n.intlify.dev/) - Vue.js 国际化插件
- 🔧 [ESLint](https://eslint.org/) - 代码质量检查工具
- 💅 [Prettier](https://prettier.io/) - 代码格式化工具

## Project Structure

```
src/
├── assets/          # 静态资源文件
│   └── images/      # 图片资源
├── components/      # 公共组件
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── utils/           # 工具函数
│   ├── responsive.ts        # 响应式配置工具
│   └── responsive-example.ts # 响应式工具使用示例
├── views/           # 页面组件
│   └── LoginView.vue # 登录页面
├── App.vue          # 根组件
└── main.ts          # 应用入口
```

## Current Implementation

### 响应式配置系统

项目实现了完整的响应式配置系统，支持多屏幕尺寸适配：

#### 核心功能

- **自动响应式布局** - 基于1920x1080设计稿的rem适配方案
- **px转换工具** - 将设计稿px值转换为当前响应式下的px值
- **rem转换工具** - 将设计稿px值转换为rem值
- **实时缩放比例** - 获取当前屏幕相对于设计稿的缩放比例
- **根字体大小管理** - 动态调整根字体大小实现响应式

#### 工具函数

```typescript
// 将设计稿px转换为响应式px
pxToResponsive(designPx: number): number

// 将设计稿px转换为rem
pxToRem(designPx: number): string

// 获取当前缩放比例
getCurrentScale(): number

// 获取当前根字体大小
getCurrentFontSize(): number
```

#### 使用示例

```typescript
import { pxToResponsive, pxToRem } from '@/utils/responsive'

// 设计稿100px转换为当前响应式px
const responsivePx = pxToResponsive(100)

// 设计稿100px转换为rem
const remValue = pxToRem(100)

// 在Vue组件中使用
const style = {
  width: pxToResponsive(200) + 'px',
  fontSize: pxToRem(16),
}
```

### 登录页面 (LoginView.vue)

基于Figma设计稿实现的登录页面，包含以下特性：

- **完全响应式设计** - 1920x1080分辨率，完美还原设计稿
- **复杂背景布局** - 多层背景图片和装饰元素
- **毛玻璃效果** - 使用backdrop-filter实现现代UI效果
- **渐变装饰** - 橙色渐变流线和光点效果
- **品牌标识** - Monarch品牌logo和名称
- **表单组件** - 角色选择、用户名、密码输入框
- **交互按钮** - 登录按钮和菜单按钮

#### 设计特点

- **颜色方案**: 深蓝色背景 (#02081A) + 橙色主题色 (#FF6900)
- **字体**: Montserrat (标题) + Arimo (正文)
- **布局**: 绝对定位布局，精确还原Figma设计
- **样式**: SCSS + BEM命名规范，避免使用&选择器

#### 图片资源

所有背景图片和装饰图标已从Figma下载并存储在 `src/assets/images/` 目录下：

- `background-*.png` - 背景图片
- `flow-icon-1.png` - 流线装饰图标

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd framework
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Development

### Code Style

- 使用 Vue 3 Composition API
- 遵循 TypeScript 类型安全
- 使用 SCSS 进行样式管理
- 遵循 BEM 命名规范
- 使用 Element Plus 组件库

### Available Scripts

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 检查
- `npm run lint:fix` - 自动修复 ESLint 问题
- `npm run type-check` - 运行 TypeScript 类型检查

## License

[MIT](LICENSE)
