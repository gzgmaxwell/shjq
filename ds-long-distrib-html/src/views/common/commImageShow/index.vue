<template>
  <div class="imgBox">
    <img :src="props.row.fullUrl" class="img" alt="" />
  </div>
</template>

<script lang="ts" setup>
const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});
</script>
<style lang="scss" scoped>
.imgBox {
  display: flex;
  align-items: center;
  justify-content: center;

  .img {
    display: inline-block;
    width: 100%;
    max-height: 400px;
  }
}
</style>
