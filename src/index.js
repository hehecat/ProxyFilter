import yaml from 'js-yaml';

// 添加内存缓存系统
// 使用简单的Map来存储缓存内容
const CACHE = new Map();
// 默认缓存时间：30分钟（1800秒）
const DEFAULT_CACHE_TTL = 1800;

// 添加默认模板变量 - 直接内嵌config.yaml的内容
const DEFAULT_TEMPLATE_YAML = `
mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
dns:
  enable: true
  ipv6: false
  default-nameserver:
  - 223.5.5.5
  - 119.29.29.29
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  use-hosts: true
  nameserver:
  - https://doh.pub/dns-query
  - https://dns.alidns.com/dns-query
  fallback:
  - https://doh.dns.sb/dns-query
  - https://dns.cloudflare.com/dns-query
  - https://dns.twnic.tw/dns-query
  - tls://8.8.4.4:853
  fallback-filter:
    geoip: true
    ipcidr:
    - 240.0.0.0/4
    - 0.0.0.0/32

proxy-groups:
- name: 手动选择
  type: select
  proxies:
  - 自动选择
  - 负载散列
  - 负载轮询
  - DIRECT

- name: 自动选择
  type: url-test
  proxies: []
  url: http://www.msftconnecttest.com/connecttest.txt
  interval: 3600
- name: 负载散列
  type: load-balance
  url: http://www.msftconnecttest.com/connecttest.txt
  interval: 3600
  strategy: consistent-hashing
  proxies: []
- name: 负载轮询
  type: load-balance
  url: http://www.msftconnecttest.com/connecttest.txt
  interval: 3600
  strategy: round-robin
  proxies: []
rules:
- DOMAIN,xn--6nq0hk9tdjr.com,DIRECT
- DOMAIN-SUFFIX,services.googleapis.cn,手动选择
- DOMAIN-SUFFIX,xn--ngstr-lra8j.com,手动选择
- DOMAIN,safebrowsing.urlsec.qq.com,DIRECT
- DOMAIN,safebrowsing.googleapis.com,DIRECT
- DOMAIN,developer.apple.com,手动选择
- DOMAIN-SUFFIX,digicert.com,手动选择
- DOMAIN,ocsp.apple.com,手动选择
- DOMAIN,ocsp.comodoca.com,手动选择
- DOMAIN,ocsp.usertrust.com,手动选择
- DOMAIN,ocsp.sectigo.com,手动选择
- DOMAIN,ocsp.verisign.net,手动选择
- DOMAIN-SUFFIX,apple-dns.net,手动选择
- DOMAIN,testflight.apple.com,手动选择
- DOMAIN,sandbox.itunes.apple.com,手动选择
- DOMAIN,itunes.apple.com,手动选择
- DOMAIN-SUFFIX,apps.apple.com,手动选择
- DOMAIN-SUFFIX,blobstore.apple.com,手动选择
- DOMAIN,cvws.icloud-content.com,手动选择
- DOMAIN-SUFFIX,mzstatic.com,DIRECT
- DOMAIN-SUFFIX,itunes.apple.com,DIRECT
- DOMAIN-SUFFIX,icloud.com,DIRECT
- DOMAIN-SUFFIX,icloud-content.com,DIRECT
- DOMAIN-SUFFIX,me.com,DIRECT
- DOMAIN-SUFFIX,aaplimg.com,DIRECT
- DOMAIN-SUFFIX,cdn20.com,DIRECT
- DOMAIN-SUFFIX,cdn-apple.com,DIRECT
- DOMAIN-SUFFIX,akadns.net,DIRECT
- DOMAIN-SUFFIX,akamaiedge.net,DIRECT
- DOMAIN-SUFFIX,edgekey.net,DIRECT
- DOMAIN-SUFFIX,mwcloudcdn.com,DIRECT
- DOMAIN-SUFFIX,mwcname.com,DIRECT
- DOMAIN-SUFFIX,apple.com,DIRECT
- DOMAIN-SUFFIX,apple-cloudkit.com,DIRECT
- DOMAIN-SUFFIX,apple-mapkit.com,DIRECT
- DOMAIN-SUFFIX,126.com,DIRECT
- DOMAIN-SUFFIX,126.net,DIRECT
- DOMAIN-SUFFIX,127.net,DIRECT
- DOMAIN-SUFFIX,163.com,DIRECT
- DOMAIN-SUFFIX,360buyimg.com,DIRECT
- DOMAIN-SUFFIX,36kr.com,DIRECT
- DOMAIN-SUFFIX,acfun.tv,DIRECT
- DOMAIN-SUFFIX,air-matters.com,DIRECT
- DOMAIN-SUFFIX,aixifan.com,DIRECT
- DOMAIN-KEYWORD,alicdn,DIRECT
- DOMAIN-KEYWORD,alipay,DIRECT
- DOMAIN-KEYWORD,taobao,DIRECT
- DOMAIN-SUFFIX,amap.com,DIRECT
- DOMAIN-SUFFIX,autonavi.com,DIRECT
- DOMAIN-KEYWORD,baidu,DIRECT
- DOMAIN-SUFFIX,bdimg.com,DIRECT
- DOMAIN-SUFFIX,bdstatic.com,DIRECT
- DOMAIN-SUFFIX,bilibili.com,DIRECT
- DOMAIN-SUFFIX,bilivideo.com,DIRECT
- DOMAIN-SUFFIX,caiyunapp.com,DIRECT
- DOMAIN-SUFFIX,clouddn.com,DIRECT
- DOMAIN-SUFFIX,cnbeta.com,DIRECT
- DOMAIN-SUFFIX,cnbetacdn.com,DIRECT
- DOMAIN-SUFFIX,cootekservice.com,DIRECT
- DOMAIN-SUFFIX,csdn.net,DIRECT
- DOMAIN-SUFFIX,ctrip.com,DIRECT
- DOMAIN-SUFFIX,dgtle.com,DIRECT
- DOMAIN-SUFFIX,dianping.com,DIRECT
- DOMAIN-SUFFIX,douban.com,DIRECT
- DOMAIN-SUFFIX,doubanio.com,DIRECT
- DOMAIN-SUFFIX,duokan.com,DIRECT
- DOMAIN-SUFFIX,easou.com,DIRECT
- DOMAIN-SUFFIX,ele.me,DIRECT
- DOMAIN-SUFFIX,feng.com,DIRECT
- DOMAIN-SUFFIX,fir.im,DIRECT
- DOMAIN-SUFFIX,frdic.com,DIRECT
- DOMAIN-SUFFIX,g-cores.com,DIRECT
- DOMAIN-SUFFIX,godic.net,DIRECT
- DOMAIN-SUFFIX,gtimg.com,DIRECT
- DOMAIN,cdn.hockeyapp.net,DIRECT
- DOMAIN-SUFFIX,hongxiu.com,DIRECT
- DOMAIN-SUFFIX,hxcdn.net,DIRECT
- DOMAIN-SUFFIX,iciba.com,DIRECT
- DOMAIN-SUFFIX,ifeng.com,DIRECT
- DOMAIN-SUFFIX,ifengimg.com,DIRECT
- DOMAIN-SUFFIX,ipip.net,DIRECT
- DOMAIN-SUFFIX,iqiyi.com,DIRECT
- DOMAIN-SUFFIX,jd.com,DIRECT
- DOMAIN-SUFFIX,jianshu.com,DIRECT
- DOMAIN-SUFFIX,knewone.com,DIRECT
- DOMAIN-SUFFIX,le.com,DIRECT
- DOMAIN-SUFFIX,lecloud.com,DIRECT
- DOMAIN-SUFFIX,lemicp.com,DIRECT
- DOMAIN-SUFFIX,licdn.com,DIRECT
- DOMAIN-SUFFIX,luoo.net,DIRECT
- DOMAIN-SUFFIX,meituan.com,DIRECT
- DOMAIN-SUFFIX,meituan.net,DIRECT
- DOMAIN-SUFFIX,mi.com,DIRECT
- DOMAIN-SUFFIX,miaopai.com,DIRECT
- DOMAIN-SUFFIX,microsoft.com,DIRECT
- DOMAIN-SUFFIX,microsoftonline.com,DIRECT
- DOMAIN-SUFFIX,miui.com,DIRECT
- DOMAIN-SUFFIX,miwifi.com,DIRECT
- DOMAIN-SUFFIX,mob.com,DIRECT
- DOMAIN-SUFFIX,netease.com,DIRECT
- DOMAIN-SUFFIX,office.com,DIRECT
- DOMAIN-SUFFIX,office365.com,DIRECT
- DOMAIN-KEYWORD,officecdn,DIRECT
- DOMAIN-SUFFIX,oschina.net,DIRECT
- DOMAIN-SUFFIX,ppsimg.com,DIRECT
- DOMAIN-SUFFIX,pstatp.com,DIRECT
- DOMAIN-SUFFIX,qcloud.com,DIRECT
- DOMAIN-SUFFIX,qdaily.com,DIRECT
- DOMAIN-SUFFIX,qdmm.com,DIRECT
- DOMAIN-SUFFIX,qhimg.com,DIRECT
- DOMAIN-SUFFIX,qhres.com,DIRECT
- DOMAIN-SUFFIX,qidian.com,DIRECT
- DOMAIN-SUFFIX,qihucdn.com,DIRECT
- DOMAIN-SUFFIX,qiniu.com,DIRECT
- DOMAIN-SUFFIX,qiniucdn.com,DIRECT
- DOMAIN-SUFFIX,qiyipic.com,DIRECT
- DOMAIN-SUFFIX,qq.com,DIRECT
- DOMAIN-SUFFIX,qqurl.com,DIRECT
- DOMAIN-SUFFIX,rarbg.to,DIRECT
- DOMAIN-SUFFIX,ruguoapp.com,DIRECT
- DOMAIN-SUFFIX,segmentfault.com,DIRECT
- DOMAIN-SUFFIX,sinaapp.com,DIRECT
- DOMAIN-SUFFIX,smzdm.com,DIRECT
- DOMAIN-SUFFIX,snapdrop.net,DIRECT
- DOMAIN-SUFFIX,sogou.com,DIRECT
- DOMAIN-SUFFIX,sogoucdn.com,DIRECT
- DOMAIN-SUFFIX,sohu.com,DIRECT
- DOMAIN-SUFFIX,soku.com,DIRECT
- DOMAIN-SUFFIX,speedtest.net,DIRECT
- DOMAIN-SUFFIX,sspai.com,DIRECT
- DOMAIN-SUFFIX,suning.com,DIRECT
- DOMAIN-SUFFIX,taobao.com,DIRECT
- DOMAIN-SUFFIX,tencent.com,DIRECT
- DOMAIN-SUFFIX,tenpay.com,DIRECT
- DOMAIN-SUFFIX,tianyancha.com,DIRECT
- DOMAIN-SUFFIX,tmall.com,DIRECT
- DOMAIN-SUFFIX,tudou.com,DIRECT
- DOMAIN-SUFFIX,umetrip.com,DIRECT
- DOMAIN-SUFFIX,upaiyun.com,DIRECT
- DOMAIN-SUFFIX,upyun.com,DIRECT
- DOMAIN-SUFFIX,veryzhun.com,DIRECT
- DOMAIN-SUFFIX,weather.com,DIRECT
- DOMAIN-SUFFIX,weibo.com,DIRECT
- DOMAIN-SUFFIX,xiami.com,DIRECT
- DOMAIN-SUFFIX,xiami.net,DIRECT
- DOMAIN-SUFFIX,xiaomicp.com,DIRECT
- DOMAIN-SUFFIX,ximalaya.com,DIRECT
- DOMAIN-SUFFIX,xmcdn.com,DIRECT
- DOMAIN-SUFFIX,xunlei.com,DIRECT
- DOMAIN-SUFFIX,yhd.com,DIRECT
- DOMAIN-SUFFIX,yihaodianimg.com,DIRECT
- DOMAIN-SUFFIX,yinxiang.com,DIRECT
- DOMAIN-SUFFIX,ykimg.com,DIRECT
- DOMAIN-SUFFIX,youdao.com,DIRECT
- DOMAIN-SUFFIX,youku.com,DIRECT
- DOMAIN-SUFFIX,zealer.com,DIRECT
- DOMAIN-SUFFIX,zhihu.com,DIRECT
- DOMAIN-SUFFIX,zhimg.com,DIRECT
- DOMAIN-SUFFIX,zimuzu.tv,DIRECT
- DOMAIN-SUFFIX,zoho.com,DIRECT
- DOMAIN-KEYWORD,amazon,手动选择
- DOMAIN-KEYWORD,google,手动选择
- DOMAIN-KEYWORD,gmail,手动选择
- DOMAIN-KEYWORD,youtube,手动选择
- DOMAIN-KEYWORD,facebook,手动选择
- DOMAIN-SUFFIX,fb.me,手动选择
- DOMAIN-SUFFIX,fbcdn.net,手动选择
- DOMAIN-KEYWORD,twitter,手动选择
- DOMAIN-KEYWORD,instagram,手动选择
- DOMAIN-KEYWORD,dropbox,手动选择
- DOMAIN-SUFFIX,twimg.com,手动选择
- DOMAIN-KEYWORD,blogspot,手动选择
- DOMAIN-SUFFIX,youtu.be,手动选择
- DOMAIN-KEYWORD,whatsapp,手动选择
- DOMAIN-KEYWORD,admarvel,REJECT
- DOMAIN-KEYWORD,admaster,REJECT
- DOMAIN-KEYWORD,adsage,REJECT
- DOMAIN-KEYWORD,adsmogo,REJECT
- DOMAIN-KEYWORD,adsrvmedia,REJECT
- DOMAIN-KEYWORD,adwords,REJECT
- DOMAIN-KEYWORD,adservice,REJECT
- DOMAIN-SUFFIX,appsflyer.com,REJECT
- DOMAIN-KEYWORD,domob,REJECT
- DOMAIN-SUFFIX,doubleclick.net,REJECT
- DOMAIN-KEYWORD,duomeng,REJECT
- DOMAIN-KEYWORD,dwtrack,REJECT
- DOMAIN-KEYWORD,guanggao,REJECT
- DOMAIN-KEYWORD,lianmeng,REJECT
- DOMAIN-SUFFIX,mmstat.com,REJECT
- DOMAIN-KEYWORD,mopub,REJECT
- DOMAIN-KEYWORD,omgmta,REJECT
- DOMAIN-KEYWORD,openx,REJECT
- DOMAIN-KEYWORD,partnerad,REJECT
- DOMAIN-KEYWORD,pingfore,REJECT
- DOMAIN-KEYWORD,supersonicads,REJECT
- DOMAIN-KEYWORD,uedas,REJECT
- DOMAIN-KEYWORD,umeng,REJECT
- DOMAIN-KEYWORD,usage,REJECT
- DOMAIN-SUFFIX,vungle.com,REJECT
- DOMAIN-KEYWORD,wlmonitor,REJECT
- DOMAIN-KEYWORD,zjtoolbar,REJECT
- MATCH,手动选择
`;

