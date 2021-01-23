import { ShapeFlags } from '../shared/shapeFlags'
export const createVNode = (type: any, props: any = {}, children?: string | Array<any>) => {
    const vnode = {
        el: null,
        component: null,
        key: props.key || null,
        type,
        props,
        children,
        __v_isVNode: true,
        shapeFlag: getShapeFlag(type)
    }
 
    return vnode;
}

function getShapeFlag(type: any) {
    return typeof type === "string"
      ? ShapeFlags.ELEMENT
      : ShapeFlags.STATEFUL_COMPONENT;
}

export function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
}