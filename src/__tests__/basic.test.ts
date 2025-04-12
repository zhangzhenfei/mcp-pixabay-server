import { describe, it, expect } from 'vitest';

describe('基础测试', () => {
  it('基本真实性测试', () => {
    expect(true).toBe(true);
  });

  it('基本框架测试', () => {
    expect(1 + 1).toBe(2);
  });

  it('基本字符串测试', () => {
    expect('Pixabay').toContain('Pixabay');
  });
});
