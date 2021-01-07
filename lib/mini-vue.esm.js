// 组件的类型
var ShapeFlags;
(function (ShapeFlags) {
    // 最后要渲染的 element 类型
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    // 组件类型
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    // vnode 的 children 为 string 类型
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    // vnode 的 children 为数组类型
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

var createVNode = function (type, props, children) {
    if (props === void 0) { props = {}; }
    var vnode = {
        el: null,
        component: null,
        key: props.key || null,
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type)
    };
    if (Array.isArray(children)) {
        vnode.shapeFlag = vnode.shapeFlag || ShapeFlags.ARRAY_CHILDREN;
    }
    else if (typeof children === 'string') {
        vnode.shapeFlag = vnode.shapeFlag || ShapeFlags.TEXT_CHILDREN;
    }
    return vnode;
};
function getShapeFlag(type) {
    return typeof type === "string"
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
}

var createApp = function (rootComponent) {
    var app = {
        _component: rootComponent,
        _container: null,
        mount: function (rootContainer) {
            var vnode = createVNode(rootComponent);
            app._container = rootContainer;
        }
    };
    return app;
};

var h = function () { };

export { createApp, h };
//# sourceMappingURL=mini-vue.esm.js.map
