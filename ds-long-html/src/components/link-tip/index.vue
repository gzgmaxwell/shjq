<template>
  <el-popover
    :placement="placement"
    :title="title"
    :width="width"
    :trigger="trigger"
  >
    <div class="tooltip-content">
      <p>{{ content }}</p>
      <p @click="check" class="link">
        {{ checkURL }}
      </p>
    </div>
    <span slot="reference" class="el-icon-question question"></span>
  </el-popover>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      default: "top-start",
    },
    title: {
      type: String,
      default: "标题",
    },
    width: {
      type: String,
      default: "250",
    },
    trigger: {
      type: String,
      default: "hover",
    },
    content: {
      type: String,
      default: "提示内容",
    },
    checkURL: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    check() {
      window.open(this.checkURL, "檢查", "_blank");
    },
  },
};
</script>
<style lang="scss" scoped></style>
