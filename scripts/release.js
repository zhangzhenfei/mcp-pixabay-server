#!/usr/bin/env node

import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 确保工作区干净
function ensureCleanWorkingDirectory() {
  try {
    const status = execSync('git status --porcelain').toString().trim();
    if (status) {
      console.error('工作区不干净，请先提交或暂存更改');
      process.exit(1);
    }
  } catch (error) {
    console.error('检查工作区状态失败:', error.message);
    process.exit(1);
  }
}

// 确保在主分支
function ensureMainBranch() {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (currentBranch !== 'main') {
      console.error('请切换到 main 分支后再运行此脚本');
      process.exit(1);
    }
  } catch (error) {
    console.error('检查当前分支失败:', error.message);
    process.exit(1);
  }
}

// 执行命令并输出结果
function execCommand(command) {
  try {
    console.log(`执行: ${command}`);
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`命令执行失败: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// 获取当前版本
function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

// 主函数
async function main() {
  try {
    ensureMainBranch();
    ensureCleanWorkingDirectory();

    // 拉取最新代码
    console.log('拉取最新代码...');
    execCommand('git pull origin main');

    const currentVersion = getCurrentVersion();
    console.log(`当前版本: ${currentVersion}`);

    // 选择版本类型
    console.log('\n请选择版本升级类型:');
    console.log('1) patch (1.0.0 -> 1.0.1) - 修复错误');
    console.log('2) minor (1.0.0 -> 1.1.0) - 新功能，向后兼容');
    console.log('3) major (1.0.0 -> 2.0.0) - 重大变更，可能不向后兼容');

    const versionType = await new Promise(resolve => {
      rl.question('选择 [1-3]: ', answer => {
        resolve(answer.trim());
      });
    });

    let npmVersionType;
    switch (versionType) {
      case '1':
        npmVersionType = 'patch';
        break;
      case '2':
        npmVersionType = 'minor';
        break;
      case '3':
        npmVersionType = 'major';
        break;
      default:
        console.error('无效选择，退出');
        process.exit(1);
    }

    // 更新版本
    console.log(`\n更新版本号 (${npmVersionType})...`);
    execCommand(`npm version ${npmVersionType} --no-git-tag-version`);

    const newVersion = getCurrentVersion();
    console.log(`新版本: ${newVersion}`);

    // 提交版本更新
    console.log('\n提交版本更新...');
    execCommand('git add package.json');
    execCommand(`git commit -m "chore(release): 升级版本至 v${newVersion}"`);

    // 构建项目
    console.log('\n构建项目...');
    execCommand('npm run build');

    // 创建 Tag
    console.log('\n创建 Tag...');
    execCommand(`git tag -a v${newVersion} -m "版本 v${newVersion}"`);

    // 发布前确认
    const shouldProceed = await new Promise(resolve => {
      rl.question('\n准备发布版本，是否继续? (y/n): ', answer => {
        resolve(answer.toLowerCase() === 'y');
      });
    });

    if (!shouldProceed) {
      console.log('发布已取消');
      process.exit(0);
    }

    // 推送到远程
    console.log('\n推送代码和标签到远程仓库...');
    execCommand('git push origin main');
    execCommand(`git push origin v${newVersion}`);

    console.log('\n发布流程完成!');
    console.log(`版本 v${newVersion} 已发布，GitHub Actions 应该已经触发。`);
    console.log('可以在 GitHub 仓库的 Actions 页面查看进度。');

    rl.close();
  } catch (error) {
    console.error('发布过程中出错:', error);
    process.exit(1);
  }
}

main();
