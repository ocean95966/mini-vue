import { h, ref, reactive, isReactive, effect } from "./mini-vue.esm.js";


const Child = {
  name: "child",
  props: ['title'],
  setup() {
    const count = reactive({count: 1});

    setInterval(() => count.count ++, 1000)
    effect(() => console.log(`count 变化了 ${count.count}`))
    return {
      count
    }
  },

  render({title, count}) { 
    return h("div", {}, `props:`+title + `<br/> state: count:  ` + count.count);
  },
};


export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [h(Child, {title: '这是传递给子组件的props'}), 'this is a text componet']);
  },
};