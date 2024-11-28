<template>
  <el-card shadow="hover" body-style="padding:0px;border-radius:0px 0px 6px 6px">
    <div style="display:flex;margin:30px 10px">
      <div style="width:70px;height:70px;border:1px solid black">
        <div style="width:50px;height:50px;border:1px solid black;border-radius:25px;;margin:auto">
          <img :src="options.src" />
        </div>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;">
        <div> <span style="font-weight:bold;">{{options.title}}</span> </div>
        <div>{{options.text}}</div>
      </div>
    </div>
    <div style="border:1px solid #fff;background:red;border-radius:0px 0px 6px 6px">
      <h3 style="text-align:center;">进 入</h3>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#demo{
    font-weight: bold;
}
</style>
