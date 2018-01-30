diff作为 Virtual DOM 的加速器 其算法上的改进是React整个界面渲染的基础和性能保障

React将Virtual DOM树转化为actual DOM树的最少操作的过程称为调和（reconciliation diff算法便是调和过程的具体实现）

React diff算法的3个策略

1.web UI中DOM节点跨层级的移动操作特别少 可以忽略不计

2.拥有相同类的两个组件将会生成相似的树形结构 拥有不同类的组件将会生成不同的树形结构

3.同一层级的一组子节点 它们会通过唯一的id进行区别

基于以上策略 React分别对tree diff，component diff,element diff进行算法优化 事实证明这3个前提策略是合理且准确的 它保证了整个界面构建的性能