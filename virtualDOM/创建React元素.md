React.createElement 和 document.createElement方法相似 创建元素

document.createElement(nodeName) 创建指定的元素 参数只有nodeName

React.createElement(type,props,children) 创建指定的类型的React元素节点

var children1 = React.createElment('li',null,'text Content 1')

var children2 = React.createElment('li',null,'text Content 2')

var root = React.createElement('ul',{className:'my-mist'},[children1,children2])

ReactDOM.render(
    root,
    document.getElementById('root')
)

第一个参数：必填 元素类型

第二个参数：可填 元素属性

第三个参数：可填 元素的子元素 也可以把数组的元素拿出来当做第三个第四个...参数 React使用非常的灵活
