# React 16.3及之后的生命周期解读
* 本文以ES6 class组件为基准，不包含函数式组件、Hooks等。

<iframe src="https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/" width="100%" height="600"></iframe>

## 常用的生命周期

### constructor()
  
  > 类的构造方法，一般用于定义组件初始化时所需的基本数据、定义初始state、处理回调函数的bind等。
  
  - 由于React的使用机制为继承React预定义的组件(Component/PureComponent)，所以基于React的组件类型均为子类。
  - 子类的特性：在类构造方法内访问当前实例(this)之前，必须调用super方法来构造实例。

### componentDidMount()

  > 此方法会在组件挂载后立即调用。依赖于 DOM 节点的初始化应该放置这里。如需通过网络请求获取数据等。

### componentDidUpdate(prevProps, prevState, snapshot)

  > 此方法会在更新后被立即调用。首次渲染不会执行此方法。当组件更新后，可以在此处对 DOM 进行操作。

### componentWillUnmount()

  > 此方法会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，例如，清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等。

  - 此方法内不应调用 setState()，因为该组件将永远不会重新渲染。组件实例卸载后，将永远不会再挂载它。

### render()

  > render() 方法是 class 组件中唯一必须实现的方法。

## 不常用的生命周期方法

### static getDerivedStateFromProps(props, state)

  > 特殊情况下，需要根据props来更新state时使用。

  - 注意此方法为静态方法，因此不能在内部访问当前实例(this)。
  - 它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
  - 此方法会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。

### shouldComponentUpdate(nextProps,nextState)

  > 根据此方法的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响，即是否重新渲染组件。
  
  - 当组件出现效率问题时，可以尝试添加此方法来进行性能优化，更好的方案是使用PureComponent。
  - 当此方法内返回false时会阻止后续更新行为(根据官方说法，这一行为在之后可能发生变化)。

## 过时的生命周期

