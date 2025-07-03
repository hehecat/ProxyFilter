# ProxyFilter 部署指南

## 快速部署

### 1. 安装依赖
```bash
npm install
```

### 2. 本地开发测试
```bash
# 启动本地开发服务器
npx wrangler dev

# 或者使用自定义端口
npx wrangler dev --port 8787
```

### 3. 部署到Cloudflare Workers
```bash
# 登录Cloudflare账户
npx wrangler login

# 部署到生产环境
npx wrangler deploy
```

## 测速功能配置

### 环境变量配置
在 `wrangler.toml` 中可以配置以下环境变量来自定义测速行为：

```toml
[vars]
# 默认测速超时时间（毫秒）
DEFAULT_SPEED_TIMEOUT = "5000"

# 默认最大延迟限制（毫秒）
DEFAULT_MAX_LATENCY = "1000"

# 默认并发测试数量
DEFAULT_CONCURRENT_TESTS = "5"

# 测速结果缓存时间（秒）
SPEED_CACHE_TTL = "600"
```

### 测速功能使用

#### 基础用法
```
https://your-worker.workers.dev/?url=订阅地址&speed_test=true
```

#### 完整参数
```
https://your-worker.workers.dev/?url=订阅地址&speed_test=true&timeout=3000&max_latency=800&concurrent_tests=3
```

#### 参数说明
- `speed_test=true`: 启用测速功能
- `timeout=5000`: 单个节点测试超时时间（毫秒）
- `max_latency=1000`: 最大允许延迟（毫秒）
- `concurrent_tests=5`: 并发测试数量

## 测试验证

### 1. 使用测试页面
打开 `test_speed.html` 文件，输入你的Worker URL进行测试。

### 2. 使用测试数据
```bash
# 使用提供的测试数据
curl "https://your-worker.workers.dev/?url=https://raw.githubusercontent.com/your-repo/ProxyFilter/main/test_data.yaml&speed_test=true"
```

### 3. 本地测试脚本
```bash
# 运行本地测试（需要Node.js环境）
node test_local.js
```

## 性能优化建议

### 1. 缓存配置
- 测速结果默认缓存10分钟
- 失败结果缓存5分钟
- 无效配置缓存1小时

### 2. 并发控制
- 建议并发数不超过10个
- 大量节点时建议设置较长的超时时间
- 可以通过环境变量调整默认值

### 3. Workers限制
- 免费版CPU时间限制：10ms
- 付费版CPU时间限制：50ms
- 总执行时间限制：30秒
- 建议测试节点数量不超过50个

## 故障排除

### 常见问题

1. **测速功能不工作**
   - 检查 `speed_test=true` 参数是否正确
   - 确认节点配置格式正确
   - 查看浏览器控制台错误信息

2. **测速结果不准确**
   - 测速只能测试基础连通性，不能测试真实代理功能
   - CORS错误通常表示服务器可达但协议不兼容
   - 超时可能是网络问题或服务器不可达

3. **性能问题**
   - 减少并发测试数量
   - 增加超时时间
   - 启用缓存功能

### 调试模式
在浏览器开发者工具中查看详细日志：
- 测速进度信息
- 单个节点测试结果
- 缓存命中情况
- 错误详情

## 更新日志

### v1.1.0 - 测速功能
- ✅ 添加节点连通性测试
- ✅ 实现延迟测量和排序
- ✅ 支持批量并发测速
- ✅ 添加测速结果缓存
- ✅ 智能过滤无效节点
- ✅ 详细的测速统计信息

### 技术特性
- 基于fetch API的连通性测试
- Promise.allSettled()并发控制
- 智能缓存机制
- 详细的错误处理
- 兼容现有过滤功能
