# MCP Pixabay Server

[![npm version](https://img.shields.io/npm/v/@sadais/mcp-pixabay-server.svg)](https://www.npmjs.com/package/@sadais/mcp-pixabay-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于 [MCP (Model Context Protocol)](https://modelcontextprotocol.github.io/) 的 Pixabay API 接口服务器，让 AI 模型可以搜索和获取 Pixabay 平台的图片和视频资源。

## 功能特性

- 完全符合 MCP 协议规范的服务器实现
- 提供两个核心工具：
  - `search_images` - 搜索 Pixabay 图片资源
  - `search_videos` - 搜索 Pixabay 视频资源
- 支持丰富的搜索参数：关键词、图片/视频类型、方向、类别、颜色等
- 返回完整的资源元数据（URL、分辨率、标签等）
- 支持通过环境变量配置 API 密钥

## 安装

### 全局安装

```bash
npm install -g @sadais/mcp-pixabay-server
```

### 项目依赖安装

```bash
npm install @sadais/mcp-pixabay-server --save
```

## 配置

服务器需要 Pixabay API 密钥才能正常工作。您可以通过环境变量设置它：

```bash
export PIXABAY_API_KEY=your_api_key_here
```

如果您没有 Pixabay API 密钥，可以在 [Pixabay API 文档](https://pixabay.com/api/docs/) 页面注册并获取。

## 使用方法

### 作为命令行工具

```bash
# 启动 MCP 服务器
mcp-pixabay-server

# 或者使用 SSE 服务器模式
mcp-pixabay-server-sse
```

### 与 AI 模型集成

本服务器可以与支持 MCP 协议的 AI 模型（如 Claude）集成使用：

1. 启动 MCP 服务器
2. 配置 AI 模型使用此 MCP 服务

### API 参考

#### search_images

搜索 Pixabay 图片资源。

参数：
- `query` (必填) - 搜索关键词
- `image_type` - 图片类型 ("all", "photo", "illustration", "vector")
- `orientation` - 图片方向 ("all", "horizontal", "vertical")
- `category` - 图片类别
- `colors` - 图片颜色
- `safesearch` - 安全搜索模式
- `page` - 页码
- `per_page` - 每页结果数量（3-200）

#### search_videos

搜索 Pixabay 视频资源。

参数：
- `query` (必填) - 搜索关键词
- `video_type` - 视频类型 ("all", "film", "animation")
- `category` - 视频类别
- `safesearch` - 安全搜索模式
- `page` - 页码
- `per_page` - 每页结果数量（3-200）

## 开发指南

### 环境设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/mcp-pixabay-server.git
cd mcp-pixabay-server

# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式（自动编译）
npm run watch
```

### 调试

由于 MCP 服务器通过 stdio 进行通信，调试可能具有挑战性。推荐使用 [MCP Inspector](https://github.com/modelcontextprotocol/inspector)：

```bash
npm run inspector
# 或者 SSE 模式
npm run inspector:sse
```

Inspector 将提供一个 URL，让您可以在浏览器中访问调试工具。

## 贡献指南

我们欢迎并感谢任何形式的贡献！

### Issue 规范

创建 Issue 时，请遵循以下规范：

1. 使用清晰简洁的标题描述问题或功能
2. 对于 Bug 报告：
   - 描述问题的复现步骤
   - 预期行为和实际行为
   - 环境信息（操作系统、Node.js 版本等）
   - 相关日志或截图
3. 对于功能请求：
   - 描述功能及其目的
   - 预期的使用场景
   - 实现建议（可选）

### Pull Request 规范

提交 PR 时，请遵循以下规范：

1. 创建一个描述性的分支名，如 `feature/add-image-filters` 或 `fix/api-timeout`
2. 确保代码通过所有测试
3. PR 标题应简洁明了地描述更改内容
4. PR 描述中包含：
   - 更改的详细说明
   - 关联的 Issue 编号（如有）
   - 测试方法（如适用）
5. 代码风格保持一致

### 开发流程

1. Fork 仓库并克隆到本地
2. 创建新分支进行开发
3. 提交更改并推送到您的 Fork
4. 创建 Pull Request 到主仓库

## 许可证

本项目基于 MIT 许可证开源 - 详见 [LICENSE](LICENSE) 文件
