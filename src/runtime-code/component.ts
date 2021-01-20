export function createComponentInstance(vnode) {
    
    const instance = {
        type: vnode.type,
        vnode,
        props: {},
        proxy: {},
        isMounted: false,
        setupState: {},
    }

    return instance
}