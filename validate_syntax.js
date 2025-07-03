// 语法验证脚本
// 用于检查 src/index.js 是否有语法错误

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  console.log('🔍 检查 src/index.js 语法...');
  
  const indexPath = join(__dirname, 'src', 'index.js');
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // 检查基本语法问题
  const issues = [];
  
  // 检查重复的变量声明
  const varDeclarations = content.match(/const\s+(\w+)\s*=/g) || [];
  const varNames = varDeclarations.map(decl => decl.match(/const\s+(\w+)/)[1]);
  const duplicates = varNames.filter((name, index) => varNames.indexOf(name) !== index);
  
  if (duplicates.length > 0) {
    issues.push(`重复的变量声明: ${[...new Set(duplicates)].join(', ')}`);
  }
  
  // 检查未闭合的括号
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    issues.push(`括号不匹配: { ${openBraces} 个, } ${closeBraces} 个`);
  }
  
  // 检查未闭合的圆括号
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    issues.push(`圆括号不匹配: ( ${openParens} 个, ) ${closeParens} 个`);
  }
  
  // 检查基本的函数声明
  const functionDeclarations = content.match(/function\s+\w+\s*\(/g) || [];
  const asyncFunctionDeclarations = content.match(/async\s+function\s+\w+\s*\(/g) || [];
  
  console.log(`📊 统计信息:`);
  console.log(`  - 文件大小: ${(content.length / 1024).toFixed(2)} KB`);
  console.log(`  - 行数: ${content.split('\n').length}`);
  console.log(`  - 函数声明: ${functionDeclarations.length + asyncFunctionDeclarations.length} 个`);
  console.log(`  - 变量声明: ${varDeclarations.length} 个`);
  
  if (issues.length === 0) {
    console.log('✅ 语法检查通过！没有发现明显的语法错误。');
  } else {
    console.log('❌ 发现以下问题:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  // 检查测速功能相关的函数是否存在
  const speedTestFunctions = [
    'testProxyConnectivity',
    'batchSpeedTest', 
    'filterByLatency',
    'getSpeedTestCacheKey',
    'generateLatencyDistribution'
  ];
  
  console.log('\n🔧 测速功能检查:');
  speedTestFunctions.forEach(funcName => {
    if (content.includes(`function ${funcName}`) || content.includes(`async function ${funcName}`)) {
      console.log(`  ✅ ${funcName} - 已实现`);
    } else {
      console.log(`  ❌ ${funcName} - 未找到`);
    }
  });
  
  // 检查新增的参数处理
  const speedParams = ['speed_test', 'timeout', 'max_latency', 'concurrent_tests'];
  console.log('\n⚙️ 参数处理检查:');
  speedParams.forEach(param => {
    if (content.includes(`'${param}'`) || content.includes(`"${param}"`)) {
      console.log(`  ✅ ${param} - 已添加`);
    } else {
      console.log(`  ❌ ${param} - 未找到`);
    }
  });
  
  console.log('\n🎯 部署建议:');
  console.log('  1. 确保 wrangler.toml 配置正确');
  console.log('  2. 运行 npx wrangler dev 进行本地测试');
  console.log('  3. 使用 npx wrangler deploy 部署到生产环境');
  
} catch (error) {
  console.error('❌ 检查过程中出错:', error.message);
  process.exit(1);
}
