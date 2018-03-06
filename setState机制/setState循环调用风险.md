当调用setState时 实际上会执行enqueueSetState方法 

并对partialState 以及_pendingStateQueue更新队列进行合并操作 最终通过enqueueSetState执行state更新

而performUpdateIfNecessary方法会获取_pendingElement _pendingStateQueue _pendingForceUpdate 并调用receiveComponent和updateComponent方法进行组件更新

如果在shouldComponentUpdate 或 componentWillUpdate方法中调用setSate 

此时this._pendingStateQueue != null 则performUpdateIfNecessary方法就会调用updateComponent方法进行组件更新 

但updateComponent方法又会调用shouldComponentUpdate 和 componentWillUpdate方法 

因此造成循环调用 使得浏览器内存占满奔溃

                    componentWillUpdate
                    /\                ||
                    ||                ||
                    ||                || setState
                    ||                ||
                    ||                \/
        updateComponent <====== performUpdateIfNecessary

                        循环调用
