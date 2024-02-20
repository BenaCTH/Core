# 1 背景

此文档旨在为前端开发人员制定HTML和CSS代码书写规范。通过此规范来提高编码质量、改善协作、降低维护成本。

* 本规范适用于HTML文件，及HTML模板文件(如cshtml等)，其他JS扩展如JSX等见对应的React等的规范文档。
* 本规范适用于CSS文件，及其他CSS原始格式文件，如LESS、SASS等。
* 本文中除特殊注明外，CSS即指CSS及其他CSS原始格式。


# 2 概要


## 2.1 通用资源规则 

### 2.1.1 资源协议

尽可能用HTTPS引入资源。

推荐使用HTTPS引入图片、媒体、样式表、JS等资源或资源文件。


## 2.2 通用格式规则 

### 2.2.1 编码缩进

使用缩进时，将制表符转换为2个空格，每个缩进使用一个制表符，或直接输入2个空格。

不要使用制表符和空格混合用于缩进。
```
<!-- Recommended -->
<ul>
  <li>Fantastic</li>
  <li>Great</li>
</ul>
```
```
/* Recommended */
.example {
  color: blue;
}

@media screen {
  html {
    background: #fff;
    color: #444;
  }
}
```

### 2.2.2 大小写

所有代码都应小写，这适用于：
* HTML元素名称
* HTML属性
* HTML属性值(推荐使用小写，根据实际情况可使用大写)
* CSS选择器
* CSS属性名
* CSS属性值(字符串除外)
```
<!-- Not recommended -->
<A HREF="/">Home</A>
```
```
<!-- Recommended -->
<img src="edit.png" alt="Edit">
```

```
/* Not recommended */
color: #E5E5E5;
```
```
/* Recommended */
color: #e5e5e5;
```

### 2.2.3 后续空格

删除尾随空格。
结尾部分的空格是不必要的，并且会使差异变得复杂。
```
<!-- Not recommended -->
<p>What?{space(s)}</p>
```
```
<!-- Recommended -->
<p>Yes please.</p>
```


## 2.3 通用Meta规则

### 2.3.1 编码

使用UTF-8（不用BOM）。

确保编辑器使用UTF-8作为字符编码，没有byte order mark(BOM)。

通过<meta charset="utf-8">指定HTML文档中的编码。无需指定CSS文档的编码，因为它们默认使用UTF-8。

