// 组件的类型
export const enum ShapeFlags {
    // 最后要渲染的 element 类型
    ELEMENT = 1,
    // 组件类型
    STATEFUL_COMPONENT = 4,
    // vnode 的 children 为 string 类型
    TEXT_CHILDREN = 8,
    // vnode 的 children 为数组类型
    ARRAY_CHILDREN = 16,
  }