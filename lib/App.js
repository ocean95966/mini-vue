import { h } from "./mini-vue.esm.js";

const Child = {
  name: "child",
  props: ['title'],
  setup() {},

  render({title}) { console.log(arguments)
    return h("div", {}, title);
  },
};


export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [h(Child, {title: '这是传递给子组件的props'}), 'this is a text componet']);
  },
};