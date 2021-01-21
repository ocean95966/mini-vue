import { effect, toRaw, isReactive, isRef, unref, reactive } from "@vue/reactivity";
import { ShapeFlags } from "../shared";
import { createComponentInstance } from './component'
import { queueJob } from "./scheduler";
import {createVNode, isVNode} from './createVNode'
import {
    hostCreateElement,
    hostSetElementText,
    hostPatchProp,
    hostInsert,
    hostRemove,
    hostCreateTextElement
  } from "./render-api";


export const render = (vnode: any, container: string | HTMLElement) => {
    patch(null, vnode, container)
}

function patch(n1, n2, container = null) {
    const { type, shapeFlag } = n2
 
    switch (type) {
        case 'text':
            console.log("处理 TEXT");
            processText(n1, n2, container);
            break;
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                console.log("处理 element");
                processElement(n1, n2, container);
            }
            
            else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { 
                console.log('处理 component')
                processComponent(n1, n2, container)
            }
    }
}

function processComponent(n1, n2, container) {
    if (!n1) {
        mountComponent(n2, container);
    } else {
        updateComponent(n1, n2)
    }
}

function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component);
    console.log(n2, 'n22222222')
}


function processText  (n1, n2, container, anchor = null) {
    if (n1 == null) {
        hostInsert((n2.el = hostCreateTextElement(n2.children)), container, anchor);
    }
};
function processElement(n1, n2, container) {
    if (!n1) {
      mountElement(n2, container);
    } else {
        patchElement(n1, n2)
    }
}

function patchElement(n1, n2) {
   const el = (n2.el = n1.el)
   hostSetElementText(el, n2.children);
}


function mountElement(vnode, container) {
    const { shapeFlag, props } = vnode;
    // 1. 先创建 element
    // 基于可扩展的渲染 api
    const el = (vnode.el = hostCreateElement(vnode.type));
  
    // 支持单子组件和多子组件的创建
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 举个栗子
      // render(){
      //     return h("div",{},"test")
      // }
      // 这里 children 就是 test ，只需要渲染一下就完事了
      console.log(`处理文本:${vnode.children}`);
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 举个栗子
      // render(){
      // Hello 是个 component
      //     return h("div",{},[h("p"),h(Hello)])
      // }
      // 这里 children 就是个数组了，就需要依次调用 patch 递归来处理
      mountChildren(vnode.children, el);
    }
  
    // 处理 props
    if (props) {
      for (const key in props) {
        // todo
        // 需要过滤掉vue自身用的key
        // 比如生命周期相关的 key: beforeMount、mounted
        const nextVal = props[key];
        hostPatchProp(el, key, null, nextVal);
      }
    }
    // 插入
    hostInsert(el, container);

  }


function mountChildren(children, el) {
    children.forEach((VNodeChild) => {

        if (isVNode(VNodeChild)) {
            patch(null, VNodeChild, el);
        } else if (typeof VNodeChild === 'string') {
            const vnode = createVNode('text', {}, VNodeChild)
            patch(null, vnode, el)
        }
    });
}

function mountComponent(initialVNode, container) {
    const instance = (initialVNode.component = createComponentInstance(initialVNode))

    setupComponent(instance)

    setupRenderEffect(instance, container)
}

function setupComponent(instance) {  
   
    initProps(instance)

    setupStatefulComponent(instance)


}

function initProps(instance) {
   const {props} = instance.vnode;
   instance.props = props
}

function exposePropsOnRenderContext(instance) {
    const { proxy, props } = instance;
    if (props) {
        Object.keys(props).forEach(key => {
            Object.defineProperty(proxy, key, {
                enumerable: true,
                configurable: true,
                get: () => instance.props[key],
                set: () => undefined
            });
        });
    }
}

function exposeStateOnRenderContext(instance) {
    const { proxy, setupState } = instance;
    if (setupState) {
        Object.keys(toRaw(setupState)).forEach(key => {
            Object.defineProperty(proxy, key, {
                enumerable: true,
                configurable: true,
                get: () => setupState[key],
                set: () => undefined
            });
        });
    }
}


function setupStatefulComponent(instance) {


    let setupContext = createSetupContext(instance)

    const {setup} = instance.type
   
    const setupResult = setup ? setup(...[instance.props, setupContext]) : {}
   
    exposePropsOnRenderContext(instance)

    handleSetupResult(instance, setupResult)

}

const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
        }
        else {
            return Reflect.set(target, key, value, receiver);
        }
    }
};

function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs)
        ? objectWithRefs
        : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        // 这里不用proxyRefs也行? 使用了proxyRefs  isReactive === false?
        instance.setupState = proxyRefs(setupResult)
    }
   
    exposeStateOnRenderContext(instance)

    finishComponentSetup(instance)
}


function finishComponentSetup(instance) {
    const Component = instance.type;

    instance.render = Component.render
}


function createSetupContext(instance) {
    return {
        props: instance.props,
        slots: {},
        emit: () => {} 
    }
}

function setupRenderEffect(instance, container) {
    instance.update = effect(function componentEffect() {   
        if (!instance.isMounted) {
            instance.subTree = instance.render(instance.proxy)
            
            patch(null, instance.subTree, container)
            instance.isMounted = true
        } else {
            const nextTree = instance.render(instance.proxy)
            const prevTree = instance.subTree;
            instance.subTree = nextTree

            patch(prevTree, nextTree, prevTree.el)
        }
    }, {
        scheduler: (effect) => {
            queueJob(effect)
        }
    })
}