<template>
  <basic-container>
    <iframe
      v-if="$route.query.src"
      :src="$route.query.src"
      class="iframe"
      ref="iframe"
    ></iframe>
    <iframe v-else :src="urlPath" class="iframe" ref="iframe"></iframe>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
export default {
  name: "AvueIframe",
  data() {
    return {
      urlPath: this.getUrlPath(),
    };
  },
  created() {
    NProgress.configure({ showSpinner: false });
  },
  mounted() {
    this.load();
    this.resize();
  },
  props: ["routerPath"],
  watch: {
    $route: function () {
      this.load();
    },
    routerPath: function () {
      this.urlPath = this.getUrlPath();
    },
  },
  components: {
    ...mapGetters(["screen"]),
  },
  methods: {
    show() {
      NProgress.start();
    },
    hide() {
      NProgress.done();
    },
    resize() {
      window.onresize = () => {
        this.iframeInit();
      };
    },
    load() {
      this.show();
      var flag = true; //URL是否包含问号
      if (this.$route.query.src.indexOf("?") == -1) {
        flag = false;
      }
      var list = [];
      for (var key in this.$route.query) {
        if (key != "src" && key != "name") {
          list.push(`${key}= this.$route.query[key]`);
        }
      }
      list = list.join("&").toString();
      if (flag) {
        this.$route.query.src = `${this.$route.query.src}${
          list.length > 0 ? `&list` : ""
        }`;
      } else {
        this.$route.query.src = `${this.$route.query.src}${
          list.length > 0 ? `?list` : ""
        }`;
      }
      let time = 5;
      const timeFunc = setInterval(() => {
        time--;
        if (time == 0) {
          this.hide();
          clearInterval(timeFunc);
        }
      }, 1000);
      this.iframeInit();
    },
    iframeInit() {
      const iframe = this.$refs.iframe;
      const clientHeight =
        document.documentElement.clientHeight - (screen > 1 ? 200 : 130);
      iframe.style.height = `${clientHeight}px`;
      if (iframe.attachEvent) {
        iframe.attachEvent("onload", () => {
          this.hide();
        });
      } else {
        iframe.onload = () => {
          this.hide();
        };
      }
    },
    getUrlPath: function () {
      let url = window.location.href;
      url = url.replace("/myiframe", "");
      return url;
    },
  },
};
</script>

<style lang="scss">
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
