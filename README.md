# EdgeEMS - 边缘能源管理系统

## 项目概述

EdgeEMS是一个基于Vue 3 + TypeScript的现代化边缘能源管理系统，采用Composition API和Element Plus UI组件库构建。

## 技术栈

- **前端框架**: Vue 3.4+
- **构建工具**: Vite 5.0+
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **开发语言**: TypeScript 5.0+
- **样式预处理**: Sass
- **图表库**: ECharts
- **HTTP客户端**: Axios
- **国际化**: Vue I18n

## 项目结构

```
src/
├── api/                    # API接口定义
├── assets/                 # 静态资源
│   ├── fonts/             # 字体文件
│   ├── icons/             # SVG图标
│   ├── images/            # 图片资源
│   └── styles/            # 全局样式
├── components/            # 公共组件
│   ├── card/             # 卡片组件
│   ├── charts/           # 图表组件
│   ├── common/           # 通用组件
│   └── dialog/           # 对话框组件
├── composables/          # 组合式函数
├── layout/               # 布局组件
├── router/               # 路由配置
├── stores/               # 状态管理
├── types/                # 类型定义
├── utils/                # 工具函数
└── views/                # 页面组件
    ├── AlarmCurrentRecords/    # 当前告警记录
    ├── AlarmHistoryRecords/    # 历史告警记录
    ├── ChannelConfiguration/   # 通道配置
    ├── Configuration/          # 系统配置
    ├── ControlManagement/      # 控制管理
    ├── ControlRecord/          # 控制记录
    ├── DeviceBattery/          # 电池设备
    ├── DeviceConfiguration/    # 设备配置
    ├── DeviceMeter1/           # 电表1
    ├── DeviceMeter2/           # 电表2
    ├── DevicePCS/              # PCS设备
    ├── DevicesPV/              # 光伏设备
    ├── DieselGenerator/        # 柴油发电机
    ├── HomeView/               # 首页
    ├── LoginView/              # 登录页
    ├── RulesManagement/        # 规则管理
    ├── Statistics/             # 统计分析
    ├── SystemSetting/          # 系统设置
    └── UserManagement/         # 用户管理
```

## 类型系统重构

### 重构目标

为了提高项目的类型安全性和代码可维护性，我们对类型定义进行了系统性的重构：

1. **统一类型管理**: 将所有view文件夹下的类型声明统一放到`src/types/`目录下
2. **按功能模块分类**: 根据业务功能创建对应的类型文件
3. **消除重复定义**: 合并重复的类型定义，提高代码复用性
4. **增强类型安全**: 使用更精确的类型定义，减少运行时错误

### 类型文件结构

```
src/types/
├── alarm.ts              # 告警相关类型
├── channelConfiguration.ts # 通道配置类型
├── controlManagement.ts   # 控制管理类型
├── deviceConfiguration.ts # 设备配置类型
├── deviceMonitoring.ts    # 设备监控类型
├── home.ts               # 首页相关类型
├── menu.ts               # 菜单相关类型
├── statistics.ts         # 统计分析类型
├── user.ts               # 用户相关类型
├── userManagement.ts     # 用户管理类型
└── websocket.ts          # WebSocket相关类型
```

### 重构内容

#### 1. 设备配置模块 (`deviceConfiguration.ts`)

- `RelatedPoint`: 关联点类型
- `MeasurementProperty`: 量测属性类型
- `ControlProperty`: 控制属性类型
- `Model`: 设备模型类型
- `ModelForm`: 模型表单类型
- `Property`: 属性类型
- `DialogExpose`: 对话框暴露类型

#### 2. 通道配置模块 (`channelConfiguration.ts`)

- `Point`: 点位数据类型
- `ProtocolConfig`: 协议配置类型
- `Channel`: 通道类型
- `ChannelForm`: 通道表单类型
- `Props`: 组件Props类型
- `DATA_TYPES`: 数据类型选项
- `REGISTER_TYPES`: 寄存器类型选项
- `BYTE_ORDERS`: 字节序选项

#### 3. 控制管理模块 (`controlManagement.ts`)

- `Operator`: 操作符类型
- `RuleFormModel`: 规则表单模型类型
- `RuleInfo`: 规则信息类型
- `DialogExpose`: 对话框暴露类型

#### 4. 设备监控模块 (`deviceMonitoring.ts`)

- `LeftTableItem`: 左侧表格数据类型
- `RightTableItem`: 右侧表格数据类型

#### 5. 用户管理模块 (`userManagement.ts`)

- `UserFormModel`: 用户表单模型类型
- `DialogExpose`: 对话框暴露类型

#### 6. 统计分析模块 (`statistics.ts`)

- `OperationLogRecord`: 操作日志记录类型

### 重构优势

1. **类型安全**: 统一的类型定义减少了类型错误
2. **代码复用**: 消除了重复的类型定义
3. **维护性**: 类型定义集中管理，便于维护和更新
4. **开发体验**: 更好的IDE支持和自动补全
5. **文档化**: 类型定义本身就是最好的文档

### 使用方式

在Vue组件中使用类型：

```typescript
// 导入类型
import type { RuleFormModel, DialogExpose } from '@/types/controlManagement'

// 使用类型
const form = ref<RuleFormModel>({
  rule_name: '',
  service_type: null,
  point_id: null,
  data_type: null,
  warning_level: null,
  operator: null,
  value: null,
  enabled: true,
})
```

## 开发指南

### 环境要求

- Node.js 18.0+
- npm 9.0+ 或 yarn 1.22+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 类型检查

```bash
npm run type-check
```

## 代码规范

### TypeScript规范

1. **类型定义**: 所有类型定义统一放在`src/types/`目录下
2. **导入方式**: 使用`import type`导入类型，避免运行时导入
3. **接口命名**: 使用PascalCase命名接口和类型
4. **类型注释**: 为复杂类型添加注释说明

### Vue组件规范

1. **组件命名**: 使用PascalCase命名组件
2. **Props定义**: 使用TypeScript接口定义Props类型
3. **事件定义**: 使用`defineEmits`定义事件类型
4. **响应式数据**: 使用`ref`和`reactive`定义响应式数据

### 样式规范

1. **BEM命名**: 使用BEM规范命名CSS类
2. **SCSS使用**: 使用SCSS进行样式预处理
3. **响应式设计**: 使用flex布局，确保在不同设备上的良好体验

## 部署说明

### Docker部署

项目支持Docker部署，相关文件包括：

- `Dockerfile`: 容器构建文件
- `docker-compose.yml`: 容器编排文件
- `nginx.conf`: Nginx配置文件

### 构建镜像

```bash
docker build -t edgeems .
```

### 启动服务

```bash
docker-compose up -d
```

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

**注意**: 本项目仍在积极开发中，API和功能可能会发生变化。请关注更新日志了解最新变化。
