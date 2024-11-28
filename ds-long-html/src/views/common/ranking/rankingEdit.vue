<template>
  <div>
    <div style="display: flex">
      <div style="margin-top: 5px">{{ competition.title }}</div>
      <div style="margin-left: 10px">
        <el-input
          placeholder="请输入调整位置"
          v-model.number="sort"
          oninput="value=value.replace(/[^\d]/g,'')"
          clearable
        >
        </el-input>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="competition.callback && competition.callback()"
        >取 消</el-button
      >
      <el-button type="primary" @click="stationary">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    competition: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      sort: "",
    };
  },
  methods: {
    stationary() {
      if (this.sort == "") {
        this.$message.error("请输入调整位置");
        return;
      }
      let params = {
        sort: this.sort,
      };
      return this.competition.callback(params);
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
</style>
