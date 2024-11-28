<template>
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in routes" :key="index"
        ><span>{{ $t(item.name) }}</span></el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    routes: {
      type: Array,
      required: true,
      default: () => {
        return {};
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.breadcrumb {
  padding: 20px;
  background: #fff;
}
</style>
