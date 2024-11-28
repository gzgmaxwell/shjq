<template>
  <video
    controls
    id="videoRef"
    ref="videoRef"
    style="width: 100%; height: 200px"
  ></video>
</template>
<script>
export default {
  props: {
    single: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      video: null,
    };
  },
  mounted() {
    this.show();
  },
  methods: {
    show() {},
  },
};
</script>
<style></style>