// 初始化默认模板
let DEFAULT_TEMPLATE = null;
try {
  DEFAULT_TEMPLATE = yaml.load(DEFAULT_TEMPLATE_YAML);
  console.log('成功加载默认配置模板');
} catch (err) {
  console.warn('加载默认配置模板失败:', err.message);
}

// 缓存项结构
class CacheItem {
  constructor(data, ttl = DEFAULT_CACHE_TTL) {
    this.data = data;
    this.expires = Date.now() + ttl * 1000;
  }
  
  isExpired() {
    return Date.now() > this.expires;
  }
}

// 缓存管理函数
function getCachedData(key) {
  const item = CACHE.get(key);
  if (!item) return null;
  
  // 如果缓存过期，删除并返回null
  if (item.isExpired()) {
    CACHE.delete(key);
    return null;
  }
  
  return item.data;
}

function setCachedData(key, data, ttl = DEFAULT_CACHE_TTL) {
  CACHE.set(key, new CacheItem(data, ttl));
}

// 清理过期缓存的函数 - 可以在Worker初始化时或定期调用
function cleanupCache() {
  for (const [key, item] of CACHE.entries()) {
    if (item.isExpired()) {
      CACHE.delete(key);
    }
  }
}

// 计算缓存键的函数 - 包含URL和查询参数等关键信息
function getCacheKey(url, params = {}) {
  return `${url}:${JSON.stringify(params)}`;
}

