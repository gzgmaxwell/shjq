import index from "./index.vue";
export default {
  install: (Vue) => {
    const IndexConstractor = Vue.extend(index);
    const instance = new IndexConstractor();
    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);
    Vue.prototype.$modalReject = ({
      callback,
      refuseType = "VIDEO_CONTENT",
      tip,
      doubleSelect = false,
    }) => {
      instance.visible = true;
      instance.doubleSelect = doubleSelect;
      if (callback) {
        instance.callback = callback;
      }
      if (tip) {
        instance.tip = tip;
      }
      instance.getInfo(refuseType);
    };
  },
};
