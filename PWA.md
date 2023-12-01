Service worker 是什么
	1. Service Worker 是浏览器在后台独立于网页运行的，用js编写的脚本，不会被普通js 阻塞。
	2. 与普通js 脚本却别是他们的运行容器不用，worker中的全局对象变成了self, 普通js 中，window,document。
	3. Service Worker 是一个浏览器中的进程而不是浏览器内核下的线程，因此它在被注册安装之后，能够呗在多个页面中使用，也不会因为页面的关闭而被销毁。
	4. Service Worker 要求 HTTPS ，但为了开发调试方便，localhost 除外。
	5. Service Worker脚本缓存规则与一般脚本不同。如果设置了强缓存，并且max-age 设置小于24h，那么与普通http 缓存无异，但是如果max-age 大于24小时，那么service worker文件在24h 之后强制更新。
能做什么？
	1. 能够拦截全局的fetch 事件，能在后台运行
	2. 可以缓存静态资源，离线缓存，后台同步等。

Service Worker 如何通信？
Service Worker 挂载在navigation.serviceWorker.controller 上，所以可以通过controller 进行通信。
与web worker 的postMessage 类似，在service worker 中则是使用self.clients 来send 消息。注意：self.clients 能得到哪些clients 和scope 设备有关。
Service Worker 主要事件
	1. Install 安装时触发，参考生命周期installing，通常在这个时事件里缓存静态资源文件，存到cacheStorage里
	2. Activate 激活是触发，参考生命周期Activating，通常在这个事件里进行重置操作，例如处理旧实例缓存等，
	3. Fetch 浏览器发起http 请求时触发，通常在这个事件里匹配缓存。
	4. Push 推送通知时触发
	5. sync后台同步时触发
Service Worker 生命周期




区别Web Socket & Web Worker &  Service Worker
Web Socket  是一种网络通信协议，最大特点，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，属于服务器推送技术的一种。
	Web Socket 其他特点：
		a. 数据格式比较轻量，性能开销小，通信高效。
		b. 可以发送文本，可以发送二进制数据。
		c. 没有同源限制，客户端可以与任意服务器通信。
		d. 协议标识符ws(如果加密为wss)，服务器网址就是URL 如ws://example.com:80/some/path 
 使用场景：
社交订阅、体育实况更新、多媒体聊天、弹幕...... （心跳及重连机制）

Web Worker
  
JS是单线程的，如果要处理一些复杂的逻辑计算，又不耽误主线程的执行顺序且要减少耗时，则可以考虑使用多线程。web worker的实现过程就是一种多线程的机制。

特点：
	1. 允许主线程创建worker线程，将一些复杂的计算交给后者运行；
	2. 主线程运行的同时，worker线程在后台同步运行，两者互不干扰；
	3. worker线程一旦新建成功，就会始终运行，不会被主线程的活动(点击事件、表单提交)打断。

缺点：
	1. worker线程比较耗费资源，不应过度使用，一旦使用完成应关闭。
 
 使用场景：
计算量大的交互处理、预渲染、加密数据......
 
Service Worker
Service Worker是一种离线缓存技术，属于web worker的一种，是W3C在2014年5月提出的，其前身是Application Cache，因为Application Cache存在多种兼容问题，现在是已经废弃不用了。所以现在使用service worker可以实现web APP的一些离线缓存。

特征：
	1. 是浏览器在后台独立于网页运行的脚本；
	2. 可以拦截和处理网络请求，操作缓存；
	3. 不能直接访问/操作DOM；
	4. 需要时直接被唤醒，不需要时自动休眠；
	5. 一旦被安装则永久存活，除非手动卸载；
	6. 出于安全考虑，因为service worker很强大，可以改写响应和请求，所以必需使用HTTPS的环境来运行。
 
注意事项
service worker不支持xmlHttpRequest请求，支持Fetch请求；
	1. 使用service worker时避免http同时缓存service worker文件；
	2. service worker最大缓存时间为24小时。 




https://juejin.cn/post/7103498757945655309#heading-30
https://juejin.cn/post/6844903792522035208 谨慎处理 Service Worker 的更新
https://juejin.cn/post/7088741970696208414 ServiceWorker 缓存与 HTTP 缓存 
https://juejin.cn/post/6844904197150916615#heading-18  HTTP缓存和ServiceWorker离线缓存 
https://juejin.cn/post/6844903556470816781
https://web.dev/new-pwa-training/
https://web.dev/progressive-web-apps/
https://lavas-project.github.io/pwa-book/chapter05/1-fetch-event-management.html![Uploading image.png…]()