有关编码以及如何指定编码的更多信息，请参见[处理HTML和CSS中的字符编码](https://www.w3.org/International/tutorials/tutorial-char-enc/)。

### 2.3.2 注释

为有需要或复杂的代码添加注释。

在较复杂的内容，或难以理解的部分添加注释，如HTML结构、用途，CSS样式层叠、优先级等。

### 2.3.3 待办

在注释中用TODO标记存在未完成的内容，格式：TODO(UserName): ActionItem

在括号中附加联系人(用户名或邮件)(列表)，在冒号后面添加将要完成的内容。
```
<!-- TODO(john.doe): remove optional tags -->
<ul>
  <li>Apples</li>
  <li>Oranges</li>
</ul>
```


# 3 HTML


## 3.1 HTML基础规则

### 3.1.1 文档类型

推荐使用HMTL5来声明文档类型：<!DOCTYPE html >。
特殊情况下允许使用其他规则，如XHTML等。

### 3.1.2 语义

根据它的用途正确地使用HTML标签。

例如，标题使用heading类元素，段落使用p元素，锚点使用a元素，等等。

根据其目的使用正确的HTML元素对于可访问性、重用和代码效率非常重要。
```
<!-- Not recommended -->
<div onclick="goToRecommendations();">All recommendations</div>
<div class="button">Action</div>
```
```
<!-- Recommended -->
<a href="recommendations/">All recommendations</a>
<button>Action</button>
```

### 3.1.3 多媒体的替代内容

为多媒体提供替代内容。

对于多媒体，如图像、音视频、通过canvas生成的动画对象，提供可选的访问方式。例如为图像提供替代文本内容(alt)、为音视频尽可能地提供字幕。

对于上下文无关的媒体，如装饰类图片等，可以不提供此内容。
```
<!-- Not recommended -->
<img src="spreadsheet.png">
```
```
<!-- Recommended -->
<img src="spreadsheet.png" alt="Spreadsheet screenshot.">
```

### 3.1.4 结构分离

将结构、表示和行为分开。

严格地分离结构(标记)、表示(样式)和行为(脚本)，并尽量将三者之间的交互减至最少。

* 确保文档和模板只包含HTML，并且HTML只用于结构目的。
* 将所有样式的内容移到样式表中（style sheets）。
* 将所有行为的内容移到脚本(scripts)中。

尽量将样式和脚本放置于单独的文件中，而不是在HTML中直接书写。

尽可能地减少在HTML元素上添加style属性来设置样式，推荐通过class名进行样式控制。
```
<!-- Not recommended -->
<style>
  .invalid{font-size: 16px}
</style>
<div class="invalid" style="color: red">invalid</div>
```
```
<!-- Recommended -->
//css
.invalid{font-size: 16px}
.invalid-error{color: red}

//html
<div class="invalid invalid-error">invalid</div>
```

### 3.1.5 实体引用

不推荐使用实体引用。

大多数情况下，不需要像这样使用实体引用，如&mdash, &rdquo or &#x263a。一般情况下，编辑器和开发者都默认使用 utf-8 作为编码格式。

例外的情况，如下：
* HTML中具有特殊含义的字符(如<和&)。
* 控制字符。
* “不可见”字符(如无间断空格)。
```
<!-- Not recommended -->
The currency symbol for the Euro is &ldquo;&eur;&rdquo;.
```
```
<!-- Recommended -->
The currency symbol for the Euro is “€”.
```

### 3.1.6 可选的标签

不推荐省略可选的标签，即使它是[HTML5规范](https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-omission)的一部分。

推荐严格按照XHTML规范，单标签自我关闭，成对标签不能省略结束标记，其他可选标签也不进行省略。

对于table，尽量不忽略thead、tbody标签，即使只有其中之一。
```
<!-- Not Recommended -->
<!DOCTYPE html>
<title>Saving money, saving bytes</title>
<p>Qed<br>Sic.
```
```
<!-- recommended -->
<!DOCTYPE html>
<html>
  <head>
    <title>Spending money, spending bytes</title>
  </head>
  <body>
    <p>Sic<br />Sic.</p>
  </body>
</html>
```
```
<!-- Not Recommended -->
<table>
  <tr>
    <td>test</td>
  </tr>
</table>
```
```
<!-- recommended -->
<table>
  <tbody>
    <tr>
      <td>test</td>
    </tr>
  </tbody>
</table>
```

### 3.1.7 type属性

省略样式表和脚本的type属性。

HTML5对link:stylesheet及script有着默认的type设置，即text/css和text/javascript,所以一般情况下不需要重复地添加type属性。

但是对于其他的格式，则必须添加type属性。
```
<!-- Not recommended -->
<link rel="stylesheet" href="*****.css" type="text/css">
<script src="*****.js" type="text/javascript"></script>

<!-- Recommended -->
<link rel="stylesheet" href="*****.css">
<script src="*****.js"></script>
<script src="*****.js" type="text/babel"></script>
```

### 3.1.8 自定义属性

HTML自定义属性仅允许`data-*`，Accessibility相关内容可以使用`aria-*`。

禁止直接使用自定义属性作为属性名。

## 3.2 HTML格式规则

### 3.2.1 通用格式

对每个块元素、list或table元素使用新的一行，并对其子元素进行缩进。

对行内元素，则在一行内书写即可，如果内容较长，也可以适当进行换行处理。
```
<!-- Recommended -->
<ul>
  <li>Moe</li>
  <li>Larry</li>
  <li>Curly</li>
</ul>
```
```
<!-- Recommended -->
<table>
  <thead>
    <tr>
      <th scope="col">Income</th>
      <th scope="col">Taxes</th>
  </thead>
  <tbody>
    <tr>
      <td>$ 5.00</td>
      <td>$ 4.50</td>
    </tr>
  </tbody>
</table>
```
```
<!-- Recommended -->
<blockquote>
  <p><em>Space</em>, the final frontier.</p>
</blockquote>
```

### 3.2.2 HTML自动换行

当一行代码过长时，推荐进行换行处理。

可以在适当位置直接截取换行，也可以所有属性独占一行并进行缩进。
```
<!-- Recommended -->
<md-progress-circular md-mode="indeterminate" class="md-accent"
  ng-show="ctrl.loading" md-diameter="35">
</md-progress-circular>
```
```
<!-- Recommended -->
<md-progress-circular
  md-mode="indeterminate"
  class="md-accent"
  ng-show="ctrl.loading"
  md-diameter="35"
>
  <span></span>
</md-progress-circular>
```

### 3.2.3 HTML引号

在引用属性值时，使用双引号 `"` 而不是单引号 `'` 。
```
<!-- Not recommended -->
<a class='maia-button maia-button-secondary'>Sign in</a>
```
```
<!-- Recommended -->
<a class="maia-button maia-button-secondary">Sign in</a>
```


# 4 CSS


## 4.1 CSS样式规则

### 4.1.1 id和Class命名

使用规范的id和class名字，尽量做到简短且见名知意，常见命名方式：
* 使用通用命名。
* 使用其功能命名。
* 使用其样式命名。
* 使用以上方式进行组合。

更多命名规则，参考附录中的[命名规范](#01)章节。
```
/* Recommended: specific */
#gallery {}
.video {}
.button-disabled {}
```

### 4.1.2 id和Class样式

使用class来实现样式。

尽量不使用id来设置样式，或仅通过id来限制样式作用域。
```
/* Not recommended */
#navigation {}
```
```
/* Recommended */
.navigation {}
#navigation .nav {}
```

### 4.1.3 选择器

减少使用元素选择器。

尽量通过class选择器来设置样式，减少直接或组合使用元素选择器。

选择器的嵌套层数不得大于4层。
```
/* Not recommended */
#example ul {}
div.error {}
#home .navbar .nav .list .item {}
```
```
/* Recommended */
#example .ul {}
.error {}
#home .item {}
#home .navbar > .nav {}
```

### 4.1.4 简写属性

尽可能使用简写属性。
CSS提供了很多[简写属性](https://drafts.csswg.org/css-cascade-4/#shorthand-property)，如字体、margin等，应该尽可能使用它们。

```
/* Not recommended */
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;
```
```
/* Recommended */
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```

### 4.1.5 单位

在 `0` 值之后省略单位，要求必须使用的除外。

CSS属性值推荐使用的单位如下：
* 无单位：部分属性需要(允许)设置无单位值，如opacity、line-height等。
* 绝对长度单位，一般使用px和pt(可能用于打印)。
* 相对长度单位：<ul>
  * em、rem：相对字号尺寸。
  * vh、vw、vmin、vmax：相对视窗的尺寸。
  * 百分比：多达数情况相对于父元素的显示值，常用于宽度。
</ul>

```
/* Recommended */
flex: 0px; /* This flex-basis component requires a unit. */
flex: 1 1 0px; /* Not ambiguous without the unit, but needed in IE11. */

font-size: 1rem;
width: 80%;
height: 50vh;
padding: 1em;
border: 0;
```

### 4.1.6 小数点之前的0

不要省略值中的前导 `0`。
```
/* Recommended */
font-size: 0.8em;
```

### 4.1.7 十六进制表示法

尽可能使用3个字符的十六进制表示法，一般常用于表示颜色。

对于适合的颜色值，3个字符的十六进制表示法更短、更简洁。

对于颜色值的使用，详见附录中的[颜色值](#02)。
```
/* Not recommended */
color: #eebbcc;
```
```
/* Recommended */
color: #ebc;
```

### 4.1.8 前缀

对于common组件样式，推荐在class名前添加合适的前缀。

优点如下：
* 防止命名冲突。
* 限制其作用域。
* 实现类似命名空间的功能，便于管理维护。

```
/* Recommended */
.aui-combobox {}
.sa-navbar {}
```

### 4.1.9 优先级

* 尽量通过使用一个class来声明样式。
* 规模较大的project，可以使用"#模块 .样式"两级进行声明。
* 尽可能不要使用 !important。

### 4.1.10 Hack

避免使用CSS hack来处理浏览器间的兼容问题。

推荐使用该浏览器的私有CSS属性，或使用某种特性的媒体查询来解决浏览器兼容问题。


## 4.2 CSS格式规则

### 4.2.1 声明块格式

* 选择器与声明块的起始大括号应在一行。
* 选择器结尾和声明块之间使用空格。
* 声明块之间添加空行

```
/* Not recommended: missing space */
#video{
  margin-top: 1em;
}

/* Not recommended: unnecessary line break */
#video
{
  margin-top: 1em;
}
#audio{
  margin: 0 5px;
}
```
```
/* Recommended */
#video {
  margin-top: 1em;
}

#audio{
  margin: 0 5px;
}
```

### 4.2.2 规则格式

* 每个CSS属性应独占一行。
* 每个属性值必须以 `;` 结尾。
* 属性名和属性值之间使用"冒号+空格"

```
/* Not recommended */
h3 {
  width:100%;height:200px;
  margin:5px;
  padding:0
}
```
```
/* Recommended */
h3 {
  width: 100%;
  height: 200px;
  margin: 5px;
  padding: 0;
}
```

### 4.2.3 规则顺序

样式规则按照如下顺序进行声明：
1. 直接影响布局及渲染顺序的，如display、flex、float、position、overflow等。
1. 尺寸及盒模型属性，如：宽高、padding、border等。
1. 文本属性，如：font、align、word-break等。
1. 装饰属性，如：background、color、opacity、animate、transition等。
1. 其他属性，如：shadow、radius、transform等。

### 4.2.4 浏览器私有前缀

通过使用浏览器私有前缀属性时，按照IE,FF,Webkit,Standard的顺序进行书写。
```
<!-- Recommended -->
.nav{
  /*IE*/
  -ms-user-select: none;
  /*FF*/
  -moz-user-select: none;
  /*Webkit*/
  -webkit-user-select: none;
  /*Standard*/
  user-select: none;
}
```

### 4.2.5 样式降级

使用样式降级时，按照基础样式，扩展样式的顺序进行书写。
```
<!-- Recommended -->
.nav{
  /*基础样式*/
  position: fixed;
  /*支持sticky的浏览器*/
  position: sticky;
}
```

### 4.2.6 CSS引号

对于属性选择器和属性值，使用双引号 `"` ，而不是单引号 `'` 。

```
/* Not recommended */
html {
  font-family: 'open sans', arial, sans-serif;
}
```
```
/* Recommended */
.require::before {
  content: "*"
}

html {
  font-family: "open sans", arial, sans-serif;
}
```


# 0 附录
本文部分内容是从[Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)节选(翻译)的。

## 0.1 命名规范

### 0.1.1 命名原则

* 简明扼要(部分情况下，需要完整表述时，可以尽可能长)
* 见名知意
* 限制作用域
* 必须以字母开头(禁止使用类似uuid等以数字开头的)
* 不要盲目缩写单词
* 禁止使用拼音及缩写

### 0.1.2 命名格式

* 推荐使用 `-` 来分隔多个单词。
* 在名称较长或较难形容时，按照`块`，`元素`，`状态`顺序进行命名。

### 0.1.3 命名示例

* 通用名称，如：register、logo、vote。
* 块名称，如：container、section、list。
* 状态名称，如：disabled、readonly、active。
* 样式名称，如：text-left、icon-rect、font-large。

## 0.2 颜色值

### 0.2.1 Hex

推荐使用16进制格式表示颜色，例如#5fb554、#7a4。

由于浏览器兼容问题，强烈不推荐使用16进制带有透明色，如#5fb554d8。

### 0.2.2 RGB

可以使用rgb()、rgba()来表示颜色，如rgb(64,64,64)、rgba(26,80,178,0.4)。

推荐使用rgba来表示带有透明度的颜色。