// ==================== 测速功能相关函数 ====================

/**
 * 生成代理节点的缓存键
 * @param {Object} proxy 代理节点对象
 * @param {number} timeout 超时时间
 * @returns {string} 缓存键
 */
function getSpeedTestCacheKey(proxy, timeout) {
  return `speedtest:${proxy.server}:${proxy.port}:${timeout}`;
}

/**
 * 测试单个代理的连通性和延迟
 * @param {Object} proxy 代理节点对象
 * @param {number} timeout 超时时间(毫秒)
 * @param {boolean} useCache 是否使用缓存
 * @returns {Promise<Object>} 测试结果 {success: boolean, latency: number, error: string}
 */
async function testProxyConnectivity(proxy, timeout = 5000, useCache = true) {
  // 检查缓存
  if (useCache) {
    const cacheKey = getSpeedTestCacheKey(proxy, timeout);
    const cachedResult = getCachedData(cacheKey);
    if (cachedResult) {
      console.log(`使用缓存的测速结果: ${proxy.server}:${proxy.port}`);
      return cachedResult;
    }
  }

  const startTime = Date.now();

  try {
    // 构建测试URL
    let testUrl;
    const server = proxy.server;
    const port = proxy.port;

    // 检查服务器地址是否有效
    if (!server || !port) {
      const result = {
        success: false,
        latency: -1,
        error: '缺少服务器地址或端口'
      };

      // 缓存无效配置的结果
      if (useCache) {
        const cacheKey = getSpeedTestCacheKey(proxy, timeout);
        setCachedData(cacheKey, result, 3600); // 缓存1小时
      }

      return result;
    }

    // 验证端口范围
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      const result = {
        success: false,
        latency: -1,
        error: `无效的端口号: ${port}`
      };

      if (useCache) {
        const cacheKey = getSpeedTestCacheKey(proxy, timeout);
        setCachedData(cacheKey, result, 3600);
      }

      return result;
    }

    // 智能构建测试URL
    const httpPorts = [80, 8080, 3128, 8888, 8000, 9000];
    const httpsPorts = [443, 8443, 9443];

    if (httpsPorts.includes(portNum)) {
      testUrl = `https://${server}:${port}`;
    } else if (httpPorts.includes(portNum)) {
      testUrl = `http://${server}:${port}`;
    } else {
      testUrl = `http://${server}:${port}`;
    }

    console.log(`测试连通性: ${proxy.name || 'Unknown'} -> ${testUrl}`);

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // 发起连接测试
      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'ProxyFilter-SpeedTest/1.0'
        }
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;

      const result = {
        success: true,
        latency: latency,
        error: null
      };

      // 缓存成功的测速结果
      if (useCache) {
        const cacheKey = getSpeedTestCacheKey(proxy, timeout);
        setCachedData(cacheKey, result, 600); // 缓存10分钟
      }

      return result;

    } catch (fetchError) {
      clearTimeout(timeoutId);

      // 检查是否是超时错误
      if (fetchError.name === 'AbortError') {
        const result = {
          success: false,
          latency: timeout,
          error: '连接超时'
        };

        if (useCache) {
          const cacheKey = getSpeedTestCacheKey(proxy, timeout);
          setCachedData(cacheKey, result, 300); // 缓存5分钟
        }

        return result;
      }

      // 对于某些网络错误，我们仍然可以测量到响应时间
      const latency = Date.now() - startTime;

      // 如果是CORS错误或其他网络错误，但响应时间合理，可能服务器是可达的
      if (latency < timeout && (
        fetchError.message.includes('CORS') ||
        fetchError.message.includes('network') ||
        fetchError.message.includes('fetch')
      )) {
        const result = {
          success: true,
          latency: latency,
          error: `网络可达但协议不兼容: ${fetchError.message}`
        };

        if (useCache) {
          const cacheKey = getSpeedTestCacheKey(proxy, timeout);
          setCachedData(cacheKey, result, 600); // 缓存10分钟
        }

        return result;
      }

      return {
        success: false,
        latency: latency,
        error: fetchError.message
      };
    }

  } catch (error) {
    const latency = Date.now() - startTime;
    return {
      success: false,
      latency: latency,
      error: `测试失败: ${error.message}`
    };
  }
}

