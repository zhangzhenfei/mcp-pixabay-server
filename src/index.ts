#!/usr/bin/env node

/**
 * 这是一个Pixabay API的MCP服务器实现
 * 它通过以下功能演示了MCP的核心概念，如资源和工具：
 * - 搜索Pixabay图片
 * - 获取Pixabay视频
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

/**
 * 创建MCP服务器，具有资源和工具
 */
const server = new McpServer({
  name: 'pixabay-mcp-server',
  version: '0.1.0',
});

/**
 * 注册搜索Pixabay图片工具
 */
server.tool(
  'search_images',
  {
    query: z.string().describe('搜索图片的关键词'),
    image_type: z.enum(['all', 'photo', 'illustration', 'vector']).optional().describe('图片类型'),
    orientation: z.enum(['all', 'horizontal', 'vertical']).optional().describe('图片方向'),
    category: z.string().optional().describe('图片类别'),
    colors: z.string().optional().describe('图片颜色'),
    page: z.number().optional().describe('页码'),
    per_page: z.number().min(3).max(200).optional().describe('每页结果数量'),
    safesearch: z.boolean().optional().describe('安全搜索'),
  },
  async ({ query, image_type, orientation, category, colors, page, per_page, safesearch }) => {
    if (!PIXABAY_API_KEY) {
      return {
        content: [
          {
            type: 'text',
            text: '错误：未提供Pixabay API密钥。请使用环境变量PIXABAY_API_KEY提供API密钥。',
          },
        ],
      };
    }

    // 构建查询参数
    const params = new URLSearchParams();
    params.append('key', PIXABAY_API_KEY);
    params.append('q', query);

    if (image_type) params.append('image_type', image_type);
    if (orientation) params.append('orientation', orientation);
    if (category) params.append('category', category);
    if (colors) params.append('colors', colors);
    if (page) params.append('page', page.toString());
    if (per_page) params.append('per_page', per_page.toString());
    if (safesearch !== undefined) params.append('safesearch', safesearch ? 'true' : 'false');

    try {
      // 调用Pixabay API
      const response = await fetch(`https://pixabay.com/api/?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data?.hits, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error('搜索图片时出错:', error);
      return {
        content: [
          {
            type: 'text',
            text: `搜索图片时出错: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

/**
 * 注册搜索Pixabay视频工具
 */
server.tool(
  'search_videos',
  {
    query: z.string().describe('搜索视频的关键词'),
    video_type: z.enum(['all', 'film', 'animation']).optional().describe('视频类型'),
    category: z.string().optional().describe('视频类别'),
    page: z.number().optional().describe('页码'),
    per_page: z.number().min(3).max(200).optional().describe('每页结果数量'),
    safesearch: z.boolean().optional().describe('安全搜索'),
  },
  async ({ query, video_type, category, page, per_page, safesearch }) => {
    if (!PIXABAY_API_KEY) {
      return {
        content: [
          {
            type: 'text',
            text: '错误：未提供Pixabay API密钥。请使用环境变量PIXABAY_API_KEY提供API密钥。',
          },
        ],
      };
    }

    // 构建查询参数
    const params = new URLSearchParams();
    params.append('key', PIXABAY_API_KEY);
    params.append('q', query);

    if (video_type) params.append('video_type', video_type);
    if (category) params.append('category', category);
    if (page) params.append('page', page.toString());
    if (per_page) params.append('per_page', per_page.toString());
    if (safesearch !== undefined) params.append('safesearch', safesearch ? 'true' : 'false');

    try {
      // 调用Pixabay API
      const response = await fetch(`https://pixabay.com/api/videos/?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error('搜索视频时出错:', error);
      return {
        content: [
          {
            type: 'text',
            text: `搜索视频时出错: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

/**
 * 使用stdio传输启动服务器。
 * 这允许服务器通过标准输入/输出流进行通信。
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error('服务器错误:', error);
  process.exit(1);
});
