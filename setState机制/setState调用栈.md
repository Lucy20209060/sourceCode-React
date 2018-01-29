import React,{Component} from 'react';

class Example extends Component {
    constructor(){
        super();
        this.state = {
            val:0
        }
    }
    componentDidMount(){
        this.setState({
            val:this.state.val + 1
        })
        console.log(this.state.val) // 第1次输出 0

        this.setState({
            val:this.state.val + 1
        })
        console.log(this.state.val) // 第2次输出 0
        
        setTimeout(() => {
            this.setState({
                val:this.state.val + 1
            })
            console.log(this.state.val) // 第3次输出 2

            this.setState({
                val:this.state.val + 1
            })
            console.log(this.state.val) // 第4次输出 3
        })
    }

}  




                            this.setState()
                                    ||
                                    ||
                                    \/
                            newState存入pending队列
                                    ||
                                    ||
                                    \/
                            调用enqueueUpdate
                                    ||
                                    ||
                                    \/
                            是否处于批量更新模式
                            ||              ||
                            || Y            || N
                            \/              \/
                        将组件保存到        遍历dirtyComponrnts
                    dirtyComponents        调用updateComponent
                                           更新pending state or props

                                setState简化调用栈    


enqueueUpdate 的代码如下

function enqueueUpdate(component){
    ensureInjected();
    // 如果不处于批量更新模式
    if(!batchingStrategy.isBatchingUpdates){
        batchingStrategy.batchedUpdates(enqueueUpdate,component);
        return;
    }
    // 如果处于批量更新模式 则将组件保存在 dirtyComponents中
    dirtyComponents.push(component);
}   

如果 isBatchingUpdates 为true 则对队列中的更新执行 batchedUpdates 方法 否则只把当前的组件（即调用了setState的组件）放入dirtyComponents数组中 例子中4次setState调用的变现之所以不同 这里逻辑判断起了关键作用