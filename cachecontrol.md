浏览器缓存
Cache-Control:位于响应头，告诉浏览器该资源应该如何缓存；
Cache-Control 的几种常见的配置：
	• max-age：设置强制缓存的时间，单位s。资源会缓存到本地
	• no-cache：设置不强制缓存，每次都去进行协商缓存，确定资源是否有变更，一般用在index.html。 资源会缓存到本地
	• no-store：不进行强制缓存和协商缓存，直接拉取最新的资源。资源不缓存到本地。
	• private：如果有这个字段 比如：Cache-Control: private, max-age=360000，意思：中间层（代理）或者说CDN 不缓存此资源，使CDN失效，每次只能访问源服务器
	• public：CDN可以缓存
如果服务端没有设置Cache-Control，理论上前端定好缓存策略后，需要推送给运维，运维按前端的要求去配置。
如果没有配置，浏览器有自己的优化策略，强制缓存；
 
启发式缓存
 
没有设置 Cache-Control，Expires。chorme浏览器具体策略：
第一次：协商缓存，询问服务端，资源是否改变，已改变则发起请求。没改变的话，304重定向，并根据响应头的date和last-modified计算出强制缓存的时间（类似强制设置 Cache-Control: max-age=xx）
	• xx 的值是： （date 减去 last-modified ）乘以 10% 
		○ date是创建HTTP报文的日期和时间（就是当前访问这个资源的时间）
第二次开始：就有强制缓存了，状态码为200
 
 缓存位置：
memory cache 和 disk cache 
	• memory cache 是从浏览器的内存空间（RAM）中存取缓存信息，因此读写速度更快，但生命周期更短；
	• disk cache 就是从磁盘中存取，读写速度较慢，属于持久化的缓存。
Chrome 究竟会在什么情况下使用 memory cache，什么情况下使用 disk cache 呢？
	• 我们可以打开一个新的tab页面，打开 "Network"，刷新一下，看到缓存的 .js 都是 "from memory"（.css 不会走 memory cache，都是 "from disk"）。
	• 现在我们关闭当前tab（或关闭浏览器），重新再打开之前的 tab 时，缓存的 .js 都是 "from disk" 了。
		○ 因为当 .js 等资源被加载时，浏览器会先将其放入 memory cache 中，而当此页面tab被关闭时，浏览器会将此页面的 memory cache 中的缓存文件转存到 disk cache 中持久化存储。
 
浏览器处理http cache的优先级
这里简单概括下顺序
	1. 先判断资源是否命中强缓存，命中则直接从disk里拿到资源；
	2. 如果没有命中强缓存，判断是否命中协商缓存，命中则走协商缓存；
	3. 如果命中了协商缓存，会发起请求，服务端根据Request Header里的If-None-Match（对应Etag）和If-Modified-Since（对应Last-Modified）判断资源是否过期，没过期则返回304状态码，浏览器依旧用disk里的资源。如果资源过期，则服务端会返回新的资源；
	4. 如果也没有命中协商缓存，则这个请求不走缓存策略，发起真实的请求，从服务端拿资源
如何制定最佳缓存策略
 
最好的标准是根据资源更改的频率制定
 	Html	Css 和 js	图片
频率	可能会频繁更改，需要每次都询问。	可能每月修改	几乎不变
Cache-Control	private, no-cache	Public, max-age=2592000 (一个月)	Public, max-age=31536000 (一年)，stale-while-revalidate=86400
使缓存失效	每次都要询问，确保最新	自动过期或改名字（hash值）	自动过期或改名字（hash值）
 
 Asp.ner core MVC 项目给js 文件添加版本号
需求：使用ASP.net Core Mvc开发公司内部web系统，给视图中js(css,image也可以)文件添加版本号避免缓存问题。
解决方法：利用Taghelper提供的标签（asp-append-version）可以实现。
备注：刷新页面js版本号不会变化，直到变动js内容变化，版本号才会变化。 
 
各种情况下Cache浏览器的默认行为
点击刷新按钮、页面右键重新加载、f5、ctrl+R 
	从html里引入的（如script,link,img等），或者从script文件动态引入的。他们的Initiator通常是一个html文件，或者script文件，这些资源还是会依照自己的规则，从强缓存开始判断；
	这种方式会在Request Header里添加Cache-Control:max-age=0，这是浏览器自己的行为;
 
 
硬性重新加载、Ctrl+f5、Ctrl+Shift+R、勾选Disable cache后点刷新
	这种方式，所有的资源（不论Initiator的值），都会跳过缓存判断，发起真实的请求，从服务端拿资源。但本地的缓存资源(如disk里的缓存)并没有删除。 这种方式会在Request Header里添加Cache-Control:no-cache和Pragma: no-cache，也是浏览器自己的行为
 
请求头里的Cache-Control影响的是当前这一次请求，响应头里的Cache-Control是告诉浏览器这样存储，下次依照这样来。影响的是下一次请求。
 
Request Header里Cache-Control的取值
Cache-Control:max-age=0
	这个值表示，这个请求按照协商缓存的规则走，一定会发出真实的请求。这里和响应头里的max-age=0有不同
Cache-Control:no-cache
	这个值一般会附带Pragma: no-cache，是为了兼容http1.0。表示这次请求不会读缓存资源，即便缓存没有过期，或者资源并没有修改，这样的请求不会有返回304的可能。这一点和响应头里的Cache-Control:no-cache是有区别的。
	Request Header里Cache-Control只有这两个值可取，设置其他的值无效，比如设置Cache-Control:no-store是没有用的，这一点要和响应头里的Cache-Control区分开。
	Request Header里的Cache-Control只有在浏览器刷新，硬性重新加载。这两种浏览器自己的行为中会被添加。如果是一个常规的，设置了协商缓存（响应头里Cache-Control:no-cache），和不缓存（响应头里Cache-Control:no-cache）的请求，它在正常的，通过上文方式1访问时，是不会在请求头里添加Cache-Control值的。
	 
 
系统级缓存机制设计：
 
	 
	https://juejin.cn/post/6960988505816186894
![image](https://github.com/BenaCTH/Core/assets/13990337/f89ab2d3-b49d-409c-8c92-688eca1000e0)
