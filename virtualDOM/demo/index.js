function setAttr(node, key, value){
    switch (key) {
        case 'style':
            node.style.cssText = value;
            break;
        case 'value': {
            const tagName = node.tagName.toLowerCase() || '';
            if (tagName === 'input' || tagName === 'textarea') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break;
        }
        default:
            node.setAttribute(key, value);
            break;
    }
};
function Element(tagName, props, children) {
    if (!(this instanceof Element)) {
        return new Element(tagName, props, children);
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : undefined;

    let count = 0;
    this.children.forEach((child) => {
        if (child instanceof Element) {
            count += child.count;
        }
        count++;
    });
    this.count = count;
}

Element.prototype.render = function() {
    // 创建标签
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const propName in props) {
        setAttr(el, propName, props[propName]);
    }

    this.children.forEach((child) => {
        const childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
        el.appendChild(childEl);
    });

    return el;
};

var tree = Element('div', { id: 'vdom-div' }, [
    Element('div', {}, ['vdom-div']),
    Element('img', {src:'https://avatars1.githubusercontent.com/u/22017372'}, []),
    Element('ul', {}, [
        Element('li', { class: 'item' }, ['li-01']),
        Element('li', { class: 'item' }, ['li-02']),
        Element('li', { class: 'item' }, ['li-03']),
    ]),
]);
console.log(tree)
var root = tree.render();
document.getElementById('demo').appendChild(root);