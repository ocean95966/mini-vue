import { render } from './renderer'
import {createVNode} from './createVNode'
export const createApp = (rootComponent) => {
     const app = {
        _component: rootComponent,
        _container: null,
      
        mount(rootContainer) {  
            const vnode = createVNode(rootComponent)
            app._container = rootContainer
            render(vnode, rootContainer)
        }
     }
     
     return app;
}