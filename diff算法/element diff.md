当节点处于同一层级时 diff提供3种节点操作 分别是 IMSERT_MARKUP(插入) MOVE_EXISTING(移动) REMOVE_NODE(删除)

IMSERT_MARKUP 新的组件类型不在就集合里 即全新的节点 需要对新节点执行插入操作

MOVE_EXISTING 旧集合中有新组件类型 且element是可更新的类型 generateComponentChildren 已调用receiveComponent 这种情况下 precChild = nextChid 就需要做移动操作 可以服用以前的DOM节点

REMOVE_NODE 旧组件类型 在新集合里也有 但对应的element不同则不能直接复用和更新 需要执行删除操作 或者旧组件不在新集合里的 也需要执行删除操作

    旧   A   B   C   D
    新   B   A   D   C

旧集合包含节点A B　C D 更新后包含节点B A D C 此时新旧集合进行diff差异化对比 发现B != A 则创建并插入B到新集合 删除旧集合A 以此类推 创建并删除A D C 删除B C D

React发现这类操作繁琐冗余 因为这些都是相同的节点 由于委会发现变化 导致需要进行繁杂低效的删除创建操作 其实只需要将这些节点移动位置即可

针对这一现象 React提出优化策略 允许开发者对同一层级的同组子节点 添加唯一key进行区分 虽然只是小小的改动 性能上却是翻天覆地的变化


    旧   A       B       C       D
        key=a   key=b   key=c   key=d
    新   B       A       D       C
        key=b   key=a   key=d   key=c

进行diff差异化对比后 通过key发现新旧集合中的节点都是相同的节点 因此无需进行节点的删除创建 只需要将就集合中节点的位置进行移动 更新为新集合中节点的位置 此时React的diff结果为：B D不做任何操作 A C 进行移动操作即可

如此高效的diff如何运作

首先 对新集合中的节点进行循环遍历 for(name in nextChildren) 通过key判断新旧集合中是否存在相同的节点 if(prevChild === nextChild)如果存在相同的节点则进行移动操作 但在移动前需要将当前节点在旧集合中的位置与lastIndex进行对比 if(child._mountIndex < lastIndex) 否则不执行该操作