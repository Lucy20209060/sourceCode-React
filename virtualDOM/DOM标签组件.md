Virtual DOM模型几乎涵盖了所有的原生DOM标签 如 <div> <p> <span>等 使用React时 此时的<div>并不是原生的<div>标签 是React生成的Virtual DOM对象 只不过标签名称相同罢了 React大部分工作都是在Virtual DOM中完成的 不直接操作和污染原生DOM 保持了性能上的高效和稳定 降低了直接操作原生DOM而导致的错误风险

ReactDOMComponent针对Virtual DOM标签的处理
    属性的更新 包括更新样式 更新属性 处理事件等
    子节点的更新 包括更新内容 更新子节点 此部分涉及diff算法

更新属性
    当执行mountComponent 方法时 ReactDOMComponent首先会生成标记和标签 通过 this.creatOpenTagMarkAndPutListeners(transaction)来处理DOM节点的属性和事件
    如果存在事件 则针对当前节点添加事件代理 即调用enqueuePutListener(this,propKey,propValue,transaction)
    如果存在样式 首先会对样式进行合并操作Object.assign({},prop.style) 然后通过CSSPropertyOperations.createMarkupForStyles(propValue,this)创建样式
    通过DOMPropertyOperations.createMarkupForProperty(propKey,propValue)创建属性
    通过DOMPropertyOperations.createMarkupForID(this._domID)创建唯一标识

去除data-reactid是React15.0的更新点之一 
React渲染后的每一个DOM节点都会添加data-reactid属性 这个作为DOM节点的唯一标识而存在的字符串 DOM更新时 每个节点的data-reactid属性也会进行更新 去掉data-reactid使得React性能有了10%的提升

当执行receiveComponent方法时 ReactDOMComponent会通过this.updateComponent(transaction,prevElement,prevElement,nextElement,content)来更新DOM节点属性

删除不需要的旧属性 
    如果不需要旧样式 则遍历旧样式集合 并对每个进行置空删除 
    如果不需要事件 则将其事件监听的属性去掉 即针对当前的节点取消事件代理deleteListener(this,propKey)
    如果旧属性不在新属性的集合里 则需要删除旧属性DOMPropertyOprations.deleteValueForProperty(getNode(this),propValue)
更新新属性
    如果存在新属性 将新属性进行合并object.assgin({},nextProp)
    如果在旧样式 不在新样式中 则清除该样式 
    如果既在旧样式 又在新样式中 且不同 更新该样式 styleUpdates[styleName] = nextProp[styleName]
    如果在新样式中 不在旧样式中 直接更新为新样式 styleUpdates = nextProp
    如果存在事件更新 添加事件监听属性enqueuePutListener(this,propKey,nextProp,transaction)
    如果存在新属性 添加新属性 或者更新旧的同名属性DOMPropertyOperations.setValueForAttribute(node,propKey,nextProp)