以下生命周期方法标记为“过时”。这些方法仍然有效(可能存在隐患)，不要在新代码中使用它们，建议旧代码也进行升级[更多有关迁移旧版生命周期方法的信息](https://zh-hans.reactjs.org/blog/2018/03/27/update-on-async-rendering.html)。

### UNSAFE_componentWillMount()

  > 此生命周期之前名为 componentWillMount。UNSAFE_componentWillMount() 在挂载之前被调用。

  > 升级方案：  
  > 将现有 componentWillMount 中的代码迁移至 componentDidMount 即可。

### UNSAFE_componentWillReceiveProps(nextProps)

  > 此生命周期之前名为 componentWillReceiveProps。UNSAFE_componentWillReceiveProps() 会在已挂载的组件接收新的 props 之前被调用。

  - 在老版本的 React 中，如果组件自身的某个 state 跟其 props 密切相关的话，一直都没有一种很优雅的处理方式去更新 state，而是需要在 componentWillReceiveProps 中判断前后两个 props 是否相同，如果不同再将新的 props 更新到相应的 state 上去。这样做一来会破坏 state 数据的单一数据源，导致组件状态变得不可预测，另一方面也会增加组件的重绘次数。

  - 在新版本中，官方将更新 state 与触发回调重新分配到了 getDerivedStateFromProps 与 componentDidUpdate 中，使得组件整体的更新逻辑更为清晰。而且在 getDerivedStateFromProps 中还禁止了组件去访问 this，强制让开发者去比较 nextProps 与 prevState 中的值，以确保当开发者用到 getDerivedStateFromProps 这个生命周期函数时，就是在根据当前的 props 来更新组件的 state，而不是去做其他一些让组件自身状态变得更加不可预测的事情。

  > 升级方案：  
  >  将现有 componentWillReceiveProps 中的代码根据更新 state 或回调，分别在 getDerivedStateFromProps 及 componentDidUpdate 中进行相应的重写即可，注意新老生命周期函数中 prevProps，this.props，nextProps，prevState，this.state 的不同。

### UNSAFE_componentWillUpdate(nextProps, nextState)

  此生命周期之前名为 componentWillUpdate。当组件收到新的 props 或 state 时，会在渲染之前调用 UNSAFE_componentWillUpdate()。

  > 升级方案：
  > 将现有的 componentWillUpdate 中的回调函数迁移至 componentDidUpdate即可。

# 组件更新方案

## 建议的用法

* 一般组件更新时，在componentDidMount方法内实现相关逻辑即可，常用于更新数据、后台请求、操作DOM等。

* 在componentDidMount方法内进行SetState等更新时，必须添加if判断，避免循环更新。

* 和渲染无关的状态尽量不要放在 state 中来管理，避免不必要的更新与setState。

```jsx
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  //加载完成后进行初始数据请求。
  componentDidMount() {
    this._asyncRequest = loadMyAsyncData().then((externalData) => {
      this._asyncRequest = null;
      this.setState({ externalData });
    });
  }

  //更新后进行数据更新，触发回调。
  componentDidUpdate(prevProps, prevState) {
    if (this.state.someStatefulValue !== prevState.someStatefulValue) {
      this.props.onChange(this.state.someStatefulValue);
    }
  }

  //卸载时取消事件绑定，订阅等。
  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // 渲染加载状态 ...
    } else {
      // 渲染真实 UI ...
    }
  }
}
```

## 更新节流

* 很多情况下组件嵌套使用时，setSate会导致所有的子组件都进行更新，因此需要添加更新过滤。以前的方案一般是实现shouldComponentUpdate，但此方法使用较为麻烦，且之后行为可能会变化，因此推荐用PureComponent方案。

```jsx
//旧方案：使用React.Component + shouldComponentUpdate
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 1 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState((state) => ({ count: state.count + 1 }))}
      >
        Count: {this.state.count}
      </button>
    );
  }
}
```

## PureComponent

为了便于处理更新过滤，React提供了PureComponent组件，其原理是：当props或state改变时，对新旧的props和state进行`浅比较（shallow comparison）`，当比较一致时，跳过此次更新过程。

* 当组件跳过更新过程时，其所有的子组件均不会进行更新。
* 由于比较时是浅比较，所以一般推荐props和state的值尽可能的是基本数据类型。
* 当比较的值是引用数据类型时，比较的是引用是否一致(可以理解为其他编程语言中的指针地址是否变化)。
* 由于componentDidUpdate在更新之后调用，而componentWillReceiveProps在更新前调用，因此配合PureComponent使用能够减少componentDidUpdate的触发次数。

```jsx
//新方案：使用React.PureComponent
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { count: 1 };
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState((state) => ({ count: state.count + 1 }))}
      >
        Count: {this.state.count}
      </button>
    );
  }
}
```

## 特殊case：根据props更新state

除极特殊情况外，不建议使用此方案，应该尽可能的仅使用props，和不依赖props变化的state，来更新组件。

```javascript
//React16.3以前的方案：
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.currentRow !== nextProps.currentRow) {
      this.setState({
        isScrollingDown: nextProps.currentRow > this.props.currentRow,
      });
    }
  }
}

//React16.3及之后的方案：
class ExampleComponent extends React.Component {
  // 在构造函数中初始化 state，或者使用属性初始化器。
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  //注意：此方法为静态方法，不能在内部访问this。
  //return的值将更新至state内。
  static getDerivedStateFromProps(props, state) {
    if (props.currentRow !== state.lastRow) {
      return {
        isScrollingDown: props.currentRow > state.lastRow,
        lastRow: props.currentRow,
      };
    }
    // 返回 null 表示无需更新 state。
    return null;
  }
}
```

## 对象的更新

在更新对象时，不需要重现渲染的话，可以直接修改原有对象，如：
```javascript
this.state.data.name = 'Tom';

Object.assign(this.state.data, newData);
```

需要重新渲染时，推荐通过Object.assign分配一个新的对象，俗称`换对象`，如：
```javascript
this.state.data = Object.assign({}, this.state.data, newData);
//or
this.setState({data: Object.assign({}, this.state.data, newData)});
```

## 数组的更新

更新数组时，不需要渲染的话，直接修改原数组中的内容即可，比如通过push、pop、shift、splice等。

需要重新渲染时，跨越通过slice、concat等方法重新生成一个新的数组，俗称`换数组`。

### 数组的key

为了标识循环生成的元素，React引入了key参数，当key前后没有变化时，对齐进行“标记式更新”；当发生变化时，则销毁已有组件并重新生成。

这种最常见的case就是排序，数组内容没有发生变化，仅修改顺序。
```javascript
//假如初始数据是这样的：
this.state.data = [{name: 'Tom'}, {name: 'Jerry'}, {name: 'Mickey'}, {name: 'Minnie'}];

//排序，并换数组。
this.setState({data:this.state.data.sort().slice()});
//渲染
{this.state.data.map((item)=> <div key={item.name}></div>)}
```
上面的例子中，对其进行排序后，由于key未发生变化，还是原有的4个name，所以渲染时仅进行了位移。

假如用index作为key的话，看起来好像没啥区别，但是在对比的时候发现和以前一样，就会出现“局部更新”的情况，可以查看[此示例](https://codepen.io/pen?&editable=true&editors=0010)

因此，key属性的值，一般用id或guid等唯一值，慎用index。




