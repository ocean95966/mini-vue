import { h, ref, reactive, isReactive, effect } from "./mini-vue.esm.js";


const Child = {
  name: "child",
  props: ['title'],
  setup() {
    const count = reactive({count: 1});
    effect(() => console.log(`zhixingle ${count.count}`))
    return {
      count
    }
  },

  render({title, count}) { 

    return h("div", {}, `props:`+ title + `<br/> state: count:  ` + count.count);
  },
};


console.log(h('div', {}, 'div text'))

export default {
  name: "App",
  setup() {
    const title = ref('这是传递给子组件的props()')
    setTimeout(() => title.value = Math.random(), 1000)
    console.log('=============')
    console.log(h("div", { tId: 1 }, [h(Child, {title}), 'this is a text componet']))
    return {
      title
    }
  },

  render({title}) {
    return h("div", { tId: 1 }, [h(Child, {title}), 'this is a text componet']);
  },
};