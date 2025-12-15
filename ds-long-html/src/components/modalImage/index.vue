<template>
  <el-dialog
    title="预览"
    :visible.sync="visible"
    width="50%"
    :close-on-click-modal="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :before-close="handleClose"
  >
    <div class="container">
      <img :src="imageURL" alt="" />
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
      imageURL: "",
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
