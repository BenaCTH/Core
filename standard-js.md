# 1 背景

本文档是对JavaScript编码标准的完整定义，本规范适用于javascript源文件，不包含使用第三方库时的未编译源文件。针对使用第三方库的规范，参考对应的编码规范文档。

本文主要关注的是我们普遍遵守的硬性规则，并避免给出不明确可执行的建议。

## 1.1 术语

在本文中除特殊注明外，其他内容遵循:

1. 本风格指南在使用短语`must`(`必须`/`允许`)、`must not`(`禁止`/`不允许`)、`should`(`应该`)、`should not`(`不应该`)和`may`(`可以`/`推荐`)时使用[强调命令词](#01)术语，为了保证内容通顺并减少歧义，在使用时可能会混合使用中英文，会按照此`格式`进行突出标记。

## 1.2 指南

本文档中的示例代码不完全是规范性的。可能仅表示遵循当前规则及其他`must`、`must not`规则。


# 2 源文件

## 2.1 文件名 

文件名`必须`是小写的，`可以`包括字母、数字、下划线"_"、减号"-"，且`应该`以字母开头，`不允许`其他的标点符号，文件名的扩展名`应该`是.js，在使用一些第三方库时，`应该`使用其推荐的扩展名，如.jsx、.ts等(具体内容详见其对应的编码规范文档)。

## 2.2 文件编码

源文件是用UTF-8编码的，且不包含BOM。

## 2.3 特殊字符

### 2.3.1 常用特殊字符表达形式

* 转义字符
* 字符实体
* Latin-1字符(八进制或十六进制表示)
* Unicode字符(十六进制表示)

### 2.3.2 使用规范
1. 对于转义字符，尽量降低使用频率，如换行可以用ES6的模板字符串实现，必须使用时`应该`添加注释表示其实际内容。
1. 对于Latin-1和Unicode字符，如果字符本身具有可读性如©、€等，`推荐`使用字符实体直接表示。如果该字符不常用或字符实体不具有可读性，则`推荐`使用十六进制表示，并添加注释说明。


# 3 源文件结构

## 3.1 版权信息

一般情况下，每个文件的最上面，都是版权信息(如果有的话)。

## 3.2 模块拆分

JS的模块引入/导出，一般常用的方式包括：CommonJS、AMD、UMD、ESM。

* 对于不能使用ES6的，一般模块`推荐`使用CommonJS，使用方便，代码更直观。
* 公共模块`推荐`使用UMD，兼容性更好。
* 对于可以使用ES6的，`推荐`全部使用ESM，即import/export。

本章节内容以ESM作为示例，其他的用法大同小异。

### 3.2.1 导出

一个模块一般包含至少一个导出，特殊情况下也可能没有导出，仅作为代码分割。

### 3.2.2 导入

* 对于没有导出的模块，直接import即可。
* 对于仅有/仅使用默认导出的模块，import模块名即可。
* 对于有多个导出出口的模块，需要添加别名，防止冲突，```import * as xxx```。
* 导入的路径应该是相对路径，且`推荐`包含文件扩展名。
* 不要循环依赖，比如a引用b，b引用a。

## 3.3 文件的主体实现

在引入所有的依赖之后，就是该文件自身的模块(逻辑)的主体实现。


# 4 格式化

## 4.1 括号

### 4.1.1 括号用于所有控制结构

* 所有控制结构(包括分支、循环及其他结构)都`必须`需要大括号，即使主体只包含一条语句也是一样。
* 结构主体的第一个条语句`必须`新起一行。
* 当if语句较为简单，且主体只有一条语句时，`可以`省略大括号，并将主体和if在同一行书写。

```javascript
//bad
if (someVeryLongCondition())
  doSomething();

//bad
for (let i = 0; i < foo.length; i++) bar(foo[i]);

//allow
if (shortCondition()) foo();

//good
if (valid === true){
  save();
}
```

### 4.1.2 非空块:K&R风格

大括号`应该`遵循K&R风格([Egyptian Brackets](https://blog.codinghorror.com/new-programming-jargon/))，适用于非空块和类似块的结构:
* 在开始大括号前没有换行符
* 在开始大括号后有换行符
* 在关闭大括号前有换行符
* 如果关闭大括号终止了语句、函数、类或类方法的主体，在大括号后有换行符。
* 如果关闭大括号后面是else, catch, while或逗号、分号或小括号，则没有换行符。

```javascript
//bad, don't add line break before opening brace.
if (valid === true)
{
  save();
}

//bad, don't add line break after closing brace when it is followed by related statement.
if (length > 0){

}
else if(length === -1){

}

//good
(function(){
  var name = 'Test';
})();

//good
class InnerClass {
  constructor() {}

  method(foo) {
    if (condition(foo)) {
      try {
        // Note: this might fail.
        something();
      } catch (err) {
        recover();
      }
    }
  }
}

```

### 4.1.3 空块

当块或类似块的主体为空时，`可以`在打开后立即关闭，即大括号内没有任何字符(包括空字符)，或仅有一个空格。除非它是多块语句(如直接包含多个块的语句: if/else, try/catch/finally)的一部分。

例如：
```javascript
//good
function doNothing() {}

//bad
if (condition) {
  // …
}
```

## 4.2 缩进

使用缩进时，`禁止`使用纯制表符，可以将制表符转换为4个空格，每级缩进按一下tab，或直接输入4个空格。

每当打开一个新的块或类似块的构造时，就增加一级缩进。当块结束时，缩进返回到上一个缩进级别。缩进级别适用于整个块中的代码和注释。

### 4.2.1 数组

数组可以较自由的格式化，就好像它是一个“类似块的结构”。`推荐`从下列格式化方法中选用。

```javascript
var a = [
  0,
  1,
  2,
];

var b = [0, 1, 2];

someMethod(foo, [
  0, 1, 2
], bar);
```

### 4.2.2 对象

对象和数组类似，查看示例即可:

```javascript
var a = {
  x: 0,
  y: 1,
};

var b = {x: 0, y: 1};

someMethod(foo, {
  x: 0, y: 1
}, bar);
```

### 4.2.3 类

类的声明和表达式都可以视为块。不要在类方法之后添加分号，或者在类声明的右括号之后添加分号，表达式的语句仍然以分号结尾(箭头函数视为表达式)。

```javascript
class Foo {
  name = "test";

  constructor() {
    this.x = 42;
  }

  onClick = (e) => {
    console.log(e);
  };

  method() {
    return this.x;
  }
}
Foo.Empty = class {};
```

### 4.2.4 函数

嵌套使用的函数/匿名函数，主体添加一级缩进即可。

```javascript
window.onload = function() {
  init();
};

document.addEventListener('click', function(e) {
  console.log(e)
});
```

### 4.2.5 Switch声明

与任何其他块一样，switch块的内容增加一级缩进，case块的内容需要再增加一级缩进。

```javascript
switch (status) {
  case 200:
    callback('Success!');
    break;
  case 404:
    callback('Not Found!');
    break;
  default:
    throw new Error('Unknown status');
}
```

## 4.3 声明

### 4.3.1 每行一个声明

每一条声明之后都有一个换行符。

### 4.3.2 分号是必需的

每条声明都必须以分号结尾(同时声明多个变量视为一条声明)。

## 4.4 代码行长度限制(列限制)

每一行代码字符数(也称为列长度)`不应该`超过180个字符，`推荐`不超过80个字符，但是以下情况例外：
* 较长的URL或资源地址、路径等。
* 较长且无法换行的指令，或脚本。
* 可能需要全部复制或搜索的长字符串。
* 其他情况无法换行的内容。

## 4.5 换行

换行是将代码块按照规范或长度限制拆分成多行。
没有全面的、确定性的公式可以确切地说明在每种情况下如何换行。通常有几种有效的方法来对一段代码进行换行。

* `可以`通过提取方法或局部变量，来避免一行代码过长。
* 在代码长度不超过溢出列限制时，`不推荐`进行换行。

### 4.5.1 在哪里换行

换行的主要参考是：最好在更高的语法层次上中断，基本的一些规则如下:
1. 在操作符处断行时，断行符位于符号之后(不适用于小数点，它实际上不是一个操作符)。
1. 方法或构造函数的开始括号始终跟随在名称后面，并保持在一行内。
1. 逗号(,)跟随在它前面的标记上。
1. 不要为了换行而换行，换行的目的是拥有更清晰的代码，以及更好的可读性。

```javascript
//good
currentEstimate =
    calc(currentEstimate + x * currentEstimate) /
        2.0;

//bad
currentEstimate = calc(currentEstimate + x *
    currentEstimate) / 2.0;
```

在此示例中，从高到低的语法级别为：赋值、除法、函数调用、参数、数字常量。


## 4.6 空格

### 4.6.1 空行

空行的一般使用规则:
1. 类或对象中的连续方法之间添加空行；属性之间、属性和方法之间一般不需要空行。
1. 在方法体中，可根据逻辑对代码适当进行分组，组之间添加空行。`不允许`在函数体的开始或结束处添加空行。
1. `应该`在文件结尾处，添加一个空行。
1. 其他情况可根据具体内容，适当进行添加。

### 4.6.2 空格

空格的使用取决于位置，分为三大类：
* 开头(在行的开头)
* 结尾(在行的末尾)
* 内部

行开头的缩进后`不允许`尾随空格。

除了语法或其他规范所要求的地方之外，除了文字、注释之外，`应该`在以下情况使用一个单独的空格：
* 除匿名方法和方法调用外的任何保留字(如if, for, catch等)与其后面的开始括号"("之间。
* 任何保留字(如else或catch)与其之前的关闭括号"}"之间。
* 在任何开始大括号"{"之前，有两个例外：
  - 对象的开始大括号(如foo({a: [{c: d}]}))。
  - 模板字符串的$与开始大括号之间。
* 在任何二元或三元运算符的两边。
* 在逗号","之后。
* 一行内的多个表达式，在";"之后(如for(let i = 0; i < 5; i++))
* 对象中的冒号":"之后。

### 4.6.3 水平对齐

`不应该`通过不固定的空格，来使代码纵向对齐。这种做法是允许的，但通常不鼓励这样做。

```javascript
//normal
{
  tiny: 42,
  longer: 435,
};

//BAD
{
  tiny:   42,
  longer: 435,
};
```

### 4.6.4 函数参数

最好将函数的所有参数与函数名放在同一行，如果这样做会超过列限制或长到难以阅读，则参数必须以可读的方式换行，最多可以每个参数独占一行，换行时增加一级缩进。

```javascript
doSomething(
  descriptiveArgumentOne, descriptiveArgumentTwo, descriptiveArgumentThree) {
  // …
}

doSomething(veryDescriptiveArgumentNumberOne, veryDescriptiveArgumentTwo,
  tableModelEventHandlerProxy, artichokeDescriptorAdapterIterator) {
  // …
}

doSomething(
  veryDescriptiveArgumentNumberOne,
  veryDescriptiveArgumentTwo,
  tableModelEventHandlerProxy,
  artichokeDescriptorAdapterIterator) {
  // …
}
```

## 4.7 注释

### 4.7.1 块级注释样式

块注释与其周围代码保持一样的缩进，可以使用/\*…\*/ 或 // 语法，每行注释的起始符号和内容之间应有一个空格。

对于多行/\*…\*/ 注释，每行应该以星号`*`开头，第二行起，每个星号应该与第一行的星号对齐。

错误示例：
```javascript
/*
This is comment.
*/

//comment....
```

正确示例：
```javascript
/*
 * This is
 * okay.
 */

// comment....

// And so
// is this.

/* This is fine, too. */
```

### 4.7.2 JSDoc注释

JSDoc是一个根据javascript文件中注释信息，生成JavaScript应用程序或库、模块的API文档的工具，语法格式为```/ **…* /```。

`推荐`为类、字段、方法等添加JSDoc注释，这样可以使其更具有可读性，便于维护。

基本的语法规则可以查看[Google Annotating JavaScript](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler)。

```javascript
/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param {number} index A number to do something.
 * @param {number=} end Another optional number to do something.
 * @return {boolean} Whether something occurred.
 */
function doSomething(index, end) { … }

/**
 * A fancier event target that does cool things.
 * @implements {Iterable<string>}
 */
class MyFancyTarget extends EventTarget {
  /**
   * Maximum number of things per pane.
   * @type {number}
   */
  this.someProperty = 4;

  /**
   * @param {string} arg1 An argument that makes this more interesting.
   * @param {!Array<number>} arg2 List of numbers to be processed.
   */
  constructor(arg1, arg2) {
    // ...
  }
};
```

### 4.7.3 Deprecation

用@deprecated注释来标记已弃用、过时、不推荐使用的方法、类或接口。

注释中应注明对应可用的方法，便于进行查找使用。

```javascript
/** @deprecated Use Table instead. */
function datagrid(){
  // …
}
```


# 5 语言特性

JavaScript包含许多包含歧义(甚至危险)的特性。本节描述哪些功能可以使用，哪些不可以使用，以及对用法的额外限制。

## 5.1 变量

对于所有的变量类型，除调用外，`禁止`操作原型上的属性/方法，包括但不限于添加/扩展/删除/修改等。

### 5.1.1 全局变量or局部变量

除特殊情况或需求外，`不允许`声明全局变量，并且`应该`尽可能地最小化变量的作用域。

### 5.1.2 变量声明方式

对于变量的声明，可以使用var、let、const，其适用性`推荐`如下：
* 定义常量或不需要重新分配值的变量时，使用const。
* 在function块内，定义的顶级变量，使用var和let均可。
* 在控制语句及其他不构建闭包的块内，使用let。
* 特殊的，在for循环时，需要获取计数器(迭代属性)的最终值时使用var，否则使用let。

### 5.1.3 声明时进行初始化

声明变量时，`推荐`直接初始化其默认值，除非该变量的undefined值是有意义的，初始化默认值有助于减少在执行相关方法时的异常情况。

## 5.2 数组的定义

### 5.2.1 使用后续逗号

当最后一个元素和结束括号之间有一个换行符时，在后面加上逗号，此规则同样适用于对象。

```javascript
var values = [
  'first value',
  'second value',
];
```

### 5.2.2 构造函数

`不应该`使用构造函数(或包装对象)来初始化/定义长度不固定的数组，比如下面的例子：

```javascript
var a1 = new Array(x1, x2, x3);
var a2 = new Array(x1, x2);
var a3 = new Array(x1);
var a4 = new Array();
```

除第三种情况外，其他情况与预期一致。如果x1是一个非负整数，那么a3就是一个大小为x1的数组，其中所有元素都是undefined。如果x1是负数或带有小数等情况，则抛出异常，如果不是数字，则返回单元素数组。

所以在知道具体值时，`推荐`直接使用字面量进行定义：

```javascript
var a1 = [x1, x2, x3];
var a2 = [x1, x2];
var a3 = [x1];
var a4 = [];
```

在适当的时候，`可以`使用new Array(length)，创建一个指定长度的数组。

### 5.2.3 非数值的属性

不要在数组上定义、扩展、使用非数值属性(length除外)，有相关需求的可以使用Map或Object。

### 5.2.4 解构赋值

通过解构赋值，可以将值从数组中取出，赋值给其他变量，赋值时可以包含最后一个rest元素。

> 注意：使用rest元素时，该变量后不能再有逗号","，否则会异常报错。

```javascript
var arr=[1,2,3,4,5,6];
var [a, b] = arr; // a:1, b:2
var [a, b, c, ...d] = arr; // d:[4,5,6]
```

### 5.2.5 展开操作符

在定义数组时，可以使用展开操作符，其用法和结构的rest元素相似，可以通过此语法来简单实现一些常用的调用方式，参考如下示例：

```javascript
function test(arr){
  var [...arr2] = arguments;
  var [a, b, ...args] = arr;
  
  test1([...arr]) //相当于arr.slice(0)
  test2(arr2) //相当于Array.prototype.slice.call(arguments)
  test3(args) //从数组中截取部分传递
  test4(...arguments) //相当于test4.apply(null, arguments)
}
```

## 5.3 对象

本节所指对象为Object对象，在JS中其他引用类型也可视为对象，但不适用于本节内容。

### 5.3.1 使用后续逗号

当最后一个属性和结束大括号之间有换行符时，在其后面加上逗号。

### 5.3.2 构造函数

`不应该`使用构造函数来创建对象，使用字面量定义即可。

```javascript
var x = {a: 0, b: 1, c: 2};
var y = {};
```

### 5.3.3 属性的引号

在定义对象时，属性名的规范为：
* 仅允许包含字母、数字、下划线、美元符号。
* 不能以数字开头。

使用规范为：
1. 按上述规范定义属性名，属性名不添加引号。
1. (`不推荐`)特殊情况下，属性名包含其他特殊符号或其他内容，必须添加引号。
1. 需要不规范的属性名时，允许的情况下，`应该`使用Map或Set。
1. `不允许`同时有带引号和不带引号的属性.

```javascript
//bad
{
  width: 42,
  'maxWidth': 43,
}

//good
{
  width: 42,
  maxWidth: 43,
}
```

### 5.3.4 计算属性名

按照上一条的规则，计算属性名属于带引号的(除非计算的结果是一个Symbol)。

### 5.3.5 属性及方法简写

允许使用属性和方法的简写语法。

```javascript
var foo = 1;
var bar = 2;
var obj = {
  foo,
  bar,
  method() { return this.foo + this.bar; },
};

assertEquals(3, obj.method());
```

### 5.3.6 解构赋值

类似数组，对象的结构赋值更为常用和方便，常用于拆解对象，解构参数等。
> 注意：解构属性时，如果该属性未在自身定义，则会从原型链上查找。

```javascript
var o = {p: 42, q: true, m: 1, n :2};
var {p, q, ...r} = o; //p:42, q:true, r:{m:1, n:2}

var o = {p: 42, q: true};
var {p: foo, q: bar} = o; //foo:42, bar:true
```

### 5.3.7 空引用

在某些情况下，对象可能为空，这样在引用的时候就可能会产生语法错误，因此对于可能为空的父对象，`推荐`使用可选链操作符，或者添加非空判断。

此规则对于数组等引用类型也同样适用。

```javascript
var data = {};
getInitData().then(function(data) {
  // or using if instead
  var x = data ? data.name ? data.name : "" : "";
  
  // using Optional Chaining
  var y = data?.name?.length;

  // Optional Chaining with default value
  var z = data?.name?.length ?? 0;
})
```

## 5.4 类

本章的类是指ES6语法中的类表达式。

### 5.4.1 构造函数

构造函数是可选的，一般用于定义一些类初始化时所需的字段(详见下一节)。

在子类的构造函数中，需要访问this对象之前，必须先调用```super()```。

### 5.4.2 字段

一般类的字段在构造函数内进行初始定义，也可以直接使用类字段声明，`应该`在初始化字段时赋予默认值。

私有字段`不推荐`使用。

类实例化以后(构造执行完以后)，`不允许`再向实例中添加或删除属性及方法，所以必须在定义时，将所有字段都初始化，在需要删除时，将字段的值改为undefined。

```javascript
class Foo {
  constructor() {
    this.name = "Foo";
    this.author = "xx";
  }
}

class Data {
  name = "Data";
  author = "xx";
  //不推荐使用私有字段及方法。
  #list = [];
}
```

### 5.4.3 计算属性

一般情况下，`不应该`显示的使用计算属性，需要动态添加属性的，可以在构造时进行添加。

```javascript
var data=[31, 22, 83, 14, 35];
class Foo {
  //bad
  ["field-" + data[0]] = 0;
  ["field-" + data[1]] = 1;
  constructor(){
    //good
    this["field-" + data[0]] = 0;

    //good
    data.forEach((d, index)=>this["field-" + d] = index);
  }
}
```

### 5.4.4 静态方法

静态方法内是无法访问当前实例的，所以`推荐`使用类的普通方法及成员，仅在确切需要的时候使用静态成员/方法。

```javascript
//bad
class Foo {
  name = "Foo";
  static getValue() {
    //此用法将会报错
    return this.name;
  }
}

Foo.getValue();
```

### 5.4.5 类与方法

在使用一些第三方库时，默认是采用类的形式来构造组件的，但是大多也都支持纯方法。

对于一些逻辑较为复杂的内容，有能力的情况下`推荐`使用函数式编程来进行代码优化。

### 5.4.6 其他内容

1. `不允许`操作类的原型：类可以定义各种字段和方法，远比在其原型上扩展方便易用且影响范围更可控。
1. 谨慎使用Getters 和 Setters。
1. `不推荐`重载toString方法。

## 5.5 函数

### 5.5.1 函数定义

`禁止`在非闭包块内定义函数，尽管在目前很多环境内都能正常运行，但这种用法是不标准的，可能导致不一样的行为。

极特殊情况需要在块内定义的，可参考下面的示例：

```javascript
//bad
if (x) {
  function foo() {}
}

//good
if (x) {
  var foo = function() {};
}
```

### 5.5.2 箭头函数

箭头函数提供了更简洁的函数语法，并简化了嵌套函数的作用域。`推荐`在允许的情况下优先使用箭头函数。使用箭头函数时需要注意以下事项：
1. 箭头函数不会构建自身的this，所以一个常用的场景是作为回调函数，不需要提前进行bind。
1. 基于上一条，因此调用call或者apply时，第一个参数thisArg会被忽略，进行bind时效果一样。
1. 箭头函数没有自身的arguments变量，因此一般通过字面量直接使用，必须要使用arguments时，可以使用剩余参数。
1. 箭头左侧包含零个或多个参数。即使只有一个非解构参数，也`不应该`省略参数周围的小括号。
1. 定义时，如果函数体未使用大括号包裹，则直接返回其计算值。使用大括号包裹时，视为函数体代码块，不会返回计算结果。
1. 基于上一条，需要直接返回对象时，需要在对象的大括号外包裹小括号。
1. 由于默认会直接返回值，因此将箭头函数赋值给其他变量或者回调时，如果仅需要执行函数体而不需要其返回值时，需要添加void运算符。

```javascript
//典型用于回调方法，不需要bind(this)。
class CallbackExample {
  count = 0;
  constructor() {
    document.addEventListener("click", this.click);
  }
  click = (e) => {
    //只有一个参数时，也不能省略小括号。
    //不能在内部访问arguments。
    console.log(e);
    this.count++;
  }
  click2 = (...args) => {
    //当唯一的参数是剩余参数时，不允许省略小括号。
    //可以通过剩余参数来获取arguments。
    console.log(args);
  }
  //error，箭头函数会将对象的大括号视为函数体的包裹，所以会直接抛出语法错误。
  getObj = () => {a:1,b:2}
  //good，可以用小括号包裹。
  getObj = () => ({a:1,b:2})
}

var button = document.getElementById("button");
//这种情况需要添加void运算符，保证该箭头函数始终返回undefined，否则当内部的方法返回其他值(如true,false)等时，可能会影响整体的功能。
button.onclick = () => void doSomething();
```

### 5.5.3 参数

#### 5.5.3.1 可选参数

可选参数一般有两种：
1. 参数可选：根据参数是否传递，来进行不同的操作/计算。
2. 默认参数：即当对应参数没传或为undefined时，使用预定义的默认值。

```javascript
//可选参数
function html(){
  if(arguments.length === 0){
    return element.innerHTMl;
  } else{
    element.innerHTML = arguments[0];
  }
}

//默认参数
function multiply(a, b = 2) {
  return a * b;
}
multiply(5, 3); // 15
multiply(5);    // 10
```

#### 5.5.3.2 参数组装

在允许的情况下，`推荐`使用剩余参数、参数的解构赋值、展开语法等方式，实现更灵活的接口。

```javascript
function variadic(array, ...numbers) {
  var result = array.concat(numbers);
  console.log(result);
  //spread it as arguments to a function
  fn(...result);
}
variadic([1,2,3],4,5,6,7,8);

function onChange(e, {newValue,oldValue}){
  console.log(newValue,oldValue)
}
onChange(e, {newValue:18, oldValue:20});
```

## 5.6 字符串

### 5.6.1 使用单引号

普通字符串用单引号(')分隔，而不是双引号(")。

### 5.6.2 模板字符串

在允许的情况下，`推荐`使用模板字符串来替代引号，这样能够避免引号嵌套错乱，还能够支持多行文本字符串。

模板字符串从第二行起，顶格书写，前面不要添加tab或空格。

```javascript
function arithmetic(a, b) {
  return `Here is a table of arithmetic operations:
${a} + ${b} = ${a + b}
${a} - ${b} = ${a - b}
${a} * ${b} = ${a * b}
${a} / ${b} = ${a / b}`;
}
```

### 5.6.3 不要行延续

无论在普通字符串还是模板字符串中，都不要使用行延续(即，在字符串文字中以反斜杠结束一行)。尽管ES5允许这样做，但如果在斜杠之后出现任何尾随空格，则会导致一些棘手的错误，而且不利于阅读。

```javascript
//bad
var longString = 'This is a very long string that far exceeds the 80 \
    column limit. It unfortunately contains long stretches of spaces due \
    to how the continued lines are indented.';

//good
 longString = 'This is a very long string that far exceeds the 80 ' +
    'column limit. It does not contain long stretches of spaces since ' +
    'the concatenated strings are cleaner.';
```

## 5.7 数字

数字可以表示为十进制、十六进制、八进制或二进制。对十六进制、八进制和二进制分别使用小写字母的0x、0o和0b前缀。除非紧跟x、o或b，否则不要包含前导零。

### 5.7.1 小数

由于计算精度的问题，`不推荐`使用小数，除非不进行计算，因为0.1+0.2不等于0.3。

必须要使用时，`推荐`使用整数进行计算，然后整除10的n(n>0)次幂，此计算不会出现精度问题。

## 5.8 控制结构

### 5.8.1 循环

1. 对于数组，可以使用其内置的循环方法：forEach, map, every, some。
1. 对于对象，可以使用```Object.keys()```获取属性列表，然后使用数组的循环方法。

### 5.8.2 Switch语句

switch块中包含若干语句组，每个语句组由至少三个条件组成(较少的条件更适合用if/else)，条件后面为该语句组的逻辑代码。

* 每个语句组都`应该`在其逻辑代码后进行终止，终止方式包括break，return，throw等。
* 当多个条件的处理方式一致(或调用通用方法)时，`应该`合并条件为一个语句组。
* `推荐`为每个switch语句添加default条件。

### 5.8.3 异常

编码时，`应该`尽量避免可能出现危险或非预期值的操作，对于确实可能存在的非预期情况，`应该`添加异常处理，并根据具体情况通过特定方式输出错误信息或者UI反馈，如log日志文件，控制台log信息，或alert提醒等。

除极特殊情况外，`禁止`使用空的catch块，并且这种情况需要添加注释说明：为什么不需要处理catch信息。

## 5.9 变量比较

1. 对于基本数据类型(不包括构造的对象及Symbol)，使用全(不)等进行比较。
1. 对于非空(undefined和null)的判断，可以用普通的相等于进行比较，如：args == null;
1. 对于引用数据类型(这里仅指object,array,function)，使用相等进行比较时，比较的是两个对象的引用是否一致(类似其他编程语言的指针地址)，故称之为浅比较，开销比较小，`推荐`用这种方式进行比较。
1. 对于两个完全未知的引用数据类型进行比较时，普通的浅比较显然无法满足需求，所以在部分情况下，可能需要进行深比较，但需要注意效率问题和内存溢出，具体比较方法可以视需求而定。

> 可以使用第三方库lodash的isEqual方法进行深比较(最好不使用深比较)。

## 5.10 不允许的功能

### 5.10.1 with

`禁止`使用with关键字。它使你的代码更难理解，并且从ES5开始就在严格模式下被禁止了。

### 5.10.2 从字符串执行动态代码

`禁止`使用eval、Function、setTimeout等将字符串解析为代码进行执行的功能，此用法具有极严重的的安全隐患。

### 5.10.4 非标准的特性

`不应该`使用非标准的特性。包括已经删除的旧特性(如WeakMap.clear)、尚未标准化的新特性(如当前的TC39工作草案、任何阶段的建议、或提出但尚未完成的web标准)、或只在某些浏览器中实现的专有特性。只使用当前ECMA-262或WHATWG标准中定义的特性。

在部分确实需要的情况下，`可以`使用polyfill或shim进行兼容使用。

在仅需要支持特定环境(如特定浏览器或Node等)的功能上，`可以`使用该环境支持的特性。

### 5.10.5 基本类型的包装对象

`不应该`使用基本数据类型的构造方法进行初始化，即不要使用new，有类型转换或其他需要时，可以用其对象包装器生成字面量值。

```javascript
//bad
var x = new Number("11.4");
typeof x // return object

//good
var x = Number("11.4");
```

### 5.10.6 修改内置对象

`禁止`修改JS内置对象(泛指一切引用类型)，包括对象本身及其原型上的任何内容。


# 6 命名

## 6.1 通用规则

* 命名时，仅允许字母、数字、下划线、美元符号，且不能以数字开头。
* 一般用骆驼命名法：首字母小写，从第二个单词开始，每个单词的首字母大写。
* 对于类(class)、枚举、组件、模板、命名空间等，使用帕斯卡命名法，即首字母也大写。
* 对于常量，`推荐`使用帕斯卡命名法，也可以使用全文大写。
* `必须`使用英文单词进行命名，`禁止`使用汉语拼音等其他内容。
* 使用单词缩写时，应该避免不必要的歧义，且缩写较为通用、常见，除此之外其他的缩写`不应该`使用。
* 尽量做到简短，且见名知意(或大概功能/用途等)。
* 一般情况下，命名不要超过32个字符，极限情况下按照语法规范不能超过255个字符。

```javascript
//good
errorCount          // No abbreviation.
dnsConnectionIndex  // Most people know what "DNS" stands for.
referrerUrl         // Ditto for "URL".
customerId          // "Id" is both ubiquitous and unlikely to be misunderstood.

//bad
n, n1, n2           // Meaningless.
nErr                // Ambiguous abbreviation.
nCompConns          // Ambiguous abbreviation.
wgcConnections      // Only your group knows what this stands for.
pcReader            // Lots of things can be abbreviated "pc".
cstmrId             // Deletes internal letters.
kSecondsPerDay      // Do not use Hungarian notation.
```

## 6.2 语法规则

命名的一般语法规则如下：
* 一般情况，推荐使用名词(词组)，如：name，userId。
* 名词短语，如：personalData，EmptyMessage。
* 动词短语，如：setValue, onChange。

## 6.3 方位词

考虑到书写方式及顺序的不同，传统的上下左右，在实际中可能会发生变化。

因此，在方位词上`建议`采用CSS最新的命名方式，即：

* 同一个轴(两个方向)时，称为start和end，映射到传统名称，即横向start为左，end为右；纵向start为上，end为下。
* 两个轴(四个方向)时，添加inline和block前缀，表示轴方向，即inline-start为左，block-end为下。

# 0 附录
本文部分内容是从[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)节选(翻译)的。

## 0.1 强调命令词
> 此部分单词(词组)通常以大写表示，本部分按此规则呈现。
1. MUST: 同`REQUIRED`、`SHALL`，表示该定义是规范的绝对要求。

1. MUST NOT: 同`SHALL NOT`，表示改定义的规范的绝对禁止。

1. SHOULD: 同`RECOMMENDED`、`PREFER`，表示绝大多数情况下应该按照该定义的要求执行，特殊情况下完整理解并权衡后，可以不按照此要求执行。

1. SHOULD NOT: 同`NOT RECOMMENDED`、`AVOID`，表示绝大多数情况下应该按照该定义的要求禁止，特殊情况下完整理解并权衡后，可以不按照此禁止要求。

1. MAY: 同`OPTIONAL`，表示此项目规范是可选的，一般提供多种方式可供选择，表示可以在这些方式中选择其一的要求执行(不执行)。

1. 使用场景: 使用强调命令词时必须谨慎，即存在必须使用的需求时，才进行使用。

1. 歧义: 此部分内容原文是[RFC 2119](https://tools.ietf.org/html/rfc2119)资源规范，对其进行了翻译和整理，并对原文中可能存在影响理解的内容进行了处理和修改，并进行了审阅，在此过程中仍可能保留有歧义或增加歧义，对有歧义的内容按照常识及大众思维进行判断即可。
