import index from "./index.vue";
export default {
  install: (Vue) => {
    const IndexConstractor = Vue.extend(index);
    const instance = new IndexConstractor();
    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);
    Vue.prototype.$modalPreview = ({
      callback,
      id,
      chapterId = undefined,
      type,
      API_chapterPage = null,
      API_chapterPre = null,
    }) => {
      instance.visible = true;
      if (id) {
        instance.id = id;
      }
      if (callback) {
        instance.callback = callback;
      }
      if (chapterId) {
        instance.chapterId = chapterId;
      }
      if (type) {
        instance.type = type;
      }
      if (API_chapterPage) {
        instance.API_chapterPage = API_chapterPage;
      }
      if (API_chapterPre) {
        instance.API_chapterPre = API_chapterPre;
      }
      instance.init(id, chapterId);
    };
  },
};
