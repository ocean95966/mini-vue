import { ShapeFlags } from '../shared/shapeFlags'
export const createVNode = (type: any, props: any = {}, children?: string | Array<any>) => {
    const vnode = {
        el: null,
        component: null,
        key: props.key || null,
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type)
    }

    if (Array.isArray(children)) {
      vnode.shapeFlag = vnode.shapeFlag || ShapeFlags.ARRAY_CHILDREN
    } else if (typeof children === 'string') {
        vnode.shapeFlag = vnode.shapeFlag || ShapeFlags.TEXT_CHILDREN
    }
    
    return vnode;
}

function getShapeFlag(type: any) {
    return typeof type === "string"
      ? ShapeFlags.ELEMENT
      : ShapeFlags.STATEFUL_COMPONENT;
  }