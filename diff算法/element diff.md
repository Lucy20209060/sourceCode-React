当节点处于同一层级时 diff提供3种节点操作 分别是  IMSERT_MARKUP(插入)，MOVE_EXISTING(移动)，REMOVE_NODE(删除)

IMSERT_MARKUP 新的组件类型不在旧集合里 即全新的节点 需要对新节点执行插入操作

MOVE_EXISTING 旧集合中有新组件类型 且element是可更新的类型 generateComponentChildren 已调用receiveComponent 这种情况下 precChild = nextChid 就需要做移动操作 可以复用以前的DOM节点

REMOVE_NODE 旧组件类型 在新集合里也有 但对应的element不同则不能直接复用和更新 需要执行删除操作，或者旧组件不在新集合里的 也需要执行删除操作

    旧   A   B   C   D
    新   B   A   D   C

旧集合包含节点A B　C D 更新后包含节点B A D C 此时新旧集合进行diff差异化对比 

发现B != A 则创建并插入B到新集合 删除旧集合A 以此类推 创建并删除A D C 删除B C D

React发现这类操作繁琐冗余 因为这些都是相同的节点 由于委会发现变化 导致需要进行繁杂低效的删除创建操作 其实只需要将这些节点移动位置即可

针对这一现象 React提出优化策略 允许开发者对同一层级的同组子节点 添加唯一key进行区分 虽然只是小小的改动 性能上却是翻天覆地的变化


    旧   A       B       C       D
        key=a   key=b   key=c   key=d

    新   B       A       D       C
        key=b   key=a   key=d   key=c


B不动 A移动到B后 D不动 C移动到D后

进行diff差异化对比后 通过key发现新旧集合中的节点都是相同的节点 因此无需进行节点的删除创建 

只需要将旧集合中节点的位置进行移动 更新为新集合中节点的位置 此时React的diff结果为：B D不做任何操作 A C 进行移动操作即可

如此高效的diff如何运作

首先 对新集合中的节点进行循环遍历 for(name in nextChildren) 通过key判断新旧集合中是否存在相同的节点，if(prevChild === nextChild)如果存在相同的节点则进行移动操作 

但在移动前需要将当前节点在旧集合中的位置与lastIndex进行对比 if(child._mountIndex < lastIndex) 旧集合中的位置 < 现在的位置 节点往后移动了 否则不执行该操作 

这是一种顺序优化手段 lastindex一直在更新 表示访问过的节点在旧集合中最右的位置（即最大的位置） 如果新集合中当前访问的节点比lastIndex大 说明当前访问节点在旧集合中就比上一个节点位置靠后 则该节点不会影响其他节点的位置 因此不需要添加到差异队列中 即不执行移动操作 只有访问的节点比lastIndex小 才需要进行移动操作

从新集合中取得B 然后判断旧集合中是否存在相同节点B 此时发现存在节点B 接着通过对比节点位置判断是否进行移动操作 B在旧集合的位置 B._mountIndex = 1 此时 lastIndex = 0 不满足 child._mountIndex < lastIndex 的条件 因此不对B进行移动操作 更新lastIndex = Math.max(prevChild._mountIndex,lastIndex) 其中prevChild._mountIndex表示B在旧集合中的位置 则lastIndex = 1 并将B的位置更新为新集合的中的位置prevChild._mountIndex = nextIndex 此时新集合中的B._mountIndex = 0,nextIndex++ 进入下一个环节判断

......

上面主要分析新旧节点集合存在相同节点但位置不同时 对节点进行位置的移动情况

如果有新节点的加入且旧集合存在需要删除的节点

    旧   A       B       C       D
        key=a   key=b   key=c   key=d

    新   B       E       C       A
        key=b   key=e   key=c   key=a

        创建，移动，删除节点

B不动 在B后创建E C不动 A移动到C后 删除D

从新集合中取得B 然后判断旧集合中存在是否有相同元素B 发现存在节点B 由于B在旧集合中的位置B._mountIndex = 1 此时lastIndex = 0 

因此不对B进行移动操作 更新lastIndex = 1 并将B的位置更新为新集合中的位置B._mountIndex = 0 nextIndex++ 进入下一个节点的判断

从新集合取得E 然后判断旧集合是否存在相同节点E 可以发现没有 因此可以创建新节点E 更新lastindex = 1 并将E的位置更新为新集合中的位置 nextIndex++ 

进入下一环节判断

......

当然diff还存在一些不足与待优化的地方 新集合的节点更新为D,A,B,C 与旧集合相对比 只有D节点移动例如 其他节点保持不变 理论上只需对节点进行移动 然而D在旧集合中的位置最大 导致其他节点的_mountIndex < lastIndex 造成D没有执行任何操作 而是A,B,C全部移动到D的后面

    旧   A       B       C       D
        key=a   key=b   key=c   key=d

    新   D       A       B       C
        key=d   key=a   key=b   key=c

        D节点移动到首位


建议：开发中尽量减少类似的 将最后一个节点移动到列表首位的操作 当节点数量过大或更新操作过于频繁时 一定程度上会影响React的渲染性能
