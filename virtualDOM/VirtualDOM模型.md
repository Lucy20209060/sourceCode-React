Virtual DOM好比一个虚拟空间 React的工作几乎都是基于Virtual DOM完成的 
Virtual DOM模型负责Virtual DOM底层框架的构建工作 它拥有一阵整套的Virtual DOM标签 并负责虚拟节点及其属性的构建 更新 删除等工作

DOM标签所需要的基本元素
    标签名
    节点属性 包含 样式 属性 事件等
    子节点
    标识id

    {
        tagName:'div',      // 标签名
        properties:{        // 属性
            style:{}        // 样式
        },      
        children:[],        // 子节点
        key:1               // 唯一标识
    }

Virtual DOM节点(ReactNode)  =>   ReactElement
                                    =>  ReactComponentElement
                                    =>  ReactDomElement
                            =>   ReactFragment
                            =>   ReactText