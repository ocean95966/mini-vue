import { h, ref, reactive, isReactive, effect } from "./mini-vue.esm.js";


const Child = {
  name: "child",
  props: ['title'],
  setup() {
    const count = reactive({count: 1});

  //  setInterval(() => count.count ++, 1000)

    return {
      count
    }
  },

  render({title, count}) { 
    console.log(title, 9999999999)
    return h("div", {}, `props:`+title + `<br/> state: count:  ` + count.count);
  },
};


export default {
  name: "App",
  setup() {
    const counter = ref(1)
    setInterval(() => counter.value ++, 1000)
    return {
      counter
    }
  },

  render({counter}) {
    return h("div", { tId: 1 }, [h(Child, {title: `这是传递给子组件的props()`}), 'this is a text componet']);
  },
};