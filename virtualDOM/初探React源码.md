在React源码中，整体的代码结构按照 addons isomorphic renderers shared core test进行组织

addons:包含一系列的工具方法插件 如 PureRenderMixin CSSTransitionGroup Fragment LinkedStateMixin等

isomorphic:包含一系列同构方法

shared:包含一些公用或常用的方法 如Transaction CallbackQueue等

test:包含一些测试的方法

core/tests:包含一些边界错误的测试用例

renderers:React核心代码 包含大部分功能实现 分为dom shared目录

dom:包含 client server shared

    client:dom操作方法 如 findDOMNode setInnerHTML setTestContent等 以及事件方法 
    如 事件监听(ReactEventlistener) 常用事件方法（TapEventPlugin EnterLeave-EventPlugin）以及一些合成方法(SyntheticEvents)
    
    server:主要包含服务端的实现和方法(如 ReactServerRendering,ReactServer-RenderingTransaction等)
    
    shared:文本组件(ReactDOMTextComponent),标签组件(ReactDOMComponent),DOM属性操作(DOMProperty,DOMPropertyOperations),CSS属性操作(CSSProperty,CSSProtryOperation等)

shared:包含 event reconciler

    event:包含一些更为底层的方法 如事件插件中心(EventPluginHub),事件注册（EventPluginRegistry）,事件传播（EventPropagators）,以及一些事件通用方法

    reconciler：称为协调器 最为核心的部分 包含React中自定义组件的实现（ReactCompositeComponent）,组件生命周期机制，setState机制（ReactUpdates,ReactUpdateQueue）,DOM diff算法（ReactMultiChild）等

    React下的renderers源码目录

    renderers   =>  dom
                        =>  client
                        =>  server
                        =>  shared
                =>  shared
                        =>  event
                        =>  reconciler

Virtual DOM是React核心和精髓 而renderers就是实现Virtual DOM的主要源码

Virtual DOM实际上是在浏览器端用Javascript实现的一套DOM API 之于React就像一个虚拟空间 包括一整套Virtual DOM模型，生命周期的维护和管理，性能高效的diff算法和将Virtual DOM展示为原生的DOM的path方法等

所有的DOM树都是通过Virtual DOM构造的

React在Virtual DOM上实现的DOM diff算法，当数据更新时 会通过diff寻找需要更新的DOM节点 并只对变化的部分进行实际的浏览器的DOM更新 而不是重新渲染整个DOM树

尽管每次都要构造Virtual DOM树 但由于Virtual DOM树是javascript对象 性能极高 而对原生DOM进行操作的仅仅是diff部分 因而达到了提高性能的目的
