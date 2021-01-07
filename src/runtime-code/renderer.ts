import { ShapeFlags } from "../shared";
import {createComponentInstance} from './component'

export const render = (vnode: any, container: string | HTMLElement) => {
    patch(null, vnode, container)
}

function patch(n1, n2, container = null) {
    const {type, shapeFlag} = n2

    switch(type) {
        case 'text':
            break;
        default:

          if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            processComponent(n1, n2, container)
          }
    }
}

function processComponent(n1, n2, container) {
    if (!n1) {
        mountComponent(n2, container);  
    }
}

function mountComponent(initialVNode, container) {
    const instance = (initialVNode.component = createComponentInstance(initialVNode))

    setupComponent(instance)

    setupRenderEffect(instance, container)
}

function setupComponent(instance) {
    initProps()

    setupStatefulComponent(instance)
}

function initProps() {

}

function setupStatefulComponent(instance) {
    
    const setupResult = instance.setup && instance.setup(instance.props)

    handleSetupResult(instance, setupResult)

}

function handleSetupResult(instance, setupResult) {
   if (typeof setupResult === 'object') {
       instance.setupState = setupResult
   }

   finishComponentSetup(instance)
}


function finishComponentSetup(instance) {
   const Component = instance.type;

   instance.render = Component.render
}

function setupRenderEffect(instance, container) {

}