/**
 * 批量测速代理节点
 * @param {Array} proxies 代理节点数组
 * @param {Object} options 测速选项 {timeout, concurrentTests, useCache}
 * @returns {Promise<Object>} 测速结果 {results: Array, stats: Object}
 */
async function batchSpeedTest(proxies, options = {}) {
  const { timeout = 5000, concurrentTests = 5, useCache = true } = options;
  const results = [];
  const stats = {
    total: proxies.length,
    tested: 0,
    successful: 0,
    failed: 0,
    timeout: 0,
    avgLatency: 0,
    minLatency: Infinity,
    maxLatency: 0
  };

  console.log(`开始批量测速，共${proxies.length}个节点，并发数：${concurrentTests}，超时：${timeout}ms`);

  // 分批处理，控制并发数量
  const totalBatches = Math.ceil(proxies.length / concurrentTests);
  let currentBatch = 0;

  for (let i = 0; i < proxies.length; i += concurrentTests) {
    currentBatch++;
    console.log(`处理批次 ${currentBatch}/${totalBatches} (节点 ${i + 1}-${Math.min(i + concurrentTests, proxies.length)})`);

    const batch = proxies.slice(i, i + concurrentTests);

    // 并发测试当前批次
    const batchPromises = batch.map(async (proxy, index) => {
      const globalIndex = i + index;
      try {
        const result = await testProxyConnectivity(proxy, timeout, useCache);
        return {
          proxy: proxy,
          index: globalIndex,
          ...result
        };
      } catch (error) {
        return {
          proxy: proxy,
          index: globalIndex,
          success: false,
          latency: -1,
          error: `测试异常: ${error.message}`
        };
      }
    });

    // 等待当前批次完成
    const batchResults = await Promise.allSettled(batchPromises);

    // 处理批次结果
    batchResults.forEach((promiseResult, batchIndex) => {
      const globalIndex = i + batchIndex;
      let testResult;

      if (promiseResult.status === 'fulfilled') {
        testResult = promiseResult.value;
      } else {
        testResult = {
          proxy: batch[batchIndex],
          index: globalIndex,
          success: false,
          latency: -1,
          error: `Promise rejected: ${promiseResult.reason}`
        };
      }

      results.push(testResult);
      stats.tested++;

      // 更新统计信息
      if (testResult.success) {
        stats.successful++;
        if (testResult.latency > 0) {
          stats.minLatency = Math.min(stats.minLatency, testResult.latency);
          stats.maxLatency = Math.max(stats.maxLatency, testResult.latency);
        }
      } else {
        stats.failed++;
        if (testResult.error && testResult.error.includes('超时')) {
          stats.timeout++;
        }
      }
    });

    // 添加小延迟避免过于频繁的请求
    if (i + concurrentTests < proxies.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // 计算平均延迟
  const successfulResults = results.filter(r => r.success && r.latency > 0);
  if (successfulResults.length > 0) {
    stats.avgLatency = Math.round(
      successfulResults.reduce((sum, r) => sum + r.latency, 0) / successfulResults.length
    );
  }

  // 修正最小延迟
  if (stats.minLatency === Infinity) {
    stats.minLatency = 0;
  }

  console.log(`测速完成: 成功${stats.successful}个，失败${stats.failed}个，平均延迟${stats.avgLatency}ms`);

  return { results, stats };
}

/**
 * 根据延迟过滤和排序代理节点
 * @param {Array} speedTestResults 测速结果数组
 * @param {number} maxLatency 最大允许延迟(毫秒)
 * @returns {Object} 过滤结果 {filteredProxies: Array, filterStats: Object}
 */
function filterByLatency(speedTestResults, maxLatency = 1000) {
  const filterStats = {
    total: speedTestResults.length,
    successful: 0,
    filtered: 0,
    removed: 0
  };

  // 只保留测速成功的节点
  const successfulResults = speedTestResults.filter(result => {
    if (result.success) {
      filterStats.successful++;
      return true;
    }
    return false;
  });

  // 根据延迟过滤
  const filteredResults = successfulResults.filter(result => {
    if (result.latency <= maxLatency) {
      filterStats.filtered++;
      return true;
    } else {
      filterStats.removed++;
      return false;
    }
  });

  // 按延迟排序（从低到高）
  filteredResults.sort((a, b) => a.latency - b.latency);

  // 提取代理节点并添加延迟信息
  const filteredProxies = filteredResults.map(result => {
    const proxy = { ...result.proxy };
    // 在代理节点中添加延迟信息（作为注释）
    proxy._speedTest = {
      latency: result.latency,
      tested: true,
      success: result.success
    };
    return proxy;
  });

  console.log(`延迟过滤完成: 总计${filterStats.total}个，成功${filterStats.successful}个，通过过滤${filterStats.filtered}个，移除${filterStats.removed}个`);

  return { filteredProxies, filterStats };
}

export default {
  async fetch(request, env, ctx) {
    // 设置 CORS 头部
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 获取请求 URL 和路径
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 快速路径：处理常见的特殊请求
    if (pathname === '/favicon.ico') {
      return new Response(null, { status: 204 });
    }

    if (pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // 处理测试数据请求
    if (pathname === '/test_data_simple.yaml') {
      const testData = `# 简单测试数据
mixed-port: 7890
allow-lan: true
mode: rule
log-level: info

proxies:
  - name: "香港-测试节点1"
    type: vmess
    server: www.google.com
    port: 443
    uuid: 12345678-1234-1234-1234-123456789abc
    alterId: 0
    cipher: auto

  - name: "香港-测试节点2"
    type: ss
    server: www.cloudflare.com
    port: 443
    cipher: aes-256-gcm
    password: test123

  - name: "美国-测试节点1"
    type: trojan
    server: www.github.com
    port: 443
    password: test123

  - name: "日本-测试节点1"
    type: vmess
    server: www.yahoo.com
    port: 80
    uuid: 12345678-1234-1234-1234-123456789abc
    alterId: 0
    cipher: auto

  - name: "失败节点"
    type: ss
    server: invalid-server-that-should-fail.example.com
    port: 12345
    cipher: aes-256-gcm
    password: test123

proxy-groups:
  - name: "🚀 节点选择"
    type: select
    proxies:
      - "香港-测试节点1"
      - "香港-测试节点2"
      - "美国-测试节点1"
      - "日本-测试节点1"
      - "失败节点"

rules:
  - DOMAIN-SUFFIX,google.com,🚀 节点选择
  - MATCH,DIRECT`;

      return new Response(testData, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/yaml; charset=utf-8'
        }
      });
    }

    if (pathname !== '/') {
      return new Response('Not Found', {
          status: 404,
          headers: corsHeaders
        });
      }

    // 获取完整的原始查询字符串
    const queryString = url.search;

    // 从原始查询字符串中提取 yamlUrl 参数的完整值
    let yamlUrlParam = null;
    const urlMatch = queryString.match(/[?&]url=([^&]+)/);
    if (urlMatch && urlMatch[1]) {
      yamlUrlParam = decodeURIComponent(urlMatch[1]);

      // 处理直接提供的Base64数据内容
      if (yamlUrlParam.startsWith('data:') && yamlUrlParam.includes('base64,')) {
        try {
          const base64Content = yamlUrlParam.split('base64,')[1];
          const decodedContent = atob(base64Content);

          // 处理解码后的内容
          return await processDirectContent(decodedContent, url, env, corsHeaders);
      } catch (e) {
          return new Response(`Error processing Base64 content: ${e.message}`, {
          status: 400,
          headers: corsHeaders
        });
        }
      }
    }

    // 使用标准方法获取其他参数
    let nameFilter = url.searchParams.get('name');
    let typeFilter = url.searchParams.get('type');
    let templateUrl = url.searchParams.get('template');
    let templateContent = url.searchParams.get('template_content');
    let serverFilter = url.searchParams.get('server');

    // 测速功能相关参数
    let speedTest = url.searchParams.get('speed_test') === 'true';
    let speedTimeout = parseInt(url.searchParams.get('timeout')) || 5000;
    let maxLatency = parseInt(url.searchParams.get('max_latency')) || 1000;
    let concurrentTests = parseInt(url.searchParams.get('concurrent_tests')) || 5;

    // 验证测速参数范围
    speedTimeout = Math.max(1000, Math.min(speedTimeout, 30000));
    maxLatency = Math.max(100, Math.min(maxLatency, 10000));
    concurrentTests = Math.max(1, Math.min(concurrentTests, 10));

    // 如果未提供参数，尝试使用环境变量中的默认值
    if (!yamlUrlParam && env.DEFAULT_URL) {
      yamlUrlParam = env.DEFAULT_URL;
    }

    if (!nameFilter && env.DEFAULT_NAME_FILTER) {
      nameFilter = env.DEFAULT_NAME_FILTER;
    }

    if (!typeFilter && env.DEFAULT_TYPE_FILTER) {
      typeFilter = env.DEFAULT_TYPE_FILTER;
    }

    if (!templateUrl && env.DEFAULT_TEMPLATE_URL) {
      templateUrl = env.DEFAULT_TEMPLATE_URL;
    }

    if (!serverFilter && env.DEFAULT_SERVER_FILTER) {
      serverFilter = env.DEFAULT_SERVER_FILTER;
    }

    // 强制应用环境变量中的过滤器
    const forceNameFilter = env.FORCE_NAME_FILTER;
    const forceTypeFilter = env.FORCE_TYPE_FILTER;
    const forceServerFilter = env.FORCE_SERVER_FILTER;

    // 验证必要参数
    if (!yamlUrlParam) {
      return new Response('Error: Missing required parameter "url" or DEFAULT_URL environment variable', {
          status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    // 分割多URL参数（用逗号分隔）
    const yamlUrls = yamlUrlParam.split(',').map(u => u.trim()).filter(u => u);

    // 限制URL数量，避免过多处理
    if (yamlUrls.length > 100) {
      return new Response('Error: Too many URLs provided (maximum 100 allowed)', {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    try {
      // 合并配置结果
      let mergedProxies = [];
      let firstConfig = null;
      let templateConfig = null;
      let totalOriginalCount = 0;
      let sourceUrlInfo = [];

      // 定义缓存选项
      const cacheOptions = {
        useCache: true,
        cacheTTL: env.CACHE_TTL ? parseInt(env.CACHE_TTL) : DEFAULT_CACHE_TTL
      };

      // 优先使用内置默认模板
      if (DEFAULT_TEMPLATE) {
        templateConfig = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
        sourceUrlInfo.push(`使用内置默认模板`);
      }

      // 如果提供了模板URL，尝试获取模板配置
      if (templateUrl) {
        try {
          const templateResult = await fetchAndParseYaml(templateUrl, cacheOptions);
          if (templateResult.error) {
            sourceUrlInfo.push(`模板(${templateUrl}): 错误: ${templateResult.error}`);
          } else if (templateResult.config) {
            templateConfig = templateResult.config;
            sourceUrlInfo.push(`模板(${templateUrl}): 成功加载`);
          }
        } catch (templateError) {
          sourceUrlInfo.push(`模板(${templateUrl}): 错误: ${templateError.message}`);
        }
      }

      // 并行处理所有URL
      const configPromises = yamlUrls.map(yamlUrl =>
        fetchAndParseYaml(yamlUrl, cacheOptions)
          .then(result => ({ yamlUrl, ...result }))
          .catch(e => ({ yamlUrl, error: e.message }))
      );

      // 等待所有请求完成
      const results = await Promise.all(configPromises);

      // 处理所有结果
      for (const result of results) {
        const { yamlUrl, config, error } = result;

        if (error) {
          sourceUrlInfo.push(`${yamlUrl} (错误: ${error})`);
          continue;
        }

        // 初始化第一个有效配置作为基础配置
        if (!firstConfig && config) {
          firstConfig = config;
        }

        // 添加代理到合并列表
        if (config && config.proxies && Array.isArray(config.proxies)) {
          totalOriginalCount += config.proxies.length;
          mergedProxies = [...mergedProxies, ...config.proxies];
          sourceUrlInfo.push(`${yamlUrl} (${config.proxies.length}个节点)`);

          // 限制处理节点数量
          if (totalOriginalCount > 100000) {
            return new Response('Error: Too many proxies to process (limit: 100000)', {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'text/plain; charset=utf-8'
              }
            });
          }
        }
      }

      // 验证是否有有效的配置或模板
      if (!firstConfig && !templateConfig) {
        return new Response('Error: No valid configuration found from the provided URLs or template', {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain; charset=utf-8'
          }
        });
      }

      // 优先使用模板配置
      if (templateConfig) {
        firstConfig = templateConfig;
      }

      // 验证是否有代理节点
      if (mergedProxies.length === 0) {
        return new Response('Error: No proxies found in the configurations', {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain; charset=utf-8'
          }
        });
      }

      // 节点去重
      const beforeDedupeCount = mergedProxies.length;
      mergedProxies = deduplicateProxies(mergedProxies);
      const afterDedupeCount = mergedProxies.length;
      const duplicateCount = beforeDedupeCount - afterDedupeCount;

      // 验证和修复节点
      const beforeValidateCount = mergedProxies.length;
      mergedProxies = validateProxies(mergedProxies);
      const afterValidateCount = mergedProxies.length;
      const invalidCount = beforeValidateCount - afterValidateCount;

      // 构建有效的过滤器
      const effectiveNameFilter = combineFilters(nameFilter, forceNameFilter);
      const effectiveTypeFilter = combineFilters(typeFilter, forceTypeFilter);
      const effectiveServerFilter = combineFilters(serverFilter, forceServerFilter);

      // 过滤节点
      let filteredProxies = filterProxies(
        mergedProxies,
        effectiveNameFilter,
        effectiveTypeFilter,
        effectiveServerFilter
      );

      // 重命名节点
      filteredProxies = renameProxies(filteredProxies, nameFilter);

      // 记录过滤后节点数量
      const filteredCount = filteredProxies.length;

      // 测速功能处理
      let speedTestStats = null;
      let speedFilterStats = null;
      if (speedTest && filteredProxies.length > 0) {
        console.log(`启用测速功能，准备测试${filteredProxies.length}个节点`);

        try {
          // 执行批量测速
          const speedTestResult = await batchSpeedTest(filteredProxies, {
            timeout: speedTimeout,
            concurrentTests: concurrentTests,
            useCache: true
          });

          speedTestStats = speedTestResult.stats;

          // 根据延迟过滤节点
          const filterResult = filterByLatency(speedTestResult.results, maxLatency);
          filteredProxies = filterResult.filteredProxies;
          speedFilterStats = filterResult.filterStats;

          console.log(`测速完成，最终保留${filteredProxies.length}个节点`);

        } catch (speedError) {
          console.error('测速过程出错:', speedError);
          // 测速失败不影响主功能，继续使用原有节点
        }
      }

      // 创建新的配置
      const filteredConfig = {...firstConfig, proxies: filteredProxies};

      // 如果有 proxy-groups，更新它们
      if (firstConfig['proxy-groups'] && Array.isArray(firstConfig['proxy-groups'])) {
        filteredConfig['proxy-groups'] = updateProxyGroups(
          firstConfig['proxy-groups'],
          filteredProxies.map(p => p.name)
        );
      }

      // 添加过滤信息作为注释
      let filterInfo = `# 原始节点总计: ${totalOriginalCount}, 去重后: ${afterDedupeCount} (移除了${duplicateCount}个重复节点), 无效节点: ${invalidCount}, 过滤后节点: ${filteredCount}\n` +
                       `# 名称过滤: ${nameFilter || '无'} ${forceNameFilter ? '(强制: ' + forceNameFilter + ')' : ''}\n` +
                       `# 类型过滤: ${typeFilter || '无'} ${forceTypeFilter ? '(强制: ' + forceTypeFilter + ')' : ''}\n` +
                       `# 服务器类型过滤: ${serverFilter || '无'} ${forceServerFilter ? '(强制: ' + forceServerFilter + ')' : ''}\n`;

      // 添加测速信息
      if (speedTest && speedTestStats) {
        filterInfo += `# 测速功能: 已启用 (超时: ${speedTimeout}ms, 最大延迟: ${maxLatency}ms, 并发: ${concurrentTests})\n`;
        filterInfo += `# 测速统计: 总计${speedTestStats.total}个，成功${speedTestStats.successful}个，失败${speedTestStats.failed}个，超时${speedTestStats.timeout}个\n`;

        if (speedTestStats.successful > 0) {
          filterInfo += `# 延迟统计: 平均${speedTestStats.avgLatency}ms，最小${speedTestStats.minLatency}ms，最大${speedTestStats.maxLatency}ms\n`;
        }

        if (speedFilterStats) {
          filterInfo += `# 延迟过滤: 最终保留${speedFilterStats.filtered}个节点，移除${speedFilterStats.removed}个高延迟节点\n`;
        }
      } else if (speedTest) {
        filterInfo += `# 测速功能: 已启用但未执行 (节点数量为0或发生错误)\n`;
      }

      filterInfo += `# 生成时间: ${new Date().toISOString()}\n` +
                    `# 配置源: \n# ${sourceUrlInfo.join('\n# ')}\n`;

      // 生成 YAML 并返回
      const yamlString = filterInfo + yaml.dump(filteredConfig);

      // 清理过期缓存
      if (Math.random() < 0.1) {
        cleanupCache();
      }

      return new Response(yamlString, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/yaml; charset=utf-8'
        }
      });
    } catch (error) {
      console.error(`处理错误: ${error.message}`, error.stack);

      const errorMessage = `Error: ${error.message}\n\nStack: ${error.stack || 'No stack trace'}\n`;
      return new Response(errorMessage, {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }
  }
};

// ==================== 辅助函数 ====================

/**
 * 获取并解析 YAML 配置
 */
async function fetchAndParseYaml(yamlUrl, options = {}) {
  const useCache = options.useCache !== false;
  const cacheTTL = options.cacheTTL || DEFAULT_CACHE_TTL;

  // 检查缓存
  if (useCache) {
    const cacheKey = getCacheKey(yamlUrl, { type: 'yaml' });
    const cachedResult = getCachedData(cacheKey);
    if (cachedResult) {
      console.log(`使用缓存的配置: ${yamlUrl}`);
      return cachedResult;
    }
  }

  try {
    console.log(`获取配置: ${yamlUrl}`);

    const response = await fetch(yamlUrl, {
      headers: {
        'User-Agent': 'ProxyFilter/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const content = await response.text();

    if (!content || content.trim().length === 0) {
      throw new Error('Empty response content');
    }

    // 预处理内容
    const processedContent = preprocessYamlContent(content);

    // 解析YAML
    const config = yaml.load(processedContent);

    if (!config || typeof config !== 'object') {
      throw new Error('Invalid YAML format');
    }

    const result = { config, error: null };

    // 缓存结果
    if (useCache) {
      const cacheKey = getCacheKey(yamlUrl, { type: 'yaml' });
      setCachedData(cacheKey, result, cacheTTL);
    }

    return result;

  } catch (error) {
    console.error(`获取配置失败: ${yamlUrl}, 错误: ${error.message}`);
    const result = { config: null, error: error.message };

    // 缓存错误结果（较短时间）
    if (useCache) {
      const cacheKey = getCacheKey(yamlUrl, { type: 'yaml' });
      setCachedData(cacheKey, result, 300); // 5分钟
    }

    return result;
  }
}

/**
 * 去重代理节点
 */
function deduplicateProxies(proxies) {
  if (!proxies || !Array.isArray(proxies)) {
    return [];
  }

  const seen = new Set();
  const uniqueProxies = [];

  for (const proxy of proxies) {
    if (!proxy || typeof proxy !== 'object') {
      continue;
    }

    let uniqueKey;

    // 根据代理类型生成唯一标识
    if (proxy.type === 'ss') {
      uniqueKey = `${proxy.type}:${proxy.server}:${proxy.port}:${proxy.cipher}:${proxy.password}`;
    } else if (proxy.type === 'ssr') {
      uniqueKey = `${proxy.type}:${proxy.server}:${proxy.port}:${proxy.cipher}:${proxy.protocol}:${proxy.obfs}`;
    } else if (proxy.type === 'vmess') {
      uniqueKey = `${proxy.type}:${proxy.server}:${proxy.port}:${proxy.uuid}:${proxy.alterId || 0}`;
    } else if (proxy.type === 'trojan') {
      uniqueKey = `${proxy.type}:${proxy.server}:${proxy.port}:${proxy.password}`;
    } else {
      const { name, ...config } = proxy;
      uniqueKey = JSON.stringify(config);
    }

    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      uniqueProxies.push(proxy);
    }
  }

  return uniqueProxies;
}

/**
 * 验证代理节点
 */
function validateProxies(proxies) {
  if (!proxies || !Array.isArray(proxies)) {
    return [];
  }

  const validProxies = [];

  for (const proxy of proxies) {
    try {
      // 检查必要字段
      if (!proxy.name || !proxy.server || !proxy.type) {
        continue;
      }

      // 检查端口
      if (proxy.port) {
        const portNum = parseInt(proxy.port, 10);
        if (isNaN(portNum) || portNum <= 0 || portNum >= 65536) {
          continue;
        }
        proxy.port = portNum;
      } else {
        continue;
      }

      // 根据类型验证
      switch (proxy.type) {
        case 'ss':
          if (!proxy.cipher || !proxy.password) continue;
          break;
        case 'vmess':
          if (!proxy.uuid) continue;
          if (proxy.alterId === undefined) proxy.alterId = 0;
          break;
        case 'trojan':
          if (!proxy.password) continue;
          break;
        case 'ssr':
          if (!proxy.cipher || !proxy.password || !proxy.protocol || !proxy.obfs) continue;
          break;
      }

      validProxies.push(proxy);

    } catch (error) {
      console.warn(`验证节点失败: ${error.message}`);
    }
  }

  return validProxies;
}

/**
 * 结合两个过滤器
 */
function combineFilters(userFilter, forceFilter) {
  if (!userFilter && !forceFilter) return null;
  if (!userFilter) return forceFilter;
  if (!forceFilter) return userFilter;

  return `(?=${userFilter})(?=${forceFilter})`;
}

/**
 * 过滤代理节点
 */
function filterProxies(proxies, nameFilter, typeFilter, serverFilter) {
  return proxies.filter(proxy => {
    let nameMatch = true;
    let typeMatch = true;
    let serverMatch = true;

    if (nameFilter && proxy.name) {
      try {
        const nameRegex = new RegExp(nameFilter);
        nameMatch = nameRegex.test(proxy.name);
      } catch (error) {
        nameMatch = true;
      }
    }

    if (typeFilter && proxy.type) {
      try {
        const typeRegex = new RegExp(typeFilter);
        typeMatch = typeRegex.test(proxy.type);
      } catch (error) {
        typeMatch = true;
      }
    }

    if (serverFilter && proxy.server) {
      if (serverFilter === 'domain') {
        serverMatch = isDomainName(proxy.server);
      } else if (serverFilter === 'ip') {
        serverMatch = isIPAddress(proxy.server);
      } else {
        try {
          const serverRegex = new RegExp(serverFilter);
          serverMatch = serverRegex.test(proxy.server);
        } catch (error) {
          serverMatch = true;
        }
      }
    }

    return nameMatch && typeMatch && serverMatch;
  });
}

/**
 * 重命名代理节点
 */
function renameProxies(proxies, nameFilter) {
  const regionCounts = {};

  return proxies.map(proxy => {
    // 简单的区域识别
    let region = '节点';
    const nodeName = proxy.name || '';

    if (nodeName.includes('香港') || nodeName.includes('HK') || nodeName.includes('Hong Kong')) {
      region = '香港';
    } else if (nodeName.includes('台湾') || nodeName.includes('TW') || nodeName.includes('Taiwan')) {
      region = '台湾';
    } else if (nodeName.includes('日本') || nodeName.includes('JP') || nodeName.includes('Japan')) {
      region = '日本';
    } else if (nodeName.includes('韩国') || nodeName.includes('KR') || nodeName.includes('Korea')) {
      region = '韩国';
    } else if (nodeName.includes('新加坡') || nodeName.includes('SG') || nodeName.includes('Singapore')) {
      region = '新加坡';
    } else if (nodeName.includes('美国') || nodeName.includes('US') || nodeName.includes('USA')) {
      region = '美国';
    } else if (nodeName.includes('英国') || nodeName.includes('UK') || nodeName.includes('Britain')) {
      region = '英国';
    }

    regionCounts[region] = (regionCounts[region] || 0) + 1;

    return {
      ...proxy,
      name: `${region}_${regionCounts[region]}`
    };
  });
}

/**
 * 更新代理组
 */
function updateProxyGroups(proxyGroups, validProxyNames) {
  if (!proxyGroups || !Array.isArray(proxyGroups)) {
    return proxyGroups;
  }

  if (!validProxyNames || validProxyNames.length === 0) {
    return proxyGroups.map(group => ({
      ...group,
      proxies: ['DIRECT']
    }));
  }

  return proxyGroups.map(group => {
    if (!group.proxies || !Array.isArray(group.proxies)) {
      return {
        ...group,
        proxies: ['DIRECT', ...validProxyNames]
      };
    }

    const specialNodes = group.proxies.filter(name =>
      name === 'DIRECT' || name === 'REJECT' || name === 'GLOBAL' ||
      proxyGroups.some(g => g.name === name)
    );

    if (group.type === 'select') {
      return {
        ...group,
        proxies: [...specialNodes, ...validProxyNames]
      };
    } else if (['url-test', 'fallback', 'load-balance'].includes(group.type)) {
      return {
        ...group,
        proxies: validProxyNames.length > 0 ? validProxyNames : ['DIRECT']
      };
    } else {
      const validProxies = group.proxies.filter(name =>
        validProxyNames.includes(name) ||
        specialNodes.includes(name)
      );

      return {
        ...group,
        proxies: validProxies.length > 0 ? validProxies : ['DIRECT']
      };
    }
  });
}

/**
 * 判断是否为IP地址
 */
function isIPAddress(str) {
  if (!str) return false;

  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = str.match(ipv4Pattern);

  if (!match) return false;

  for (let i = 1; i <= 4; i++) {
    const part = parseInt(match[i]);
    if (part < 0 || part > 255) {
      return false;
    }
  }

  return true;
}

/**
 * 判断是否为域名
 */
function isDomainName(str) {
  if (!str) return false;

  if (isIPAddress(str)) return false;

  if (str === 'localhost' || str.startsWith('127.') || str === '0.0.0.0') {
    return false;
  }

  if (!str.includes('.') || /\s/.test(str)) {
    return false;
  }

  const looseDomainPattern = /^([a-zA-Z0-9_]([a-zA-Z0-9\-_]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9\-]{1,}$/;
  const isPotentialDomain = str.length > 3 && str.length < 255 &&
                          str.includes('.') &&
                          !/[\s,!@#$%^&*()+={}\[\]:;"'<>?\/\\|]/.test(str);

  return looseDomainPattern.test(str) || isPotentialDomain;
}

/**
 * 预处理YAML内容
 */
function preprocessYamlContent(content) {
  if (!content) return content;

  // 检查是否包含HTML标签
  if (content.includes('<html') || content.includes('<!DOCTYPE') ||
      content.includes('<head') || content.includes('<body')) {
    console.warn("检测到HTML内容，尝试提取YAML");

    const preMatch = content.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
    if (preMatch && preMatch[1]) {
      content = preMatch[1];
    } else {
      const lines = content.split(/\r?\n/);
      let yamlStartIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^\s*[a-zA-Z0-9_-]+\s*:\s*.+$/)) {
          yamlStartIndex = i;
          break;
        }
      }

      if (yamlStartIndex >= 0) {
        content = lines.slice(yamlStartIndex).join('\n');
      } else {
        return "proxies: []";
      }
    }

    content = content.replace(/<[^>]*>/g, '');
    content = content.replace(/&[a-z]+;/g, ' ');
  }

  // 移除特殊标签
  content = content.replace(/!<str>\s+/g, '');
  content = content.replace(/!\s+/g, '');
  content = content.replace(/!<[^>]+>\s+/g, '');

  // 处理转义和格式
  content = content.replace(/\\"/g, '"');
  content = content.replace(/\t/g, '  ');
  content = content.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  return content;
}
