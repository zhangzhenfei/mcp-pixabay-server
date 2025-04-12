module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // Bug修复
        'docs', // 文档更新
        'style', // 代码风格变更（不影响功能）
        'refactor', // 代码重构
        'perf', // 性能改进
        'test', // 测试相关
        'build', // 构建系统或外部依赖项
        'ci', // CI配置和脚本
        'chore', // 其他修改
        'revert', // 回滚提交
      ],
    ],
    'type-case': [2, 'always', 'lower'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 72],
  },
};
