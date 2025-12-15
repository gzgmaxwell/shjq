import modalPatchAuthors from "./index.vue";
export default {
  install: (Vue) => {
    const ImageConstractor = Vue.extend(modalPatchAuthors);
    const instance = new ImageConstractor();
    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);
    Vue.prototype.$modalPatchAuthors = ({ callback }) => {
      instance.visible = true;
      if (callback) {
        instance.callback = callback;
      }
      instance.getInfo();
    };
  },
};
