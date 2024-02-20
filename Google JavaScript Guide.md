# 1 介绍

本文档是对Google的JavaScript编码标准的完整定义。当且仅当JavaScript的代码遵循Google的规则时，才将其描述为Google样式。
与其他编程风格指南一样，这些问题不仅涉及格式的美学问题，还涉及其他类型的约定或编码标准。然而，本文主要关注的是我们普遍遵守的硬性规则，并避免给出不明确可执行的建议(无论是通过人力还是工具)。

## 1.1 术语

在本文件中，除非另有澄清:
1.术语注释总是指执行注释。我们不用文档注释，相反，使用公共术语“JSDoc”来表示人可读的文本和机器可读的注释/* ... */。
2.本风格指南在使用短语must、must not、should、should not和may时使用[RFC 2119](https://tools.ietf.org/html/rfc2119) 术语。术语prefer和avoid分别各自对应should和should not，命令式和声明式语句是规范性的，与must对应。
其他术语注释偶尔会出现在整个文档中。

## 1.2 指南

本文档中的示例代码不规范。也就是说，虽然例子是谷歌风格的，但它们可能不是潇洒的表示代码的唯一方式。示例中的可选格式选项不能作为规则强制执行。

# 2 源文件基础

## 2.1 文件名 

文件名必须是小写的，可以包括下划线(_)或破折号(-)，但是没有额外的标点符号。遵循项目使用的约定。文件名的扩展名必须是.js。

## 2.2 文件编码:UTF-8

源文件是用UTF-8编码的。

## 2.3 特殊字符

### 2.3.1 空字符

除了行结束符序列之外，ASCII空字符(0x20)是源文件中惟一出现的空白字符。这意味着：
1.字符串文字中的所有其他空白字符都被转义，并且
2.制表符不用于缩进。

### 2.3.2 特殊的转义序列

对于任何具有特殊转义序列的字符 (\', \", \\, \b, \f, \n, \r, \t, \v)，使用该序列而不是相应的数字转义(e.g \x0a, \u000a, or \u{a})。遗留的八进制转义从未使用过。

### 2.3.3 非ASCII字符

对于其余的非ASCII字符，使用实际的Unicode字符或等效的十六进制或Unicode转义，仅仅依赖于哪个使代码更容易阅读和理解。

>**提示:在Unicode转义的情况下，有时甚至在使用实际的Unicode字符时，注释也是非常有用的。**
例如：
```
/* Best: perfectly clear even without a comment. */
const units = 'μs';

/* Allowed: but unncessary as μ is a printable character. */
const units = '\u03bcs'; // 'μs'

/* Good: use escapes for non-printable characters with a comment for clarity. */
return '\ufeff' + content;  // Prepend a byte order mark.
```
禁止：
```
/* Poor: the reader has no idea what character this is. */
const units = '\u03bcs';
```

>**提示:永远不要因为担心某些程序不能正确处理非ascii字符而降低代码的可读性。如果发生这种情况，这些程序就会被破坏，必须进行修复。**

# 3 源文件结构

所有新的源文件都应该是一个goog.module文件(包含调用goog.module文件)或ECMAScript (ES)模块(使用import和export语句)。文件按顺序由下列各部分组成:
1.许可或版权信息，如果存在
2.@fileoverview JSDoc，如果有的话
3.goog.module声明，如果是goog.module文件的话
4.ES import语句，如果是ES模块的话
5.goog.require和goog.requireType声明
6.文件的实现
除了文件的实现之外，每个部分之间只有一个空行，文件的实现之前可能有1或2个空行。

## 3.1 许可或版权信息，如果存在

如果许可或版权信息存在于一个文件，那么它属于这里。

## 3.2 @fileoverview JSDoc，如果有的话

格式规则见[7.5顶部/文件级注释](https://google.github.io/styleguide/jsguide.html#jsdoc-top-file-level-comments) 。

## 3.3 goog.module声明

所有的goog.module文件必须精确的声明一个单行上goog.module名：包含goog.module行的声明不能被换行，因此是80列限制的一个例外。
关于goog.module名称空间的内容的定义。它可以附加包名(反映代码所在目录结构片段的标识符)之后，也可以选择将它定义在main class/enum/interface的末尾。
例如:
```
goog.module('search.urlHistory.UrlHistoryService');
```

### 3.3.1 层级

模块名称空间可能永远不会被命名为另一个模块名称空间的直接子元素。
禁止:
```
goog.module('foo.bar');   // 'foo.bar.qux' would be fine, though
goog.module('foo.bar.baz');
```
目录层次结构反映了命名空间层次结构，因此嵌套更深的子目录是更高层的父目录的子目录。注意，这意味着“父”名称空间组的所有者必须知道所有子名称空间，因为它们存在于相同的目录中。

### 3.3.2 goog.module.declareLegacyNamespace

google.module语句后面可以有选择地调用goog.module.declareLegacyNamespace();。尽可能避免使用goog.module.declareLegacyNamespace()。
例如：
```
goog.module('my.test.helpers');
goog.module.declareLegacyNamespace();
goog.setTestOnly();
```
goog.module.declarelegacynamespace的存在是为了简化从传统的基于对象层次结构的名称空间的转换，但是它也有一些命名限制。由于子模块名必须在父命名空间之后创建，此名称不能是任何其他goog.module的子或父(例如，goog.module('parent'); 和 goog.module('parent.child'); 无法同时安全存在，goog.module('parent'); 和 goog.module('parent.child.grandchild');也不能同时存在)。

### 3.3.3 goog.module导出

使用exports对象导出类、枚举、函数、常量和其他函数。导出的函数可以直接在导出对象上定义，也可以在本地声明并单独导出。函数只有在用于模块外部时才会被导出。非导出模块本地函数不会声明为private，它们的名称也不会以下划线结尾。对于本地函数导出模块没有规定的顺序。
例如：
```
const /** !Array<number> */ exportedArray = [1, 2, 3];

const /** !Array<number> */ moduleLocalArray = [4, 5, 6];

/** @return {number} */
function moduleLocalFunction() {
  return moduleLocalArray.length;
}

/** @return {number} */
function exportedFunction() {
  return moduleLocalFunction() * 2;
}

exports = {exportedArray, exportedFunction};
```
```
/** @const {number} */
exports.CONSTANT_ONE = 1;

/** @const {string} */
exports.CONSTANT_TWO = 'Another constant';
```
不要将exports对象标注为@const，因为编译器已经将其视为常量。
禁止：
```
/** @const */
exports = {exportedFunction};
```

## 3.4 ES模块

### 3.4.1 导入

Import语句不能自动换行，因此是80列限制的例外。

#### 3.4.1.1 导入路径

ES模块文件必须使用import语句来导入其他ES模块文件。不要用goog.require 另一个ES模块。
```
import './sideeffects.js';

import * as goog from '../closure/goog/goog.js';
import * as parent from '../parent.js';

import {name} from './sibling.js';
```

##### 3.4.1.1.1 导入路径中的文件扩展名

.js文件扩展名在导入路径中必须始终包括在内。
禁止:
```
import '../directory/file';
```
应该:
```
import '../directory/file.js';
```

##### 3.4.1.2 多次导入同一文件

不要多次导入同一个文件。这可能使确定文件的聚合导入变得困难。
禁止:
```
// Imports have the same path, but since it doesn't align it can be hard to see.
import {short} from './long/path/to/a/file.js';
import {aLongNameThatBreaksAlignment} from './long/path/to/a/file.js';
```

##### 3.4.1.3 导入命名

###### 3.4.1.3.1 命名模块导入

模块导入名称（`import * as name`）是衍生自导入文件名的骆驼式命名。
```
import * as fileOne from '../file-one.js';
import * as fileTwo from '../file_two.js';
import * as fileThree from '../filethree.js';
```
```
import * as libString from './lib/string.js';
import * as math from './math/math.js';
import * as vectorMath from './vector/math.js';
```

###### 3.4.1.3.2 默认命名导入

默认导入名称衍生自导入的文件名，并遵循[6.2按标识符类型划分的规则。](https://google.github.io/styleguide/jsguide.html#naming-rules-by-identifier-type) 。
```
import MyClass from '../my-class.js';
import myFunction from '../my_function.js';
import SOME_CONSTANT from '../someconstant.js';
```
>**注意:一般情况下这是不应该发生的，因为默认导出是被这个风格指南禁止的，参见[3.4.2.1命名vs默认导出](https://google.github.io/styleguide/jsguide.html#named-vs-default-exports)。默认导入仅用于导入不符合此样式指南的模块。**

###### 3.4.1.3.3 导入重命名

一般来说，通过命名导入(import {name})导入的符号应该保持相同的名称。避免别名导入(import {SomeThing as SomeOtherThing})。最好通过使用模块导入(`import *`)或重命名导出本身来修复名称冲突。
```
import * as bigAnimals from './biganimals.js';
import * as domesticatedAnimals from './domesticatedanimals.js';

new bigAnimals.Cat();
new domesticatedAnimals.Cat();
```
如果需要重命名命名导入，那么在结果别名中使用导入模块的文件名或路径的组件。
```
import {Cat as BigCat} from './biganimals.js';
import {Cat as DomesticatedCat} from './domesticatedanimals.js';

new BigCat();
new DomesticatedCat();
```

### 3.4.2 导出

函数只有在用于模块外部时才会被导出。非导出模块本地符号不会声明为@private，它们的名称也不会以下划线结尾。对于导出函数模块没有规定的顺序。

#### 3.4.2.1 指定vs默认导出

在所有代码中使用命名导出。您可以将export关键字应用于声明，或者使用export {name};语法。
不要使用默认导出。导入模块必须为这些值指定一个名称，这可以导致模块之间的命名不一致。
不要:
```
// Do not use default exports:
export default class Foo { ... } // BAD!
```
应该：
```
// Use named exports:
export class Foo { ... }
```
```
// Alternate style named exports:
class Foo { ... }

export {Foo};
```

#### 3.4.2.2 导出静态容器类和对象

不要为了命名空间而导出带有静态方法或属性的容器类或对象。
不要：
```
// container.js
// Bad: Container is an exported class that has only static methods and fields.
export class Container {
  /** @return {number} */
  static bar() {
    return 1;
  }
}

/** @const {number} */
Container.FOO = 1;
```
相反，导出单独的常量和函数:
```
/** @return {number} */
export function bar() {
  return 1;
}

export const /** number */ FOO = 1;
```

#### 3.4.2.3 导出的可变性

导出的变量不能在模块初始化之外发生变化。
如果需要变化，还有其他选择，包括导出对具有可变字段的对象的常量引用或导出可变数据的访问器函数。
不要：
```
// Bad: both foo and mutateFoo are exported and mutated.
export let /** number */ foo = 0;

/**
 * Mutates foo.
 */
export function mutateFoo() {
  ++foo;
}

/**
 * @param {function(number): number} newMutateFoo
 */
export function setMutateFoo(newMutateFoo) {
  // Exported classes and functions can be mutated!
  mutateFoo = () => {
    foo = newMutateFoo(foo);
  };
}
```
应该：
```
// Good: Rather than export the mutable variables foo and mutateFoo directly,
// instead make them module scoped and export a getter for foo and a wrapper for
// mutateFooFunc.
let /** number */ foo = 0;
let /** function(number): number */ mutateFooFunc = foo => foo + 1;

/** @return {number} */
export function getFoo() {
  return foo;
}

export function mutateFoo() {
  foo = mutateFooFunc(foo);
}

/** @param {function(number): number} mutateFoo */
export function setMutateFoo(mutateFoo) {
  mutateFooFunc = mutateFoo;
}
```

#### 3.4.2.4 导出

导出语句不能自动换行，因此是80列限制的例外。
因此：
```
export {specificName} from './other.js';
export * from './another.js';
```

### 3.4.3 ES模块的循环依赖

不要在ES模块之间循环创建模块，即使ECMAScript规范允许这样做。注意，可以使用import和export语句循环创建。
禁止：
```
// a.js
import './b.js';
```
```
// b.js
import './a.js';

// `export from` can cause circular dependencies too!
export {x} from './c.js';
```
```
// c.js
import './b.js';

export let x;
```

### 3.4.4 交互操作与闭包

#### 3.4.4.1 引用google

要引用命名空间为goog的闭包，就倒入导入闭包的文件goog.js。
例如：
```
import * as goog from '../closure/goog/goog.js';

const name = goog.require('a.name');

export const CONSTANT = name.compute();
```
在ES模块中goog.js的导出只可以使用全局goog属性的子集

#### 3.4.4.2 ES模块中的goog.require

ES模块中的goog.require与goog.module中的一样工作。你可以要求任何命名空间为闭包的函数(例如被goog.provide和goog.module创造的函数)和goog.require返回值。
例如：
```
import * as goog from '../closure/goog/goog.js';
import * as anEsModule from './anEsModule.js';

const GoogPromise = goog.require('goog.Promise');
const myNamespace = goog.require('my.namespace');
```

#### 3.4.4.3 在ES模块中声明闭包模块ID

goog.declareModuleId可以在ES模块中用于声明goog.module-类似模块ID。这意味着这个模块ID可以是goog.required, goog.module.getd, goog.forwardDeclare'd等等。就好像它是一个没有调用goog.module.declareLegacyNamespace的goog.module。它没有将模块ID创建为全局可用的JavaScript符号。

>**注意:在ES模块中调用goog.module.declareLegacyNamespace是错误的，只能从goog.module中调用文件。没有将遗留命名空间与ES模块关联的直接方法。**
goog.declareModuleId应该只用于将闭包文件升级到适当的ES模块，其中使用了命名导出。
```
import * as goog from '../closure/goog.js';

goog.declareModuleId('my.esm');

export class Class {};
```

## 3.5 goog.setTestOnly

在google.module文件中goog.module语句后面可以有选择地调用goog.setTestOnly()。
在ES模块中，import语句之后可以调用goog.setTestOnly()。

## 3.6 goog.require和goog.requireType声明

导入用的是goog.require和google.requireType语句。由goog.require语句导入的可以在代码和类型注释中使用，而那些由goog.requireType导入的只能在类型注释中使用。
google.module需要和google.requireType语句形成一个连续的块，没有空行。这个块跟在goog.module声明后，由[一个空行](https://google.github.io/styleguide/jsguide.html#source-file-structure)分割。关于goog.require 和goog.requireType，是在一个单独的文件中由goog.module命名定义的。goog.require 和goog.requireType的声明可能不会出现在文件的任何其他地方。
每个google.require或google.requireType都会分配给单个常量别名，或者分解成几个常量别名。这些别名是引用类型注释或代码中的依赖项的惟一可接受的方式。任何地方都不能使用完全限定的命名空间，除了作为goog.require或者goog.requireType的参数。
例外:在externs文件中声明的类型、变量和函数必须在类型注释和代码中使用它们的全名。
别名必须与导入模块命名空间的最终点分隔的名字匹配。
例外:在某些情况下，可以使用命名空间的其他组件来形成更长的别名。产生的别名必须保留原始标识符的外壳，以便它仍然正确地标识其类型。较长的别名可用于消除其他相同别名的歧义，或者显著提高可读性。此外，必须使用更长的别名来防止屏蔽本地类型，如 Element, Event, Error, Map,和Promise(更完整的事例，请看[Standard Built-in Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)和[Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) )。当重命名破坏别名时，按照[4.6.2水平空白](https://google.github.io/styleguide/jsguide.html#formatting-horizontal-whitespace) 的要求，空格必须跟在冒号后面。
一个goog.require和一个goog.requireType的声明在同一个命名空间中，一个文件不应该包含这两者。如果导入的名称同时在代码和类型注释中使用，则应该由单个goog.require导入声明。
如果一个模块导入仅仅是为了用该模块的副作用，那么应该调用goog.require(不是goog.requireType)，并且赋值可以省略。需要一个注释来解释为什么需要这样做，并禁止编译器发出警告。
这些行按照以下规则排序:所有这些都需要在左边有一个名字，然后按名字的字母顺序排在前面。然后需要进行重构，再次按左侧的名称排序。最后，任何独立的require调用(通常这些调用用于导入的模块，只是为了它们的副作用)。

>**提示:没有必要记住这个顺序并手动执行它。您可以依赖您的IDE来报告未正确排序的需求。**

如果一个很长的别名或模块名会导致一行超过80列的限制，则一定不要给它换行:require行是80列限制的例外。
例如：
```
// Standard alias style.
const MyClass = goog.require('some.package.MyClass');
const MyType = goog.requireType('some.package.MyType');
// Namespace-based alias used to disambiguate.
const NsMyClass = goog.require('other.ns.MyClass');
// Namespace-based alias used to prevent masking native type.
const RendererElement = goog.require('web.renderer.Element');
// Out of sequence namespace-based aliases used to improve readability.
// Also, require lines longer than 80 columns must not be wrapped.
const SomeDataStructureModel = goog.requireType('identical.package.identifiers.models.SomeDataStructure');
const SomeDataStructureProto = goog.require('proto.identical.package.identifiers.SomeDataStructure');
// Standard alias style.
const asserts = goog.require('goog.asserts');
// Namespace-based alias used to disambiguate.
const testingAsserts = goog.require('goog.testing.asserts');
// Standard destructuring into aliases.
const {clear, clone} = goog.require('goog.array');
const {Rgb} = goog.require('goog.color');
// Namespace-based destructuring into aliases in order to disambiguate.
const {SomeType: FooSomeType} = goog.requireType('foo.types');
const {clear: objectClear, clone: objectClone} = goog.require('goog.object');
// goog.require without an alias in order to trigger side effects.
/** @suppress {extraRequire} Initializes MyFramework. */
goog.require('my.framework.initialization');
```
严禁：
```
// Extra terms must come from the namespace.
const MyClassForBizzing = goog.require('some.package.MyClass');
// Alias must include the entire final namespace component.
const MyClass = goog.require('some.package.MyClassForBizzing');
// Alias must not mask native type (should be `const JspbMap` here).
const Map = goog.require('jspb.Map');
// Don't break goog.require lines over 80 columns.
const SomeDataStructure =
    goog.require('proto.identical.package.identifiers.SomeDataStructure');
// Alias must be based on the namespace.
const randomName = goog.require('something.else');
// Missing a space after the colon.
const {Foo:FooProto} = goog.require('some.package.proto.Foo');
// goog.requireType without an alias.
goog.requireType('some.package.with.a.Type');


/**
 * @param {!some.unimported.Dependency} param All external types used in JSDoc
 *     annotations must be goog.require'd, unless declared in externs.
 */
function someFunction(param) {
  // goog.require lines must be at the top level before any other code.
  const alias = goog.require('my.long.name.alias');
  // ...
}
```

## 3.7 文件的实现

实际的实现在所有依赖项信息声明之后(至少用一行空白隔开)。
这可能包括任何模块本地声明(常量、变量、类、函数等)，以及任何导出的函数。

# 4 格式化

## 4.1 括号

### 4.1.1 括号用于所有控制结构

所有控制结构(例如if、else、for、do、while以及任何其他结构)都需要大括号，即使主体只包含一条语句。非空块的第一个语句必须从它自己的行开始。
禁止：
```
if (someVeryLongCondition())
  doSomething();

for (let i = 0; i < foo.length; i++) bar(foo[i]);
```
例外:如果一个简单的if语句可以完全放在一行中，而没有换行(也没有else语句)，那么当它提高可读性时，可以放在一行中，而不加括号。这是控件结构可能省略大括号和换行的唯一情况。
```
if (shortCondition()) foo();
```

### 4.1.2 非空块:K&R风格

大括号遵循Kernighan和Ritchie风格( [埃及方括号](https://blog.codinghorror.com/new-programming-jargon/) )，用于非空块和类似块的结构:
*在开始大括号前没有换行符
*在开始大括号后有换行符
*在关闭大括号后前有换行符
*如果大括号终止了语句或函数或类语句或类方法的主体，在关闭大括号后后有换行符。特别地，如果大括号后面是else,catch,while或逗号、分号或右括号，则没有换行符。
例如：
```
class InnerClass {
  constructor() {}

  /** @param {number} foo */
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

### 4.1.3 空块:可能比较简洁

空块或类似块的构造可以在打开后立即关闭，中间没有字符、空格或换行符(例如{})，除非它是多块语句(直接包含多个块的语句:if/else或try/catch/finally)的一部分。
例如：
```
function doNothing() {}
```
禁止：
```
if (condition) {
  // …
} else if (otherCondition) {} else {
  // …
}

try {
  // …
} catch (e) {}
```

## 4.2 块缩进:+2个空格

每当打开一个新的块或类似块的构造时，缩进就增加两个空格。当块结束时，缩进返回到以前的缩进级别。缩进级别适用于整个块中的代码和注释。(参见[4.1.2非空块中的示例:K&R样式](https://google.github.io/styleguide/jsguide.html#formatting-nonempty-blocks) )。

### 4.2.1 数组文字:可选"类似块"

任何数组文字都可以随意格式化，就好像它是一个“类似块的结构”。例如，下列各项都是有效的(并非详尽无遗):
```
const a = [
  0,
  1,
  2,
];

const b =
    [0, 1, 2];

```
```
const c = [0, 1, 2];

someMethod(foo, [
  0, 1, 2,
], bar);
```
允许使用其他组合，特别是在强调元素之间的语义分组时，但不应仅用于减少较大数组的垂直大小。

### 4.2.2 对象文字:可选"类似块"

任何对象文字都可以选择格式化，就好像它是一个“类似块的结构”。同样的例子也适用于[4.2.1的数组字面量:可选的类似块](https://google.github.io/styleguide/jsguide.html#formatting-array-literals) 。例如，以下内容都是有效的(不是详尽的列表):
```
const a = {
  a: 0,
  b: 1,
};

const b =
    {a: 0, b: 1};
```
```
const c = {a: 0, b: 1};

someMethod(foo, {
  a: 0, b: 1,
}, bar);
```

### 4.2.3 类文字

类文字(无论是声明还是表达式)被缩进为块。不要在方法之后添加分号，或者在类声明的右括号之后添加分号(包含类表达式的语句(比如赋值)仍然以分号结尾)。使用extends关键字，但不要使用@extends JSDoc注释，除非该类扩展了模板化类型。
例如：
```
class Foo {
  constructor() {
    /** @type {number} */
    this.x = 42;
  }

  /** @return {number} */
  method() {
    return this.x;
  }
}
Foo.Empty = class {};
```
```
/** @extends {Foo<string>} */
foo.Bar = class extends Foo {
  /** @override */
  method() {
    return super.method() / 2;
  }
};

/** @interface */
class Frobnicator {
  /** @param {string} message */
  frobnicate(message) {}
}
```

### 4.2.4 函数表达式

在函数调用的参数列表中声明匿名函数时，函数体缩进比前一个缩进深度多两个空格。
例如：
```
prefix.something.reallyLongFunctionName('whatever', (a1, a2) => {
  // Indent the function body +2 relative to indentation depth
  // of the 'prefix' statement one line above.
  if (a1.equals(a2)) {
    someOtherLongFunctionName(a1);
  } else {
    andNowForSomethingCompletelyDifferent(a2.parrot);
  }
});

some.reallyLongFunctionCall(arg1, arg2, arg3)
    .thatsWrapped()
    .then((result) => {
      // Indent the function body +2 relative to the indentation depth
      // of the '.then()' call.
      if (result) {
        result.use();
      }
    });
```

### 4.2.5 Switch声明

与任何其他块一样，switch块的内容是缩进的+2。
在switch标签之后，出现一个新行，缩进级别增加+2，就像一个块被打开了一样。如果词法作用域需要，可以使用显式块。下面的switch标签返回到以前的缩进级别，就好像一个块已经关闭。
在中断和以下情况之间，空行是可选的。
例如：
```
switch (animal) {
  case Animal.BANDERSNATCH:
    handleBandersnatch();
    break;

  case Animal.JABBERWOCK:
    handleJabberwock();
    break;

  default:
    throw new Error('Unknown animal');
}
```

## 4.3 声明

### 4.3.1 每行一个声明

每一个声明之后都有一个换行符。

### 4.3.2 分号是必需的

每个声明都必须以分号结尾。禁止依赖自动插入分号。

## 4.4 列限制:80

JavaScript代码的列限制为80个字符。除了如下所述，任何超过此限制的行都必须换行，如[4.5换行](https://google.github.io/styleguide/jsguide.html#formatting-line-wrapping) 中所述。
例外：
1.goog.module,goog.require和goog.requireType声明(详情请参考[3.3 goog.module声明](https://google.github.io/styleguide/jsguide.html#file-goog-module) 和  [3.6 goog.require and goog.requireType声明](https://google.github.io/styleguide/jsguide.html#file-goog-require) )。
2.ES模块import和export from 的声明(详情参见[3.4.1 导入](https://google.github.io/styleguide/jsguide.html#es-module-imports) 和 [3.4.2.4 导出](https://google.github.io/styleguide/jsguide.html#es-module-export-from) )。
3.不可能遵守列限制的行，或者会妨碍可发现性。例子包括：
*一个很长的URL，应该可以在源代码中点击。
*用于复制和粘贴的shell命令。
*可能需要全部复制或搜索的长字符串文字(例如，长文件路径)。

## 4.5 换行

术语注意:换行是将代码块拆分成多行，以遵守列限制，否则块可以合法地放入单个行中。
没有全面的、确定性的公式可以确切地说明在每种情况下如何换行。通常有几种有效的方法来对同一段代码进行换行。
>**注意:虽然换行的典型原因是为了避免溢出列限制，但是实际上适合列限制的代码也可以由作者自行决定换行。**
>**提示:提取方法或局部变量可以解决问题，而不需要换行。**

### 4.5.1 在哪里换行

换行的主要指示是:宁愿在更高的语法层次上中断。
优先的：
```
currentEstimate =
    calc(currentEstimate + x * currentEstimate) /
        2.0;
```
不建议：
```
currentEstimate = calc(currentEstimate + x *
    currentEstimate) / 2.0;
```
在前面的示例中，从高到低的语法级别如下:赋值、除法、函数调用、参数、数字常量。
操作符包装如下:
1.在操作符处断行时，断行符位于符号之后。(注意，这与在Java的谷歌风格中使用的做法不同。)
这不适用于点(.)，它实际上不是一个操作符。
2.方法或构造函数名称始终附加在它后面的左括号(  (  )上。
3.逗号(，)附加到它前面的标记上。
>**注意:换行的主要目标是拥有清晰的代码，而不一定是适合最小行数的代码。**

### 4.5.2 缩进连续行至少+4个空格

换行时，除符合块缩进规则外，第一行(每个延续行)后的每一行至少从原来的行开始缩进+4。
当有多个延续行时，缩进可以适当地超过+4。通常，更深层语法层次上的延续行被4的更大倍数缩进，当且仅当它们以语法上平行的元素开始时，两行使用相同的缩进级别。
[4.6.3水平对齐:不鼓励](https://google.github.io/styleguide/jsguide.html#formatting-horizontal-alignment) 解决了不鼓励使用可变数量的空格将某些标记与前面的行对齐的做法。

## 4.6 空格

### 4.6.1 垂直空格

出现一个空白行:
1.类或对象文字中的连续方法之间
例外：对象文字中的两个连续属性定义之间的空行(它们之间没有其他代码)是可选的。这样的空行可根据需要用于创建字段的逻辑分组。
2.在方法体中，尽量少地创建语句的逻辑分组。不允许在函数体的开始或结束处空行。
3.可选地在类或对象文字中的第一个方法之前或最后一个方法之后(既不鼓励也不劝阻)。
4.按照本文件其他章节的要求(如[3.6 goog.require和google.requireType语句](https://google.github.io/styleguide/jsguide.html#file-goog-require) )。
允许多个连续的空行，但从不要求(也不鼓励)。

### 4.6.2 水平空白

水平空白的使用取决于位置，分为三大类:开头(在行的开头)、结尾(在行的末尾)和内部。领先的空白(即缩进)在其他地方处理。禁止尾随空格。
除了语言或其他样式规则所要求的地方之外，除了文字、注释和JSDoc之外，一个单独的内部ASCII空格也只出现在以下位置。
1.将除function和super之外的任何保留字(例如if、for或catch)与该行后面的开括号( ( )分隔开。
2.将任何保留字(如else或catch)与该行前的右花括号(})分隔开。
3.在任何左花括号({)之前，有两个例外：
在对象文字之前，它是一个函数的第一个参数或数组文字的第一个元素(例如foo({a: [{c: d}]}))。
在模板扩展中，因为语言禁止它(例如:‘ab${1 + 2}cd’，无效:‘xy$ {3}z’)。
4.在任何二元或三元运算符的两边。
5.在逗号(，)或分号(;)之后。注意，在这些字符之前不允许有空格。
6.在对象文字中的冒号(:)之后。
7.开始行结束注释的双斜杠(//)的两边。这里允许使用多个空格，但不是必需的。
8.在块开始注释字符之后和在关闭字符的两边(例如，对于短格式类型声明、强制类型转换和参数名称注释:这个。```foo = /** @type {number} */ (bar);或function(/** string */ foo) {;或者baz(/* buzz= */ true)```)。

### 4.6.3 水平对齐:不建议

术语注意:水平对齐是在代码中添加可变数量的额外空格的实践，其目标是使某些标记直接出现在前几行上某些其他标记的下面。
这种做法是允许的，但谷歌风格通常不鼓励这样做。它甚至不需要在已经使用过的地方保持水平对齐。
下面是一个没有对齐的示例，后面是一个有对齐的示例。两者都是允许的，但后者是不鼓励的:
```
{
  tiny: 42, // this is great
  longer: 435, // this too
};

{
  tiny:   42,  // permitted, but future edits
  longer: 435, // may leave it unaligned
};
```
>**提示:对齐有助于提高可读性，但是会给将来的维护带来问题。考虑一个未来的更改，它只需要修改一行。这种更改可能会使以前令人满意的格式变得混乱，这是允许的。更常见的情况是，它还会提示编码器(可能是您)调整附近行上的空白，这可能会触发一连串的更改。这一行改变现在有一个爆炸半径。在最坏的情况下，这可能导致毫无意义的繁忙工作，但在最好的情况下，它仍然会破坏版本历史信息，减慢评审员的速度，并加剧合并冲突。**

### 4.6.4 函数参数

最好将所有函数参数与函数名放在同一行。如果这样做会超过80列的限制，则参数必须以可读的方式换行。为了节省空间，可以将参数包装为尽可能接近80，或者将每个参数放在自己的行上以增强可读性。缩进应该是四个空格。对齐括号是允许的，但不鼓励。下面是最常见的参数包装模式:
```
// Arguments start on a new line, indented four spaces. Preferred when the
// arguments don't fit on the same line with the function name (or the keyword
// "function") but fit entirely on the second line. Works with very long
// function names, survives renaming without reindenting, low on space.
doSomething(
    descriptiveArgumentOne, descriptiveArgumentTwo, descriptiveArgumentThree) {
  // …
}

// If the argument list is longer, wrap at 80. Uses less vertical space,
// but violates the rectangle rule and is thus not recommended.
doSomething(veryDescriptiveArgumentNumberOne, veryDescriptiveArgumentTwo,
    tableModelEventHandlerProxy, artichokeDescriptorAdapterIterator) {
  // …
}

// Four-space, one argument per line.  Works with long function names,
// survives renaming, and emphasizes each argument.
doSomething(
    veryDescriptiveArgumentNumberOne,
    veryDescriptiveArgumentTwo,
    tableModelEventHandlerProxy,
    artichokeDescriptorAdapterIterator) {
  // …
}
```

## 4.7 分组括号:推荐

可选的分组括号只有在作者和审稿人一致认为没有括号，代码就不会被误读的情况下才会被省略，也不会使代码更易于阅读。假设每个读取器都记住了整个运算符优先表是不合理的。
在delete、typeof、void、return、throw、case、in、of或yield后面的整个表达式中不要使用不必要的括号。
类型类型转换需要圆括号:```/** @type {!Foo} * / (Foo)```。

## 4.8 注释

本节讨论实现注释。JSDoc在[7 JSDoc](https://google.github.io/styleguide/jsguide.html#jsdoc) 中单独处理。

### 4.8.1 块级注释样式

块注释被缩进到与周围代码相同的级别。它们可能是/*…*/ 或 // 风格的。对于多行/*…*/ 注释，随后的行必须以与前一行 * 对齐的 * 开始，以使注释明显而没有额外的上下文。
```
/*
 * This is
 * okay.
 */

// And so
// is this.

/* This is fine, too. */
```
注释不包括在带有星号或其他字符的框中。
不要使用JSDoc(```/ **…* /```) 作为实现注释。

### 4.8.2 参数名注释

当值和方法名不能充分表达其含义时，应使用“参数名”注释，重构方法以使其更清晰是不可行的。他们的首选格式是在值之前加"=":
```
someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');
```
为了与周围的代码保持一致，你可以把他们放在值的后面并且没有"=":
```
someFunction(obviousParam, true /* shouldRender */, 'hello' /* name */);
```

# 5 语言特点

JavaScript包含许多可疑(甚至危险)的特性。本节描述哪些功能可以使用，哪些不可以使用，以及对它们的使用的任何附加限制。

## 5.1 局部变量声明

### 5.1.1使用const和let

使用const或let声明所有局部变量。默认情况下使用const，除非需要重新分配变量。不能使用var关键字。

### 5.1.2 一次只声明一个变量

每个局部变量声明只声明一个变量:声明如让a = 1, b = 2;不常用。

### 5.1.3 在需要时声明，并尽快初始化

局部变量通常不在其包含的块或类似块的构造的开始处声明。相反，局部变量被声明在它们第一次使用的地方附近(在合理范围内)，以最小化它们的作用域。

### 5.1.4 根据需要声明类型

如果没有其他JSDoc，可以在声明上方的行中添加JSDoc类型注释，或者在变量名之前内联添加注释。
例如：
```
const /** !Array<number> */ data = [];

/**
 * Some description.
 * @type {!Array<number>}
 */
const data = [];
```
不允许混合内联和JSDoc样式:编译器将只处理第一个JSDoc，内联注释将丢失。
禁止：
```
/** Some description. */
const /** !Array<number> */ data = [];
```
>**提示:在很多情况下，编译器可以推断出模板化的类型，但不能推断出它的参数。当初始化文字或构造函数调用不包含模板参数类型的任何值(例如，空数组、对象、映射或集合)，或者变量在闭包中被修改时，尤其如此。局部变量类型注释在这些情况下特别有用，否则编译器将推断模板参数为未知。**

## 5.2 数组常量

### 5.2.1 使用后续逗号

当最后一个元素和结束括号之间有一个换行符时，在后面加上逗号。
例如：
```
const values = [
  'first value',
  'second value',
];
```

### 5.2.2 不使用可变数组构造函数

如果添加或删除参数，构造函数很容易出错。使用文字来代替。
禁止：
```
const a1 = new Array(x1, x2, x3);
const a2 = new Array(x1, x2);
const a3 = new Array(x1);
const a4 = new Array();
```
除第三种情况外，其他情况与预期一致:如果x1是一个整数，那么a3就是一个大小为x1的数组，其中所有元素都是未定义的。如果x1是其他任何数字，则抛出异常，如果不是数字，则抛出单元素数组。
相反,写：
```
const a1 = [x1, x2, x3];
const a2 = [x1, x2];
const a3 = [x1];
const a4 = [];
```
在适当的时候，允许使用新数组(长度)显式地分配给定长度的数组。

### 5.2.3 非数值的属性

不要在数组上定义或使用非数值属性(长度除外)。使用Map(或对象)代替。

### 5.2.4 重构

可以在赋值的左侧使用数组文字来执行解构赋值(例如从单个数组或i迭代中解包多个值时)。可以包含最后一个rest元素(在…之间没有空格和变量名)。
如果元素是不使用的，就应该忽略它们。
```
const [a, b, c, ...rest] = generateResults();
let [, b,, d] = someArray;
```
也可以对函数参数使用解构赋值(注意，需要一个参数名，但忽略它)。如果解构赋值数组参数是可选的，则始终指定[]为默认值，并在左侧提供默认值:
```
/** @param {!Array<number>=} param1 */
function optionalDestructuring([a = 4, b = 2] = []) { … };
```
禁止：
```
function badDestructuring([a, b] = [4, 2]) { … };
```
>**提示:对于(un)将多个值打包到函数的参数或返回中，尽可能选择对象解构赋值而不是数组解构赋值，因为它允许命名单个元素并为每个元素指定不同的类型。**

### 5.2.5 展开操作符

数组字面量可以包括展开操作符(…)，以将一个或多个其他迭代的元素压平。应该使用扩展操作符，而不是使用更笨拙的Array.prototype构造。后面没有空格…
例如：
```
[...foo]   // preferred over Array.prototype.slice.call(foo)
[...foo, ...bar]   // preferred over foo.concat(bar)
```

## 5.3 对象字面量

### 5.3.1 使用后续逗号

当在final属性和右大括号之间有换行符时，在后面加上逗号。

### 5.3.2 不要使用对象构造函数

虽然对象不具有与数组相同的问题，但仍然不允许它具有一致性。使用对象文字({}或{a: 0, b: 1, c: 2})代替。

### 5.3.3 不要混合引用键和非引用键

对象文字可以表示结构(使用未引用的键和/或符号)或词典(使用引用的和/或计算的键)。不要在单个对象文字中混合这些键类型。
禁止：
```
{
  width: 42, // struct-style unquoted key
  'maxWidth': 43, // dict-style quoted key
}
```
这也扩展到将属性名传递给函数，比如hasOwnProperty。特别是，这样做会破坏已编译的代码，因为编译器无法重命名/混淆字符串文字。
不允许:
```
/** @type {{width: number, maxWidth: (number|undefined)}} */
const o = {width: 42};
if (o.hasOwnProperty('maxWidth')) {
  ...
}
```
最好的实现如下:
```
/** @type {{width: number, maxWidth: (number|undefined)}} */
const o = {width: 42};
if (o.maxWidth != null) {
  ...
}
```

### 5.3.4 计算属性名

允许计算属性名(例如，```{['key' + foo(): 42}): 42})，```它们被认为是字典样式(引用)的键(例如除非计算的属性是一个[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) (例如，[Symbol.iterator])。枚举值也可以用于计算的键，但不应与非枚举键在同一文本中混合使用。

### 5.3.5 方法简写

可以使用方法简写({method(){…}})在对象文字上定义方法，以代替紧跟在函数或箭头函数文字后面的冒号。
例如：
```
return {
  stuff: 'candy',
  method() {
    return this.stuff;  // Returns 'candy'
  },
};
```
请注意，在方法简写或函数中，this指的是对象文字本身，而在箭头函数中，this指的是对象文字之外的范围。
例如：
```
class {
  getObjectLiteral() {
    this.stuff = 'fruit';
    return {
      stuff: 'candy',
      method: () => this.stuff,  // Returns 'fruit'
    };
  }
}
```

### 5.3.6 简写属性

允许在对象文字上使用简写属性。
例如：
```
const foo = 1;
const bar = 2;
const obj = {
  foo,
  bar,
  method() { return this.foo + this.bar; },
};
assertEquals(3, obj.method());
```

### 5.3.7 解构赋值

对象解构模式可用于赋值的左侧，以执行解构并从单个对象解包多个值。
被解构的对象也可以用作函数参数，但是应该尽可能地保持简单:一个单级的未引用的简写属性。更深层次的嵌套和计算属性不能用于参数解构。在解构参数的左边指定默认值({str = 'some default'} ={}，而不是{str} = {str: 'some default'})，如果解构对象本身是可选的，那么它必须默认为{}。解构参数的JSDoc可以被赋予任何名称(名称是未使用的，但是编译器需要它)。
例如：
```
/**
 * @param {string} ordinary
 * @param {{num: (number|undefined), str: (string|undefined)}=} param1
 *     num: The number of times to do something.
 *     str: A string to do stuff to.
 */
function destructured(ordinary, {num, str = 'some default'} = {})
```
不允许：
```
/** @param {{x: {num: (number|undefined), str: (string|undefined)}}} param1 */
function nestedTooDeeply({x: {num, str}}) {};
/** @param {{num: (number|undefined), str: (string|undefined)}=} param1 */
function nonShorthandProperty({num: a, str: b} = {}) {};
/** @param {{a: number, b: number}} param1 */
function computedKey({a, b, [a + b]: c}) {};
/** @param {{a: number, b: string}=} param1 */
function nontrivialDefault({a, b} = {a: 2, b: 4}) {};
```
解构也可以用于goog。require语句，在这种情况下不能换行:整个语句占用一行，不管它有多长(详情请参见[3.6 goog.require和goog.requireType声明](https://google.github.io/styleguide/jsguide.html#file-goog-require) )。

### 5.3.8 枚举

枚举是通过向对象文字添加@enum注释来定义的。在enum定义之后，不能添加任何属性。枚举必须是常量，并且所有枚举值必须是不可变的。
```
/**
 * Supported temperature scales.
 * @enum {string}
 */
const TemperatureScale = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
};

/**
 * An enum with two options.
 * @enum {number}
 */
const Option = {
  /** The option used shall have been the first. */
  FIRST_OPTION: 1,
  /** The second among two options. */
  SECOND_OPTION: 2,
};
```

## 5.4 类

### 5.4.1 构造函数

构造函数是可选的。在设置任何字段或以其他方式访问它之前，子类构造函数必须调用super()。接口应该在构造函数中声明非方法属性。

### 5.4.2 字段

在构造函数中设置一个具体对象的所有字段(即除了方法之外的所有属性)。从不使用@const重新赋值的字段(这些字段不需要是深度不可变的)。使用适当的可见性注释注释非公共字段(@private， @protected， @package)，并以下划线结束所有@private字段的名称。字段从不设置在具体类的原型上。
```
class Foo {
  constructor() {
    /** @private @const {!Bar} */
    this.bar_ = computeBar();

    /** @protected @const {!Baz} */
    this.baz = computeBaz();
  }
}
```
> **提示:在构造函数完成后，不应该向实例中添加或从实例中删除属性，因为这极大地阻碍了VMs的优化能力。如果需要，以后初始化的字段应该在构造函数中显式地设置为undefined，以防止以后的形状更改。向对象添加@struct将检查未声明的属性是否被添加/访问。默认情况下，类会添加这个。**

### 5.4.3 计算属性

计算属性只能在属性为符号的类中使用。不允许使用字典样式的属性(即引用或计算的非符号键，如[5.3.3不要混合引用和非引用键](https://google.github.io/styleguide/jsguide.html#features-objects-mixing-keys) )。一个[Symbol.iterator]方法应该应该为逻辑上可迭代的任何类定义。除此之外，符号应该谨慎使用。
>**提示:小心使用任何其他内置的符号(例如，Symbol.isConcatSpreadable)，因为编译器不会填充它们，因此在旧的浏览器中不能工作。**

### 5.4.4 静态方法

在不影响可读性的情况下，最好使用模块本地函数而不是私有静态方法。
静态方法应该只在基类本身上调用。静态方法不应该在包含动态实例的变量上调用，动态实例可以是构造函数，也可以是子类的构造函数(如果这样做了，必须用@nocollapse来定义)，而且不能直接在没有定义方法本身的子类上调用。
不予许：
```
class Base { /** @nocollapse */ static foo() {} }
class Sub extends Base {}
function callFoo(cls) { cls.foo(); }  // discouraged: don't call static methods dynamically
Sub.foo();  // Disallowed: don't call static methods on subclasses that don't define it themselves
```

### 5.4.5老式类声明

虽然ES6类是首选的，但是在某些情况下，ES6类可能是不可行的。例如:
1.如果一个类存在或将存在子类，包括创建子类的框架，则不能立即更改为使用ES6类语法。如果这个类要使用ES6语法，则需要修改所有不使用ES6类语法的下游子类。
2.框架在调用继承构造函数之前需要一个已知的this值，由于具有ES6构造函数的继承在调用super返回之前不能访问实例this值。
在所有其他方面，样式指南仍然适用于这段代码:let、const、默认参数、rest和箭头函数都应该在适当的时候使用。
goog.defineClass允许类似于ES6类语法的类定义:
```
let C = goog.defineClass(S, {
  /**
   * @param {string} value
   */
  constructor(value) {
    S.call(this, 2);
    /** @const */
    this.prop = value;
  },

  /**
   * @param {string} param
   * @return {number}
   */
  method(param) {
    return 0;
  },
});
```
另外，虽然所有新代码都应该首选goog.defineClass，但也允许使用更传统的语法。
```
/**
  * @constructor @extends {S}
  * @param {string} value
  */
function C(value) {
  S.call(this, 2);
  /** @const */
  this.prop = value;
}
goog.inherits(C, S);

/**
 * @param {string} param
 * @return {number}
 */
C.prototype.method = function(param) {
  return 0;
};
```
每个实例的属性应该在调用super class后在构造函数中定义，如果有super class的话。方法应该在构造函数的原型上定义。
正确定义构造函数原型层次结构比它最初看起来要困难!因此，最好使用goog.inherits从[闭包库](http://code.google.com/closure/library/) 继承。

### 5.4.6 不直接操作原型

class关键字允许定义比prototype属性更清晰、更易读的类定义。普通的实现代码没有操作这些对象的业务，尽管它们对于定义[5.4.5旧式类声明中定义的类](https://google.github.io/styleguide/jsguide.html#features-classes-old-style) 仍然很有用。混合和修改内装对象的原型是明确禁止的。
例外:框架代码(如聚合体或Angular)可能需要使用原型，而不应该使用更糟糕的变通方法来避免这样做。

### 5.4.7 Getters and Setters

不要用JavaScript的[getter and setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) 属性。它们可能会让人感到惊讶，并且很难进行理解，而且在编译器中对它们的支持也很有限。提供普通的方法。 	
例外:在某些情况下，定义getter或setter是不可避免的(例如，Angular和Polymer等数据绑定框架，或者为了与无法调整的外部api兼容)。仅在这些情况下，如果使用get和set简写方法关键字或Object.defineProperties(而不是Object.defineProperty，它会干扰属性的重命名)来定义getter和setter，则可以谨慎使用。getter不能改变可观察状态。
不允许：
```
class Foo {
  get next() { return this.nextId++; }
}
```

### 5.4.8 重toString

toString方法可以被重写，但必须始终成功，并且不会有可见的副作用。

提示:特别要注意从toString调用其他方法，因为异常条件可能导致无限循环。

### 5.4.9 接口

接口可以用@interface或@record声明。使用@record声明的接口可以是显式的(即通过@implements)，也可以是由类或对象文字隐式实现的。
接口上的所有非静态方法体必须是空块。字段必须在类构造函数中声明为未初始化的成员。
例如：
```
/**
 * Something that can frobnicate.
 * @record
 */
class Frobnicator {
  constructor() {
    /** @type {number} The number of attempts before giving up. */
    this.attempts;
  }

  /**
   * Performs the frobnication according to the given strategy.
   * @param {!FrobnicationStrategy} strategy
   */
  frobnicate(strategy) {}
}
```

### 5.4.10 抽象类

在适当的时候使用抽象类。抽象类和方法必须用@abstract注释。不要使用goog.abstractMethod。参见[抽象类和方法](https://github.com/google/closure-compiler/wiki/@abstract-classes-and-methods) 。

## 5.5 函数

### 5.5.1 顶级functions

运算层函数可以直接在导出对象上定义，也可以在本地声明，也可以导出。更多的导出信息请参考[3.3.3 goog.module Exports](https://google.github.io/styleguide/jsguide.html#file-goog-module-exports) 。
例如：
```
/** @param {string} str */
exports.processString = (str) => {
  // Process the string.
};
```
```
/** @param {string} str */
const processString = (str) => {
  // Process the string.
};

exports = {processString};
```

### 5.5.2 嵌套的函数和闭包

函数可以包含嵌套的函数定义。如果给函数起一个名字很有用，那么应该把它分配给一个本地常量。

### 5.5.3 箭头函数

箭头函数提供了简洁的函数语法，并简化了嵌套函数的作用域。更喜欢箭头函数而不是function关键字，特别是对于嵌套函数(请参考[5.3.5 Method shorthand](https://google.github.io/styleguide/jsguide.html#features-objects-method-shorthand) ).

更喜欢箭头函数，而不是其他这种作用域方法，如f.b bind(this)， goog.bind(f, this)， const self = this。箭头函数在调用回调时特别有用，因为它允许显式地指定要传递给回调的参数，而绑定将盲目地传递所有参数。

箭头左侧包含零个或多个参数。如果只有一个非析构参数，则参数周围的括号是可选的。使用括号时，可以指定内联参数类型(请参考{7.8 Method and function comments](https://google.github.io/styleguide/jsguide.html#jsdoc-method-and-function-comments) )。

>**提示:即使对于单参数箭头函数，始终使用圆括号也可以避免添加参数，但是忘记添加圆括号可能导致可解析代码不能正常工作的情况。**

默认情况下，主体是一个块语句(由花括号包围的零个或多个语句)。如果程序逻辑需要返回一个值，或者void操作符位于单个函数或方法调用之前(使用void可以确保返回未定义的值，防止泄漏值，并传递意图)，则body也可以是隐式返回的单个表达式。如果单表达式形式可以提高可读性(例如，对于简短或简单的表达式)，则更可取。
例子:
```
/**
 * Arrow functions can be documented just like normal functions.
 * @param {number} numParam A number to add.
 * @param {string} strParam Another number to add that happens to be a string.
 * @return {number} The sum of the two parameters.
 */
const moduleLocalFunc = (numParam, strParam) => numParam + Number(strParam);

// Uses the single expression syntax with `void` because the program logic does
// not require returning a value.
getValue((result) => void alert(`Got ${result}`));

class CallbackExample {
  constructor() {
    /** @private {number} */
    this.cachedValue_ = 0;

    // For inline callbacks, you can use inline typing for parameters.
    // Uses a block statement because the value of the single expression should
    // not be returned and the expression is not a single function call.
    getNullableValue((/** ?number */ result) => {
      this.cachedValue_ = result == null ? 0 : result;
    });
  }
}
```
不允许：
```
/**
 * A function with no params and no returned value.
 * This single expression body usage is illegal because the program logic does
 * not require returning a value and we're missing the `void` operator.
 */
const moduleLocalFunc = () => anotherFunction();
```

### 5.5.4 生成器

生成器支持许多有用的抽象，可以根据需要使用。

定义生成器函数时，将```*```附加到函数关键字时，用空格和函数名隔开。当授权生成，将```*```附加到yield关键字。
例如:
```
/** @return {!Iterator<number>} */
function* gen1() {
  yield 42;
}

/** @return {!Iterator<number>} */
const gen2 = function*() {
  yield* gen1();
}

class SomeClass {
  /** @return {!Iterator<number>} */
  * gen() {
    yield 42;
  }
}
```

### 5.5.5 参数和返回类型

函数参数和返回类型通常应该用JSDoc注释记录下来。更多信息请参考[ 7.8 Method and function comments](https://google.github.io/styleguide/jsguide.html#jsdoc-method-and-function-comments) 。

#### 5.5.5.1 默认参数

可选参数允许使用参数列表中的equals操作符。可选参数必须在equals操作符的两边都有空格，它们的名称必须与required参数(即，不带opt_前缀)，在其JSDoc类型中使用=后缀，在必需的参数之后，并且不使用产生可见副作用的初始化器。具体函数的所有可选参数都必须有默认值，即使该值未定义。与具体函数相比，抽象方法和接口方法必须省略默认的参数值。
例如：
```
/**
 * @param {string} required This parameter is always needed.
 * @param {string=} optional This parameter can be omitted.
 * @param {!Node=} node Another optional parameter.
 */
function maybeDoSomething(required, optional = '', node = undefined) {}

/** @interface */
class MyInterface {
  /**
   * Interface and abstract methods must omit default parameter values.
   * @param {string=} optional
   */
  someMethod(optional) {}
}
```
少用默认参数。最好使用析构(如[5.3.7中的析构](https://google.github.io/styleguide/jsguide.html#features-objects-destructuring) )来创建可读的api，因为有很多可选参数没有自然顺序。
>**注意:与Python的默认参数不同，可以使用返回新的可变对象(如{}或[])的初始化器，因为初始化器是在每次使用默认值时求值的，所以单个对象不会在调用之间共享。**

>**提示:尽管包括函数调用在内的任意表达式都可以用作初始化器，但这些初始化器应该尽可能简单。避免暴露共享可变状态的初始化器，因为它们很容易在函数调用之间引入意外的耦合。**

#### 5.5.5.2 Rest参数

使用rest参数而不是访问参数。Rest参数的类型是…前缀在它们的JSDoc中。rest参数必须是列表中的最后一个参数。之间没有空格。以及参数名。不要将rest参数命名为var_args。不要命名局部变量或参数参数，否则会混淆内建名称。
例子:
```
/**
 * @param {!Array<string>} array This is an ordinary parameter.
 * @param {...number} numbers The remainder of arguments are all numbers.
 */
function variadic(array, ...numbers) {}
```

### 5.5.6 泛型

必要时，在函数或方法定义之上的JSDoc中使用@template类型声明泛型函数和方法。

### 5.5.7 spread操作符

函数调用可以使用spread操作符(…)。与Function.prototype相比，更喜欢spread操作符。当数组或迭代被拆包成可变参数函数的多个参数时应用。后面没有空格…

例如：
```
function myFunction(...elements) {}
myFunction(...array, ...iterable, ...generator());
```

## 5.6 字符串

### 5.6.1 使用单引号

普通字符串用单引号(')分隔，而不是双引号(")。
>**提示:如果字符串包含单引号字符，可以考虑使用模板字符串来避免转义引号。**
普通的字符串字面值不能跨越多行。

### 5.6.2 模板文字

在复杂的字符串连接上使用模板文字(用``` ` ``` 分隔)，特别是涉及多个字符串文字时。模板文字可以跨越多行。
如果一个模板文本跨越多行，那么它就不需要遵循封闭块的缩进，尽管如果添加的空白不重要，它也可以这样做。
例如：
```
function arithmetic(a, b) {
  return `Here is a table of arithmetic operations:
${a} + ${b} = ${a + b}
${a} - ${b} = ${a - b}
${a} * ${b} = ${a * b}
${a} / ${b} = ${a / b}`;
}
```

### 5.6.3 不要行延续

无论在普通字符串还是模板字符串中，都不要使用行延续(即，在字符串文字中以反斜杠结束一行)。尽管ES5允许这样做，但如果在斜杠之后出现任何尾随空格，则会导致一些棘手的错误，而且对读者来说不太明显。
不允许：
```
const longString = 'This is a very long string that far exceeds the 80 \
    column limit. It unfortunately contains long stretches of spaces due \
    to how the continued lines are indented.';
```
相反，应该：
```
const longString = 'This is a very long string that far exceeds the 80 ' +
    'column limit. It does not contain long stretches of spaces since ' +
    'the concatenated strings are cleaner.';
```

## 5.7 数字

数字可以指定为十进制、十六进制、八进制或二进制。对十六进制、八进制和二进制分别使用小写字母的0x、0o和0b前缀。除非紧跟x、o或b，否则不要包含前导零。

## 5.8 控制解构

### 5.8.1 for循环

在ES6中，该语言现在有三种不同的for循环。所有循环都可以使用，但如果可能，for-of循环应该是首选的。
for-in循环只能用于字典样式的对象 (参考 [5.3.3 Do not mix quoted and unquoted keys](https://google.github.io/styleguide/jsguide.html#features-objects-mixing-keys) )，而且不应用于对数组进行迭代。Object.prototype.hasOwnProperty应该在for-in循环中使用，以排除不需要的原型属性。
如果可能的话，将键移到for-in。

### 5.8.2 异常

异常是语言的重要组成部分，应该在异常情况发生时使用。总是抛出错误或错误的子类:永远不要抛出字符串或其他对象。在构造错误时始终使用new。
这种处理扩展到承诺拒绝值作为承诺。拒绝(obj)等同于抛出obj;在异步功能。
自定义异常提供了从函数传递附加错误信息的好方法。它们应该在本机错误类型不足的地方定义和使用。
宁可抛出异常，也不要使用特别的错误处理方法(例如传递错误容器引用类型，或返回带有错误属性的对象)。

#### 5.8.2.1 空的catch块

对捕获的异常不做任何响应是非常不正确的。当在catch块中真正适合不采取任何操作时，就会在注释中解释为什么这样做是合理的。
例如：
```
try {
  return handleNumericResponse(response);
} catch (ok) {
  // it's not numeric; that's fine, just continue
}
return handleTextResponse(response);
```
不允许:
```
try {
    shouldFail();
    fail('expected an error');
  } catch (expected) {
  }
```
>**提示:与其他一些语言不同，上面这样的模式根本不起作用，因为它会捕获fail抛出的错误。使用assertThrows ()。**

### 5.8.3 Switch声明

术语注意:在switch块的大括号中有一个或多个语句组。每个语句组由一个或多个开关标签(FOO:或default:)组成，后面跟着一个或多个语句。

#### 5.8.3.1 抛出失败：注释

在一个switch块中，每个语句组要么突然终止(使用中断、返回或抛出异常)，要么用注释标记，表明执行将或可能继续到下一个语句组。任何传达“失败”概念的注释都是足够的(通常是//失败)。在switch块的最后一个语句组中不需要这个特殊的注释。
例如：
```
switch (input) {
  case 1:
  case 2:
    prepareOneOrTwo();
  // fall through
  case 3:
    handleOneTwoOrThree();
    break;
  default:
    handleLargeNumber(input);
}
```

#### 5.8.3.2 默认情况是存在的

每个switch语句都包含一个默认语句组，即使它不包含任何代码。默认语句组必须是最后一个。

## 5.9 this

只在类构造函数和方法中使用这个方法，在类构造函数和方法中定义的箭头函数中使用这个方法，或者在直接封闭函数的JSDoc中声明显式@this的函数中使用这个方法。
不要使用它来引用全局对象、eval的上下文、事件的目标，或者不必要地调用()ed或apply()ed函数。

## 5.10 等式检查

使用标识符操作符(===/!==)，但以下文档中记录的情况除外。

### 5.10.1 需要强制的例外

捕捉空值和未定义的值:
```
if (someObjectOrPrimitive == null) {
  // Checking for null catches both null and undefined for objects and
  // primitives, but does not catch other falsy values like 0 or the empty
  // string.
}
```

## 5.11 不允许的功能

### 5.11.1 with

不要使用with关键字。它使你的代码更难理解，并已被禁止在严格模式自ES5。

### 5.11.2 动态代码评估

不要使用eval或Function(…string)构造函数(代码加载器除外)。这些特性具有潜在的危险性，在CSP环境中根本无法工作。

### 5.11.3 自动插入分号

总是使用分号结束语句(除了上面提到的函数和类声明)。

### 5.11.4 非标准的特性

不要使用非标准的特性。这包括已经删除的旧特性(如WeakMap.clear)、尚未标准化的新特性(如当前的TC39工作草案、任何阶段的建议、或提出但尚未完成的web标准)、或只在某些浏览器中实现的专有特性。只使用当前ECMA-262或WHATWG标准中定义的特性。(请注意，项目是根据特定的api来编写的，比如Chrome扩展或Node。显然可以使用这些api)。不允许使用非标准语言“扩展”(例如一些外部转置器提供的扩展)。

### 5.11.5 用于基本类型的包装器对象

不要在原始对象包装器(布尔值、数字、字符串、符号)上使用new，也不要在类型注释中包含它们。
不允许：
```
const /** Boolean */ x = new Boolean(false);
if (x) alert(typeof x);  // alerts 'object' - WAT?
```
包装器可以作为强制(这比使用+或连接空字符串更好)或创建符号的函数调用。
例子:
```
const /** boolean */ x = Boolean(0);
if (!x) alert(typeof x);  // alerts 'boolean', as expected
```

### 5.11.6 修改内建对象

永远不要修改内建类型，无论是通过向它们的构造函数添加方法还是向它们的原型添加方法。避免依赖这样做的库。请注意，JSCompiler的运行时库将在可能的地方提供符合标准的填充;其他任何东西都不能修改内建对象。
除非绝对必要，否则不要向全局对象添加符号(例如，第三方API所要求的)。

### 5.11.7 调用构造函数时省略()

如果不使用括号()，永远不要在新语句中调用构造函数。
不允许:
```
new Foo;
```
使用：
```
new Foo();
```
省略括号可能会导致一些细微的错误。这两行不相等:
```
new Foo().Bar();
new Foo.Bar();
```

# 6 命名

## 6.1 所有标识符通用的规则

标识符仅使用ASCII字母和数字，在下面提到的少数情况下，还使用下划线，很少使用美元符号(Angular等框架需要时)。

在合理的范围内，尽可能给出一个描述性的名字。不要担心节省水平空间，因为让新读者立即理解您的代码要重要得多。不要使用对您的项目之外的读者来说是模糊或不熟悉的缩写，也不要通过删除一个单词中的字母来缩写。
例如：
```
errorCount          // No abbreviation.
dnsConnectionIndex  // Most people know what "DNS" stands for.
referrerUrl         // Ditto for "URL".
customerId          // "Id" is both ubiquitous and unlikely to be misunderstood.
```
不允许：
```
n                   // Meaningless.
nErr                // Ambiguous abbreviation.
nCompConns          // Ambiguous abbreviation.
wgcConnections      // Only your group knows what this stands for.
pcReader            // Lots of things can be abbreviated "pc".
cstmrId             // Deletes internal letters.
kSecondsPerDay      // Do not use Hungarian notation.
```

## 6.2 标识符类型规则

### 6.2.1 包名

包名都是小写的。例如，my.exampleCode.deepSpace，而不是my.exampleCode.deepSpace或my.example_code.deep_space。

### 6.2.2 类名

类、接口、记录和typedef名称都是用UpperCamelCase编写的。未导出的类只是局部变量:它们没有标记为@private，因此没有以下划线结尾进行命名。

类型名通常是名词或名词短语。例如，Request、ImmutableList或VisibilityMode。此外，接口名有时可能是形容词或形容词短语(例如，可读的)。

### 6.2.3 方法名

方法名以小写字母书写。@private方法的名称必须以下划线结尾。

方法名通常是动词或动词短语。例如，sendMessage或stop_。属性的Getter和setter方法从来都不是必需的，但是如果使用它们，则应该将它们命名为getFoo(对于布尔值，可选为isFoo或hasFoo)，对于setter，则命名为setFoo(value)。
下划线也可能出现在JsUnit测试方法名称中，以分隔名称的逻辑组件。一个典型的模式是test<MethodUnderTest>_<state>_<expectedOutcome>，例如testpop_emptystack_throw。没有一种正确的方法来命名测试方法。

### 6.2.4 枚举名称

枚举名是用大写字母书写的，类似于类，一般应该是单数名词。枚举中的各个项在CONSTANT_CASE中命名。

### 6.2.5 常量名

常量名称使用CONSTANT_CASE:所有大写字母，单词由下划线分隔。没有理由使用一个以下划线结尾的常量来命名，因为私有静态属性可以被(隐式私有)模块局部变量替换。

#### 6.2.5.1 常量的定义

每个常量都是一个@const静态属性或一个模块-局部const声明，但并不是所有的@const静态属性和模块-局部const都是常量。在选择常量case之前，请考虑字段是否真的像一个深度不可变的常量。例如，如果该实例的任何可见状态可以改变，那么它几乎肯定不是一个常量。仅仅打算永远不改变对象通常是不够的。
例如:
```
// Constants
const NUMBER = 5;
/** @const */ exports.NAMES = ImmutableList.of('Ed', 'Ann');
/** @enum */ exports.SomeEnum = { ENUM_CONSTANT: 'value' };

// Not constants
let letVariable = 'non-const';
class MyClass { constructor() { /** @const {string} */ this.nonStatic = 'non-static'; } };
/** @type {string} */ MyClass.staticButMutable = 'not @const, can be reassigned';
const /** Set<string> */ mutableCollection = new Set();
const /** ImmutableSet<SomeMutableType> */ mutableElements = ImmutableSet.of(mutable);
const Foo = goog.require('my.Foo');  // mirrors imported name
const logger = log.getLogger('loggers.are.not.immutable');
```
常量的名称通常是名词或名词短语。

#### 6.2.5.2 本地别名

当局部别名比完全限定名更易于阅读时，应该使用它们。

遵循与goog.require相同的规则([3.6 goog.require and goog.requireType statements](https://google.github.io/styleguide/jsguide.html#file-goog-require) ),保持别名名称的最后一部分。别名也可以在函数中使用。别名必须是常量。
例如:
```
const staticHelper = importedNamespace.staticHelper;
const CONSTANT_NAME = ImportedClass.CONSTANT_NAME;
const {assert, assertInstanceof} = asserts;
```

### 6.2.6 不恒定字段名称

非常量字段名(静态或其他)以小写书写，私有字段以下划线结尾。
这些名称通常是名词或名词短语。例如，computedValues或index_。

### 6.2.7 参数名称

参数名以小写字母书写。注意，即使参数需要一个构造函数，这也是适用的。
单字符参数名不应在公共方法中使用。

例外:当第三方框架需要时，参数名可以以$开头。此异常不适用于任何其他标识符(例如，局部变量或属性)。

### 6.2.8 局部变量名称

除了上面描述的模块本地(顶级)常量之外，局部变量名都是用小写字母书写的。函数作用域中的常量仍然以小写形式命名。注意，使用lowerCamelCase，即使该变量包含一个构造函数。

### 6.2.9 模板参数名称

模板参数名应该简洁，单字或单字母标识符，并且必须是全大写的，例如TYPE或THIS。

### 6.2.10 Module-local名字

没有导出的模块本地名称是隐式私有的。它们没有标记为@private，也没有以下划线结尾。这适用于类、函数、变量、常量、枚举和其他模块本地标识符。

## 6.3 驼峰式大小写:定义

有时，有不止一种合理的方法可以将英语短语转换成驼背形式，比如在出现缩写词或IPv6或iOS等不常见结构时。为了提高可预测性，谷歌样式指定了以下(近似)确定性方案。

从名字的散文形式开始:
1.将短语转换为普通ASCII并删除所有撇号。例如，Muller的算法可能变成Muellers算法。
2.将结果分成单词，空格和任何剩余的标点符号(通常是连字符)。
建议:如果任何一个单词在日常使用中已经有了传统的驼峰式外观，那么将其分解成它的组成部分(例如，AdWords变成ad words)。请注意，像iOS这样的单词本身并不是驼峰式的;它违反任何惯例，因此本建议不适用。
3.现在小写的一切(包括首字母缩写)，然后大写只有第一个字符:
..每个字，以产生上驼峰格，或
除了第一个词外，每个词都能产生较低的驼峰
4.最后，将所有单词连接到单个标识符中。
请注意，原词的外壳几乎完全被忽略了。
例如：
|Prose form|Correct|Incorrect|
| --- | --- | --- |
|XML HTTP request|XmlHttpRequest|XMLHTTPRequest|
|new customer ID|	newCustomerId|	newCustomerID|
|inner stopwatch|	innerStopwatch	|innerStopWatch|
|supports IPv6 on iOS?	|supportsIpv6OnIos	|supportsIPv6OnIOS|
|YouTube importer	|YouTubeImporter	|YoutubeImporter*|
可接受，但不推荐。
>**注意:英语中有些单词的连字符是含糊不清的:例如nonempty和non-empty都是正确的，因此方法名checkNonempty和checkNonempty同样也是正确的。**

# 7 JSDoc

[JSDoc](https://developers.google.com/closure/compiler/docs/js-for-compiler) 用于所有类、字段和方法。

## 7.1 通用式

JSDoc块的基本格式如下例所示:
```
/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param {number} arg A number to do something to.
 */
function doSomething(arg) { … }
```
或者在这个单行的例子中:
```
/** @const @private {!Foo} A short bit of JSDoc. */
this.foo_ = foo;
```
如果单行注释溢出到多行，它必须在自己的行上使用```/**和*/``` 的多行样式。
许多工具从JSDoc注释中提取元数据来执行代码验证和优化。因此，这些注释必须是格式良好的。

## 7.2 

JSDoc是用Markdown编写的，尽管它可能在必要时包含HTML。

注意，自动提取JSDoc的工具(例如[JsDossier](https://github.com/jleyba/js-dossier) )通常会忽略纯文本格式，所以如果你这样做:
```
/**
 * Computes weight based on three factors:
 *   items sent
 *   items received
 *   last timestamp
 */
```
结果是这样的:
```
Computes weight based on three factors: items sent items received last timestamp
```
相反，写一个Markdown列表:
```
/**
 * Computes weight based on three factors:
 *
 *  - items sent
 *  - items received
 *  - last timestamp
 */
```

## 7.3 JSDoc标签

谷歌样式允许JSDoc标记的一个子集。完整列表参考[9.1 JSDoc标记]。大多数标记必须占据它们自己的行，标记位于行首。
不允许：
```
/**
 * The "param" tag must occupy its own line and may not be combined.
 * @param {number} left @param {number} right
 */
function add(left, right) { ... }
```
不需要任何额外数据的简单标记(如@private、@const、@final、@export)可以组合在同一行中，适当时还可以加上一个可选类型。
```
/**
 * Place more complex annotations (like "implements" and "template")
 * on their own lines.  Multiple simple tags (like "export" and "final")
 * may be combined in one line.
 * @export @final
 * @implements {Iterable<TYPE>}
 * @template TYPE
 */
class MyClass {
  /**
   * @param {!ObjType} obj Some object.
   * @param {number=} num An optional number.
   */
  constructor(obj, num = 42) {
    /** @private @const {!Array<!ObjType|number>} */
    this.data_ = [obj, num];
  }
}
```
对于何时组合标记或以何种顺序组合标记没有严格的规则，但是要保持一致。
有关JavaScript中注释类型的一般信息，请参阅[ Annotating JavaScript for the Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) 和[ Types in the Closure Type System](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System) 。

## 7.4 换行

块的换行标记缩进四个空格。包装的描述文本可能与前面几行中的描述对齐，但是不建议使用这种水平对齐。
```
/**
 * Illustrates line wrapping for long param/return descriptions.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
exports.method = function(foo) {
  return 5;
};
```
包装@desc或@fileoverview描述时不要缩进。

## 7.5 前/文件级别的注释

一个文件可能有一个顶级文件概述。版权通知、作者信息和默认的[可见性级别](https://google.github.io/styleguide/jsguide.html#jsdoc-visibility-annotations) 是可选的。当一个文件包含多个类定义时，通常建议使用文件概述。顶层注释的目的是让不熟悉代码的读者了解这个文件中的内容。如果存在，它可能提供文件内容的描述和任何依赖项或兼容性信息。包装线没有缩进。
例如：
```
/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 * @package
 */
```

## 7.6 类注释

类、接口和记录必须用描述和任何模板参数、实现的接口、可见性或其他适当的标记加以记录。类描述应该为读者提供足够的信息来了解如何以及何时使用类，以及正确使用类所必需的任何其他考虑。在构造函数中可以省略文本描述。除非类用于声明@接口或扩展泛型类，否则不会将@constructor和@extends注释与类关键字一起使用。
```
/**
 * A fancier event target that does cool things.
 * @implements {Iterable<string>}
 */
class MyFancyTarget extends EventTarget {
  /**
   * @param {string} arg1 An argument that makes this more interesting.
   * @param {!Array<number>} arg2 List of numbers to be processed.
   */
  constructor(arg1, arg2) {
    // ...
  }
};

/**
 * Records are also helpful.
 * @extends {Iterator<TYPE>}
 * @record
 * @template TYPE
 */
class Listable {
  /** @return {TYPE} The next item in line to be returned. */
  next() {}
}
```

## 7.7 Enum和typedef注释

所有enum和typedefs都必须用适当的JSDoc标记(@typedef或@enum)记录在前一行。Public枚举和typedefs也必须有一个描述。个别enum项可以用前面一行上的JSDoc注释记录下来。
```
/**
 * A useful type union, which is reused often.
 * @typedef {!Bandersnatch|!BandersnatchType}
 */
let CoolUnionType;


/**
 * Types of bandersnatches.
 * @enum {string}
 */
const BandersnatchType = {
  /** This kind is really frumious. */
  FRUMIOUS: 'frumious',
  /** The less-frumious kind. */
  MANXOME: 'manxome',
};
```
Typedefs对于定义短记录类型、联合、复杂函数或泛型类型的别名非常有用。对于包含许多字段的记录类型，应该避免使用Typedefs，因为它们不允许记录单个字段，也不允许使用模板或递归引用。对于大型记录类型，最好使用@record。

## 7.8 方法和函数注释

在方法和命名函数中，必须记录参数和返回类型，除非是在相同签名@overrides的情况下，其中省略了所有类型。必要时，应将此类型记录下来。如果函数没有非空返回语句，则可以省略返回类型。

方法、参数和返回描述(但不是类型)可以省略，如果它们在方法的其余JSDoc或其签名中很明显。

方法描述以描述方法功能的动词短语开头。这个短语不是祈使句，而是用第三人称写的，在'This method'暗示之前。

如果一个方法覆盖了一个super class方法，那么它必须包含一个@override注释。覆盖的方法从super class方法(包括可视性注释)继承所有JSDoc注释，它们应该在覆盖的方法中被省略。但是，如果在类型注释中细化了任何类型，则必须显式地指定所有@param和@return注释。
```
/** A class that does something. */
class SomeClass extends SomeBaseClass {
  /**
   * Operates on an instance of MyClass and returns something.
   * @param {!MyClass} obj An object that for some reason needs detailed
   *     explanation that spans multiple lines.
   * @param {!OtherClass} obviousOtherClass
   * @return {boolean} Whether something occurred.
   */
  someMethod(obj, obviousOtherClass) { ... }

  /** @override */
  overriddenMethod(param) { ... }
}

/**
 * Demonstrates how top-level functions follow the same rules.  This one
 * makes an array.
 * @param {TYPE} arg
 * @return {!Array<TYPE>}
 * @template TYPE
 */
function makeArray(arg) { ... }
```
如果只需要记录函数的参数和返回类型，可以选择在函数签名中使用内联JSDocs。这些内联的JSDocs指定不带标记的返回和参数类型。
```
function /** string */ foo(/** number */ arg) {...}
```
如果需要描述或标记，请在方法上方使用一个JSDoc注释。例如，返回值的方法需要一个@return标记。
```
class MyClass {
  /**
   * @param {number} arg
   * @return {string}
   */
  bar(arg) {...}
}
```
不允许：
```
// Illegal inline JSDocs.

class MyClass {
  /** @return {string} */ foo() {...}
}

/** Function description. */ bar() {...}
```
在匿名函数中，注释通常是可选的。如果自动类型推断不足，或者显式注释提高了可读性，那么可以这样注释param和返回类型:
```
promise.then(
    /** @return {string} */
    (/** !Array<string> */ items) => {
      doSomethingWith(items);
      return items[0];
    });
```
对于函数类型表达式，请参考：[ 7.10.4 Function type expressions](https://google.github.io/styleguide/jsguide.html#jsdoc-function-types) 。

## 7.9 属性注释

必须记录属性类型。如果名称和类型提供了足够的文档来理解代码，则私有属性的描述可以省略。
公开导出的常量以与属性相同的方式进行注释。
```
/** My class. */
class MyClass {
  /** @param {string=} someString */
  constructor(someString = 'default string') {
    /** @private @const {string} */
    this.someString_ = someString;

    /** @private @const {!OtherType} */
    this.someOtherThing_ = functionThatReturnsAThing();

    /**
     * Maximum number of things per pane.
     * @type {number}
     */
    this.someProperty = 4;
  }
}

/**
 * The number of times we'll try before giving up.
 * @const {number}
 */
MyClass.RETRY_COUNT = 33;
```
## 7.10 类型注解

类型注释可以在@param、@return、@this和@type标记上找到，也可以在@const、@export和任何可见性标记上找到。附加到JSDoc标记的类型注释必须始终用大括号括起来。

### 7.10.1 为空

类型系统定义修饰符!和?分别为非空和可空。这些修饰符必须位于类型之前。
可空性修饰符对不同类型有不同的要求，可分为两大类:
1.原语(string, number, boolean, symbol, undefined, null)和文字({function(…):…}和{{foo: string…}})在默认情况下总是不可空的。使用?修饰符，使其为空，但省略冗余!
2.引用类型(通常是指UpperCamelCase中的任何类型，包括some.namespace.ReferenceType)引用在其他地方定义的类、enum、record或typedef。由于这些类型可以为空，也可以不为空，因此不可能仅从名称就判断它是否为空。总是使用显式?和!这些类型的修饰符，以防止在使用站点上产生歧义。
Bad:
```
const /** MyObject */ myObject = null; // Non-primitive types must be annotated.
const /** !number */ someNum = 5; // Primitives are non-nullable by default.
const /** number? */ someNullableNum = null; // ? should precede the type.
const /** !{foo: string, bar: number} */ record = ...; // Already non-nullable.
const /** MyTypeDef */ def = ...; // Not sure if MyTypeDef is nullable.

// Not sure if object (nullable), enum (non-nullable, unless otherwise
// specified), or typedef (depends on definition).
const /** SomeCamelCaseName */ n = ...;
```
Good:
```
const /** ?MyObject */ myObject = null;
const /** number */ someNum = 5;
const /** ?number */ someNullableNum = null;
const /** {foo: string, bar: number} */ record = ...;
const /** !MyTypeDef */ def = ...;
const /** ?SomeCamelCaseName */ n = ...;
```

### 7.10.2 Type Casts

如果编译器不能准确地推断出表达式的类型，函数[goog.asserts](https://google.github.io/closure-library/api/goog.asserts.html) 不能纠正它，可以通过添加类型注释注释并将表达式括在括号中来收紧类型。注意括号是必需的。
```
/** @type {number} */ (x)
```

### 7.10.3 模板参数类型

总是指定模板参数。这样编译器可以做得更好，读者也更容易理解代码的功能。
Bad:
```
const /** !Object */ users = {};
const /** !Array */ books = [];
const /** !Promise */ response = ...;
```
Good:
```
const /** !Object<string, !User> */ users = {};
const /** !Array<string> */ books = [];
const /** !Promise<!Response> */ response = ...;

const /** !Promise<undefined> */ thisPromiseReturnsNothingButParameterIsStillUseful = ...;
const /** !Object<string, *> */ mapOfEverything = {};
```
不应使用模板参数的情况:
对象用于类型层次结构，而不是类似于映射的结构。

### 7.10.4 函数类型表达式

术语注:函数类型表达式是指函数类型的类型注释，注释中使用关键字function(参见下面的示例)。
在给出函数定义的地方，不要使用函数类型表达式。使用@param和@return或内联注释指定参数和返回类型(参考[7.8 Method and function comments](https://google.github.io/styleguide/jsguide.html#jsdoc-method-and-function-comments) ,这包括匿名函数和定义并分配给const的函数(其中函数jsdoc出现在整个赋值表达式的上方)。

例如，在@typedef、@param或@return内部需要函数类型表达式。如果函数定义没有立即初始化变量或函数类型的属性，也可以使用它。
```
/** @private {function(string): string} */
  this.idGenerator_ = googFunctions.identity;
```
使用函数类型表达式时，始终显式指定返回类型。否则，默认的返回类型是unknown(?)，这会导致奇怪和意外的行为，并且很少是实际需要的。
类型错误，但没有警告:
```
/** @param {function()} generateNumber */
function foo(generateNumber) {
  const /** number */ x = generateNumber();  // No compile-time type error here.
}

foo(() => 'clearly not a number');
```
Good:
```
/**
 * @param {function(): *} inputFunction1 Can return any type.
 * @param {function(): undefined} inputFunction2 Definitely doesn't return
 *      anything.
 * NOTE: the return type of `foo` itself is safely implied to be {undefined}.
 */
function foo(inputFunction1, inputFunction2) {...}
```

### 7.10.5 空格

在类型注释中，每个逗号或冒号后面需要一个空格或换行符。可以插入额外的换行符以提高可读性或避免超过列限制。这些换行符应该按照适用的规则选择并缩进(例如[4.5 Line-wrapping](https://google.github.io/styleguide/jsguide.html#formatting-line-wrapping) 和[4.2 Block indentation: +2 spaces](https://google.github.io/styleguide/jsguide.html#formatting-block-indentation) )。类型注释中不允许有其他空白。
Good:
```
/** @type {function(string): number} */

/** @type {{foo: number, bar: number}} */

/** @type {number|string} */

/** @type {!Object<string, string>} */

/** @type {function(this: Object<string, string>, number): string} */

/**
 * @type {function(
 *     !SuperDuperReallyReallyLongTypedefThatForcesTheLineBreak,
 *     !OtherVeryLongTypedef): string}
 */

/**
 * @type {!SuperDuperReallyReallyLongTypedefThatForcesTheLineBreak|
 *     !OtherVeryLongTypedef}
 */
```
Bad:
```
// Only put a space after the colon
/** @type {function(string) : number} */

// Put spaces after colons and commas
/** @type {{foo:number,bar:number}} */

// No space in union types
/** @type {number | string} */
```

## 7.11 可见性的注释

VisibiVisibility注释(@private、@package、@protected)可以在@fileoverview块中指定，也可以在任何导出的符号或属性中指定。不要为局部变量指定可见性，无论是在函数内部还是在模块的顶层。所有@private名称必须以下划线结尾。横注释

# 8 政策

## 8.1 谷歌风格未指定的问题:保持一致!

对于本规范未明确解决的任何样式问题，请使用同一文件中的其他代码已经完成的功能。如果这还不能解决问题，可以考虑模拟同一包中的其他文件。

## 8.2 编译器警告

### 8.2.1 使用标准的警告设置

项目应尽可能使用--warning_level=VERBOSE。

### 8.2.2 如何处理警告

在做任何事情之前，确保你准确地理解了警告告诉你的东西。如果你不确定为什么会出现警告，那就寻求帮助。
一旦你理解了警告，尝试以下解决方案:
1.首先，修复它或围绕它工作。强烈尝试解决警告，或者找到另一种方法来完成完全避免这种情况的任务。
2.否则，判断它是否是假警报。如果您确信警告是无效的，并且代码实际上是安全正确的，那么添加一条注释来说服读者，并应用@suppress注释。
3.否则，请留下TODO注释。这是最后的办法。如果这样做，就不要隐藏警告。警告应该是可见的，直到它可以得到适当的处理。

### 8.2.3 在最窄的合理范围内抑制警告

警告被抑制在最窄的合理范围内，通常是单个局部变量或非常小的方法。通常提取变量或方法就是为了这个原因。
例子：
```
/** @suppress {uselessCode} Unrecognized 'use asm' declaration */
function fn() {
  'use asm';
  return 0;
}
```
即使一个类中有大量的抑制，也比让整个类对这种类型的警告视而不见要好。

## 8.3 强烈不赞成

用@deprecated注释标记已废弃的方法、类或接口。一个反对意见必须包括简单，明确的方向，让人们修复他们的电话网站。

## 8.4 代码不是谷歌风格

您偶尔会遇到代码库中不符合谷歌风格的文件。这些可能来自一次收购，也可能是在谷歌Style就某个问题表态之前写的，也可能是出于其他原因而使用非Google Style。

### 8.4.1 重新格式化现有代码

在更新现有代码的样式时，请遵循以下准则。
1.不需要更改所有现有代码来满足当前的样式指南。重新格式化现有代码是在代码混乱和一致性之间的权衡。样式规则会随着时间的推移而演变，而这些维护遵从性的调整会造成不必要的混乱。但是，如果对文件进行了重大更改，则预期该文件将采用谷歌样式。
2.小心不要让机会主义的样式修正混淆了CL的焦点。如果您发现自己做了很多对CL的中心焦点不是很重要的样式更改，那么将这些更改提升到单独的CL中。

### 8.4.2 新增代码:使用谷歌风格

全新的文件使用谷歌样式，而不考虑同一包中其他文件的样式选择。
当向非谷歌样式的文件添加新代码时，建议首先重新格式化现有代码，这取决于[8.4.1 Reformatting existing code](https://google.github.io/styleguide/jsguide.html#policies-reformatting-existing-code) 。

如果未进行此重新格式化，则新代码应尽可能与同一文件中的现有代码保持一致，但不能违反样式指南。

## 8.5 局部风格规则

团队和项目可以采用本文档之外的其他样式规则，但是必须接受清理更改可能不遵守这些附加规则，并且不能因为违反任何附加规则而阻止此类清理更改。谨防过多的毫无用处的规则。风格指南并没有试图在每个可能的场景中定义风格，您也不应该这样做。

## 8.6 生成的代码:大部分是免除的

构建过程生成的源代码不需要采用谷歌风格。但是，从手工编写的源代码中引用的任何生成的标识符都必须遵循命名要求。作为一个特殊的例外，这种标识符允许包含下划线，这可能有助于避免与手写标识符的冲突。

# 9 附件

## 9.1 JSDoc标签引用 

JSDoc在JavaScript中有多种用途。除了用于生成文档外，它还用于控制工具。最著名的是闭包编译器类型注释。

### 9.1.1 类型注释和其他闭包编译器注释

闭包编译器使用的JSDoc文档在[ Annotating JavaScript for the Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) 和 [ Types in the Closure Type System](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System) 。

### 9.1.2 文档注释

[ Annotating JavaScript for the Closure Compiler ](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler 中描述的JSDoc之外，以下标记是常见的，并且受到各种文档生成工具(如[JsDossier](https://github.com/jleyba/js-dossier) )的良好支持，仅用于文档目的。

您还可以在第三方代码中看到其他类型的JSDoc注释。这些注释出现在[ JSDoc Toolkit Tag Reference](http://code.google.com/p/jsdoc-toolkit/wiki/TagReference) 中，但不被认为是有效的谷歌样式的一部分。

#### 9.1.2.1 @作者或@所有者-不推荐。

不推荐:
语法: @author username@google.com (First Last)
```
/**
 * @fileoverview Utilities for handling textareas.
 * @author kuth@google.com (Uthur Pendragon)
 */
```
记录文件的作者或测试的所有者，通常只在@fileoverview注释中使用。单元测试仪表板使用@owner标记来确定谁拥有测试结果。

#### 9.1.2.2 @bug

语法: @bug bugnumber
```
/** @bug 1234567 */
function testSomething() {
  // …
}

/**
 * @bug 1234568
 * @bug 1234569
 */
function testTwoBugs() {
  // …
}
```
指示给定的测试函数回归测试的bug。
多个bug应该有各自的@bug行，以便尽可能轻松地搜索回归测试。

#### 9.1.2.3 @code——弃用。不要使用。

弃用。不要使用。使用Markdown反引号。
语法: {@code ...}
历史上，“BatchItem”被写成{@code BatchItem}。
```
/** Processes pending `BatchItem` instances. */
function processBatchItems() {}
```
指示JSDoc描述中的术语是代码，因此可以在生成的文档中正确格式化它。

#### 9.1.2.4 @desc

语法: @desc Message description
```
/** @desc Notifying a user that their account has been created. */
exports.MSG_ACCOUNT_CREATED = goog.getMsg(
    'Your account has been successfully created.');
```

#### 9.1.2.5 @link

语法: {@link ...}
此标记用于在生成的文档中生成交叉引用链接。
```
/** Processes pending {@link BatchItem} instances. */
function processBatchItems() {}
```
历史注释:@link标记还用于在生成的文档中创建外部链接。对于外部链接，总是使用Markdown的链接语法:
```
/**
 * This class implements a useful subset of the
 * [native Event interface](https://dom.spec.whatwg.org/#event).
 */
class ApplicationEvent {}
```

#### 9.1.2.6 @see

语法: @see Link
```
/**
 * Adds a single item, recklessly.
 * @see #addSafely
 * @see goog.Collect
 * @see goog.RecklessAdder#add
 */
```
引用对另一个类函数或方法的查找。

#### 9.1.2.7 @supported

语法: @supported Description
```
/**
 * @fileoverview Event Manager
 * Provides an abstracted interface to the browsers' event systems.
 * @supported IE10+, Chrome, Safari
 */
```
在fileoverview中使用，指示文件支持哪些浏览器。

### 9.1.3 框架具体的注释

以下注释是特定于特定框架的。

#### 9.1.3.1 @ngInject for Angular 1

#### 9.1.3.2 @polymerBehavior for Polymer

[https://github.com/google/closure-compiler/wiki/Polymer-Pass](https://github.com/google/closure-compiler/wiki/Polymer-Pass)

### 9.1.4 关于标准闭包编译器注释的说明

下面的标签曾经是标准的，但是现在不推荐了。

#### 9.1.4.1 @expose—不赞成。不要使用。
弃用。不要使用。而是使用@export和/或@nocollapse。

#### 9.1.4.2 @inheritDoc - Deprecated。不要使用。
弃用。不要使用。使用@override代替。

## 9.2 常被误解的风格规则

以下是关于JavaScript的谷歌风格的一些不太为人所知或经常被误解的事实。(以下为真实陈述;这不是一个谬见列表。)

*源文件中既不需要版权声明，也不需要@author credit。(也没有明确推荐。 )
*对于如何对一个类([5.4类](https://google.github.io/styleguide/jsguide.html#features-classes)  )的成员排序，没有严格的规则。
*空块通常可以简洁地表示为{}，具体如([4.1.3空块:可能简洁](https://google.github.io/styleguide/jsguide.html#formatting-empty-blocks)  )。
*换行的主要指令是:宁愿在更高的语法层次上中断([4.5.1在哪里中断](https://google.github.io/styleguide/jsguide.html#formatting-where-to-break) )。
*字符串文本、注释和JSDoc中允许使用非ascii字符，实际上，当它们使代码比等效的Unicode转义([2.3.3非ascii字符](https://google.github.io/styleguide/jsguide.html#non-ascii-characters) )更易于阅读时，建议使用非ascii字符。

## 9.3 风格相关工具

存在以下工具来支持谷歌风格的各个方面。

### 9.3.1 闭包编译

这个程序执行类型检查和其他检查、优化和其他转换(例如ECMAScript 6到ECMAScript 5代码降低)。

### 9.3.2 clang-format

该程序将JavaScript源代码重新格式化为谷歌样式，并遵循了一些非必需但经常增强可读性的格式化实践。由clang-format生成的输出符合样式指南。
不需要clang-format。允许作者修改其输出，允许审稿人要求修改;争端按通常方式解决。但是，子树可以选择在本地执行。

### 9.3.3 闭包编译linter

这个程序检查各种错误和反模式。

### 9.3.4 一致性框架

JS一致性框架是一个工具，是闭包编译器的一部分，它为开发人员提供了一种简单的方法来指定一组额外的检查，这些检查将在标准检查的基础上运行。例如，一致性检查可以禁止对某个属性的访问，或对某个函数的调用，或丢失的类型信息(未知数)。

这些规则通常用于执行关键的限制(比如定义全局变量，这会破坏代码库)和安全模式(比如使用eval或将值赋值给innerHTML)，或者更松散地用于提高代码质量。

有关更多信息，请参见[JS Conformance Framework.](https://github.com/google/closure-compiler/wiki/JS-Conformance-Framework) 。

## 9.4 遗留平台的例外

### 9.4.1 重写

本节描述当代码作者不能使用现代ECMAScript 6语法时需要遵循的异常和附加规则。当ECMAScript 6语法无法使用时，需要使用推荐的样式，这里列出了例外情况:
*允许使用var声明
*允许使用参数
*允许使用没有默认值的可选参数

### 9.4.2 使用var

#### 9.4.2.1 var声明不是块作用域的

var声明的作用域限定在最近的封闭函数、脚本或模块的开头，这可能会导致意外的行为，特别是使用在循环中引用var声明的函数闭包时。下面的代码给出了一个例子:
```
for (var i = 0; i < 3; ++i) {
  var iteration = i;
  setTimeout(function() { console.log(iteration); }, i*1000);
}

// logs 2, 2, 2 -- NOT 0, 1, 2
// because `iteration` is function-scoped, not local to the loop.

```

#### 9.4.2.2 尽可能在第一次使用时声明变量

尽管var声明的作用域被限定在封闭函数的开头，但是出于可读性的考虑，var声明应该尽可能地接近第一次使用时的情况。但是，如果一个变量被引用在一个块之外，那么不要把var声明放在一个块里面。例如:
```
function sillyFunction() {
  var count = 0;
  for (var x in y) {
    // "count" could be declared here, but don't do that.
    count++;
  }
  console.log(count + ' items in y');
}
```

#### 9.4.2.3 常量使用@const

对于使用const关键字的全局声明，如果它可用，则使用@const来注释var声明(对于局部变量，这是可选的)。

### 9.4.3 不要使用块作用域函数声明

不要这样做:
```
if (x) {
  function foo() {}
}
```
尽管在ECMAScript 6之前实现的大多数JavaScript vm都支持块内的函数声明，但它并不是标准化的。实现彼此不一致，并且与块作用域函数声明的现在标准的ECMAScript 6行为不一致。ECMAScript 5和prior只允许在脚本或函数的根语句列表中声明函数，并在严格模式下显式禁止在块作用域中声明函数。
要获得一致的行为，而是使用一个函数表达式初始化的变量来定义一个块内的函数:
```
if (x) {
  var foo = function() {};
}
```

### 9.4.4依赖项管理 goog.provide/goog.require

#### 9.4.4.1 总结

警告：goog.provide 不赞成依赖管理。所有新文件，甚至在使用goog.provide中的旧文件，应该使用[goog.module](https://google.github.io/styleguide/jsguide.html#source-file-structure)  ,以下规则适用于已存在goog.provide的文件。
*goog.provide第一,goog.require第二。用空行分隔提供和需求。
*按字母顺序(大写优先)排序。
*不要用goog.provide和goog.require语句。如果需要，超过80列。
*只提供顶级符号。
goog.provide语句应该放在一起放在前面,接下来是所有goog.require语句。这两个列表应该用空行隔开。
类似于其他语言中的import语句，goog.provide和goog.require语句应该写在一行中，即使它们超过了80列的行长度限制。
行应按字母顺序排列，大写字母优先:
```
goog.provide('namespace.MyClass');
goog.provide('namespace.helperFoo');

goog.require('an.extremelyLongNamespace.thatSomeoneThought.wouldBeNice.andNowItIsLonger.Than80Columns');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.dominoes');
```
类上定义的所有成员应该在同一个文件中。只有顶级类才应该在一个文件中提供，该文件包含了在同一个类上定义的多个成员(例如枚举、内部类等)。
这样做:
```
goog.provide('namespace.MyClass');
```
不是这样的:
```
goog.provide('namespace.MyClass');
goog.provide('namespace.MyClass.CONSTANT');
goog.provide('namespace.MyClass.Enum');
goog.provide('namespace.MyClass.InnerClass');
goog.provide('namespace.MyClass.TypeDef');
goog.provide('namespace.MyClass.staticMethod');
```
也可以提供名称空间成员:
```
goog.provide('foo.bar');
goog.provide('foo.bar.CONSTANT');
goog.provide('foo.bar.method');
```

#### 9.4.4.2 使用google.scope进行混叠

警告:google.scope弃用。新文件不应该使用google.scope甚至在项目与现有google.scope。
google.scope可以使用goog.provide/goog.require来缩短代码中对带名称空间的符号的引用。依赖关系管理。
只有一个google.scope可以为每个文件添加调用。始终将其放在全局范围内。
开始的goog.scope(function(){调用前必须有一行空白，并跟在任何goog后面。提供报表,google.require语句或顶级注释。调用必须在文件的最后一行关闭。附加/ / google.scope到结束陈述的范围。将注释与分号分隔两个空格。
类似于c++名称空间，不要在google.scope下缩进声明。相反，从0列开始。
仅为不会被重新分配给其他对象的名称(例如，大多数构造函数、枚举和名称空间)创建别名。不要这样做(参见下面如何别名化构造函数):
```
goog.scope(function() {
var Button = goog.ui.Button;

Button = function() { ... };
...
```
名称必须与它们正在别名化的全局变量的最后一个属性相同。
```
goog.provide('my.module.SomeType');

goog.require('goog.dom');
goog.require('goog.ui.Button');

goog.scope(function() {
var Button = goog.ui.Button;
var dom = goog.dom;

// Alias new types after the constructor declaration.
my.module.SomeType = function() { ... };
var SomeType = my.module.SomeType;

// Declare methods on the prototype as usual:
SomeType.prototype.findButton = function() {
  // Button as aliased above.
  this.button = new Button(dom.getElement('my-button'));
};
...
});  // goog.scope
```

#### 9.4.4.3 goog.forwardDeclare

偏爱使用googrequireType代替goog.forwardDeclare用于打破同一库中文件之间的循环依赖关系。不像goog.require,goog.requireType语句在定义名称空间之前导入名称空间。
google.forwardDeclare仍然可以在遗留代码中使用，以打破跨越库边界的循环引用，但是新的代码应该在结构上加以避免。
google.forwardDeclare语句必须遵循与goog.require和goog.requireType相同的样式规则。整块goog.forwardDeclare,goog.require 和 goog.requireType是按字母顺序分类的。