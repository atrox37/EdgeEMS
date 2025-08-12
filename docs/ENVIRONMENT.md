# 环境变量配置指南

本项目使用环境变量来管理不同环境下的配置，支持开发环境和生产环境的区分配置。

## 📁 环境文件说明

### 文件列表

- `.env` - 基础环境配置，所有环境共享
- `.env.development` - 开发环境专用配置
- `.env.production` - 生产环境专用配置
- `.env.local.example` - 本地环境配置示例

### 加载优先级

Vite会按以下优先级加载环境文件（后面的会覆盖前面的）：

1. `.env`
2. `.env.local` （被git忽略）
3. `.env.[mode]` （如 `.env.development`）
4. `.env.[mode].local` （被git忽略）

## 🔧 环境变量详解

### 应用基础配置

```bash
VITE_APP_NAME=Volotage-EMS              # 应用名称
VITE_APP_VERSION=1.0.0                  # 应用版本
VITE_APP_DESCRIPTION=Energy Management System  # 应用描述
VITE_APP_LOCALE=zh-CN                   # 默认语言
```

### API配置

```bash
VITE_API_BASE_URL=http://localhost:3000/api    # API基础地址
VITE_WS_URL=ws://localhost:3000/ws             # WebSocket地址
VITE_UPLOAD_URL=http://localhost:3000/api/upload # 文件上传地址
```

### 功能开关

```bash
VITE_USE_MOCK=true                      # 是否启用Mock数据
VITE_DEBUG=true                         # 是否启用调试模式
VITE_VUE_DEVTOOLS=true                  # 是否启用Vue DevTools
VITE_ERROR_MONITORING=false             # 是否启用错误监控
VITE_ENABLE_TESTING_TOOLS=true          # 是否启用测试工具
```

### 资源配置

```bash
VITE_CDN_URL=https://cdn.example.com    # CDN地址
VITE_BASE_PATH=/                        # 应用部署路径
VITE_ASSETS_PATH=/assets/               # 静态资源路径
```

## 🚀 使用方法

### 在代码中访问环境变量

```typescript
// 直接访问
const apiUrl = import.meta.env.VITE_API_BASE_URL

// 使用配置类
import AppConfig from '@/utils/env'

const config = AppConfig.getFullConfig()
console.log(config.api.baseURL)

// 使用工具类进行类型转换
import { EnvUtils } from '@/types/env.d'

const isDebug = EnvUtils.getBoolean('VITE_DEBUG')
const port = EnvUtils.getNumber('VITE_DEV_PORT', 5174)
```

### 在Vue组件中使用

```vue
<script setup lang="ts">
import AppConfig from '@/utils/env'

// 获取应用信息
const appInfo = AppConfig.getAppInfo()

// 检查功能开关
const features = AppConfig.getFeatureFlags()

// 条件渲染
const showDebugPanel = features.debug && features.testingTools
</script>

<template>
  <div>
    <h1>{{ appInfo.name }} v{{ appInfo.version }}</h1>
    <div v-if="showDebugPanel">
      <!-- 调试面板 -->
    </div>
  </div>
</template>
```

## 🛠️ 开发环境设置

### 1. 复制本地配置文件

```bash
cp .env.local.example .env.local
```

### 2. 根据需要修改 `.env.local`

```bash
# 个人本地配置
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEVELOPER_NAME=Your Name
VITE_DEBUG_COMPONENTS=true
```

### 3. 启动开发服务器

```bash
npm run dev
```

## 🏗️ 生产环境部署

### 1. 确保生产环境变量正确配置

检查 `.env.production` 文件中的配置：

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_USE_MOCK=false
VITE_DEBUG=false
```

### 2. 构建生产版本

```bash
npm run build
```

## ⚠️ 注意事项

1. **安全性**: 只有以 `VITE_` 开头的变量才会被暴露到客户端代码中
2. **版本控制**: `.env.local` 文件会被git忽略，不要提交敏感信息
3. **类型安全**: 使用 `src/types/env.d.ts` 中定义的类型来获得更好的开发体验
4. **验证**: 项目启动时会自动验证必需的环境变量是否存在

## 🔍 调试环境变量

在开发环境下，应用启动时会自动打印环境变量验证报告：

```
✅ 环境变量验证通过
📊 当前环境信息:
  - 环境: development
  - 应用名称: Volotage-EMS
  - 应用版本: 1.0.0
  - API地址: http://localhost:3000/api
  - 调试模式: 开启
  - Mock数据: 开启
```

## 📚 参考资料

- [Vite 环境变量文档](https://vitejs.dev/guide/env-and-mode.html)
- [Vue.js 环境变量最佳实践](https://vuejs.org/guide/best-practices/production-deployment.html)
