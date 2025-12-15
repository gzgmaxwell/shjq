import index from "./index.vue";
import store from "@/store";
export default {
  install: (Vue) => {
    const IndexConstractor = Vue.extend(index);
    const instance = new IndexConstractor({ store });
    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);
    Vue.prototype.$modalChapter = ({
      row,
      contentList = true,
      query = null,
      API = null,
      API_preview = null,
    }) => {
      instance.visible = true;
      instance.row = row;
      instance.query = query;
      instance.contentList = contentList;
      if (API) {
        instance.API = API;
      }
      if (API_preview) {
        instance.API_preview = API_preview;
      }
      instance.init();
    };
  },
};
