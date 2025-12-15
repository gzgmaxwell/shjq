import index from "./index.vue";
import { EnumCartoonType } from "@/util/util";
import store from "@/store";
export default {
  install: (Vue) => {
    const IndexConstractor = Vue.extend(index);
    const instance = new IndexConstractor({ store });
    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);
    Vue.prototype.$modalGraphic = ({
      callback,
      row,
      type = EnumCartoonType.comic,
      author = false,
      submit = false,
      check = false,
    }) => {
      instance.visible = true;
      if (callback) {
        instance.callback = callback;
      }
      if (row) {
        instance.row = row;
      }
      if (type) {
        instance.type = type;
      }
      instance.author = author;
      instance.submit = submit;
      instance.check = check;
      instance.init();
    };
  },
};
