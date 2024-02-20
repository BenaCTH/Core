# Service Worker

https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

## 是什么？

-   Service Worker (以下简写为SW) 是一个注册在指定源和路径下的事件驱动worker，独立于浏览器主线程，通过 js 语法编写但不会阻塞正常的 js 脚本，要求内部所有的方法都是异步方法。
-   与普通 js 脚本却别是他们的运行容器不同，worker 中的全局API对象仅有self，指向注册过的SW container, 无法调用常见的window、document等API。
-   Service Worker 是一个浏览器中的进程而不是浏览器内核下的线程，因此它在被注册安装之后，能够在多个页面tab中使用，也不会因为页面的关闭而被销毁。
-   Service Worker 要求安全的 HTTPS ，但为了开发调试方便，localhost(包括127.0.0.1) 亦支持。
-   Service Worker 脚本缓存规则与一般脚本不同。如果设置了强缓存，并且 max-age 设置小于 24h，那么与普通 http 缓存无异，但是如果 max-age 大于 24 小时，那么 service worker 文件在 24h 之后强制更新。

## Service Worker 能做什么？

-   能够拦截全局的 fetch 事件，能在独立进程运行。
-   可以缓存静态资源，离线缓存，后台同步等。

## Service Workers 离线操作

新建一个项目 serviceWorkerLifecycleDemo，项目目录结构如下：
```bash
.
└── serviceWorkerLifecycleDemo/
├── {Any_static_source}
├── index.html
└── sw.js
```

注册Service Worker，如果浏览器支持 `Service Workers API`，则使用 `ServiceWorkerContainer.register()` 方法在该站点注册。其内容在 `sw.js` 文件中，可以在注册成功后执行。其他关于 Service Worker 的内容都写在 sw.js 文件中。

```html
<!DOCTYPE html>
  <head>
    <title>Service Worker Lifecycle Demo</title>
    <link rel="stylesheet" src="/a-static-source/xxx.css" />
  </head>
  <body>
    <img src="/a-static-source/xxx.png" />
    <script src="/a-static-source/xxx.js" />
    <script>
      if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js');
      }
    </script>
  </body>
</html>
```

注册完成后，sw.js 文件会自动下载、安装，然后激活。

```javascript
console.log('service worker 注册成功')

self.addEventListener('install', () => {
  // 安装回调的逻辑处理
  console.log('service worker 安装成功')
})

self.addEventListener('activate', () => {
  // 激活回调的逻辑处理
  console.log('service worker 激活成功')
})

self.addEventListener('fetch', event => {
  console.log('service worker 抓取请求成功: ' + event.request.url)
})
```

## Service Worker 工作原理

<img src="../pic/sw/service_worker_lifecycle.png"/>

-   在成功注册 Service Worker 之后，开始下载并解析执行 `sw.js` 文件，执行过程中开始安装 Service Worker，在此过程中会触发 worker 进程的 `install` 事件。

-   如果 install 事件回调成功执行（在 install 回调中通常会做一些缓存读写的工作，可能会存在失败的情况），则开始激活 Service Worker，在此过程中会触发 worker 进程的 `activate` 事件，如果 install 事件回调执行失败，则生命周期进入 Error 终结状态，终止生命周期。

-   完成激活之后，Service Worker 就能够控制作用域下的页面的资源请求，可以监听 `fetch` 事件。

-   如果在激活后 Service Worker 被 `unregister` 或者有新的 Service Worker 版本更新，则当前 Service Worker 生命周期完结，进入 Terminated 终结状态。

## Debug

### Chrome DevTool

使用 Chrome 浏览器，可以通过进入控制台 Application -> Service Workers 面板查看和调试。其效果如下图所示.
<img src="../pic/sw/chrome_devtool.png" src="chrome Service Worker debug"/>

为了更熟练的运用 Chrome Devtools 调试 Service Worker，首先需要熟悉以下这些选项：

-   Offline： 将 DevTools 切换至离线模式。它等同于 Network 窗格中的离线模式。

-   Update on reload：强制 Service Worker 线程在每次页面加载时更新。

-   Bypass for network：绕过 Service Worker 线程并强制浏览器转至网络寻找请求的资源。

-   Update：对指定的 Service Worker 线程执行一次性更新。

-   Push：在没有负载的情况下模拟推送通知。

-   Sync：模拟后台同步事件。

-   Unregister：注销指定的 Service Worker 线程。

### 查看 Service Worker 缓存内容

<img src="../pic/sw/cache_storage.png" src="chrome cache storage" />

## Workbox 待更新

一组 JavaScript 库，用于向 Web 应用添加离线支持。
https://developer.chrome.com/docs/workbox/

## 最佳实践 待更新

确定用户希望在离线使用哪些功能，然后对其添加离线适配，此外，可以使用 IndexedDB 来存储和检索数据，还可以使用后台同步来允许执行操作和延迟服务器通信，直到再次建立稳定的链接。还可以使用 Service worker 来存储其他类型的内容，静态资源（如供离线时使用的图片、音视频、脚本、样式等），动态资源(API请求等)。
