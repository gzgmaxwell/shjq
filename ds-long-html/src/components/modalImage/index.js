import modalImage from "./index.vue";
export default {
  install: (Vue) => {
    const ImageConstractor = Vue.extend(modalImage);
    const instance = new ImageConstractor();
    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);
    Vue.prototype.$modalImage = ({ callback, imageURL }) => {
      instance.visible = true;
      if (imageURL) {
        instance.imageURL = imageURL;
      }
      if (callback) {
        instance.callback = callback;
      }
    };
  },
};
