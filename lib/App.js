import { h, ref } from "./mini-vue.esm.js";


const Child = {
  name: "child",
  props: ['title'],
  setup() {
    const count = ref(1);

    setTimeout(() => count.value ++, 1000)

    return {
      count
    }
  },

  render({title, count}) { 
    return h("div", {}, `props:`+title + `<br/> state: count:  ` + count.value);
  },
};


export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [h(Child, {title: '这是传递给子组件的props'}), 'this is a text componet']);
  },
};