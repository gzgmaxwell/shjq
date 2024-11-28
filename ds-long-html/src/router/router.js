import Vue from "vue";
import VueRouter from "vue-router";
import comPage from "./comPage";
import views from "./views";
import AvueRouter from "./avue-router";
import Store from "../store/index";

Vue.use(VueRouter);

let Router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0,
      };
    }
  },
  routes: [...comPage, ...views],
});
AvueRouter.install(Router, Store);
Router.$avueRouter.formatRoutes(Store.state.user.menu, true);
export default Router;
