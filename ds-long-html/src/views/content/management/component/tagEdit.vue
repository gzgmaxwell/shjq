<template>
  <div class="tagList">
    <div class="TipsStyle">
      <i class="el-icon-warning" style="color: #faad14"></i>
      注意：选择标签添加至视频，不会覆盖视频的历史标签；若选择的标签存在视频中，则不会生效
    </div>
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <div style="margin: 15px 0"></div>
    <el-checkbox-group
      v-model="checkedCities"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox
        v-for="item in classifyOptions"
        :label="item.id"
        :key="item.id"
      >
        <div v-if="item.classifyStatus == '0'">
          <span>{{ item.classifyName }}</span>
          <span style="color: #66b1ff">(已隐藏)</span>
        </div>
        <div v-else>
          {{ item.classifyName }}
        </div>
      </el-checkbox>
    </el-checkbox-group>
    <span style="display: block; margin-top: 20px; text-align: right">
      <el-button @click="row.callback && row.callback()">取 消</el-button>
      <el-button type="primary" @click="Submit">确 定</el-button>
    </span>
  </div>
</template>
<script>
import { onlineClassifyBatchReplace } from "@/api/admin/index";
import { debounceCallBack } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  props: {
    row: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      tagIds: [],
      isIndeterminate: false,
    };
  },
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
    }),
    selectedTimeLength() {
      return videoLength(this.searchData.tiemData, optionsTimeType);
    },
  },
  methods: {
    handleCheckAllChange(val) {
      const ids = this.classifyOptions.map((item) => item.id);
      this.checkedCities = val ? ids : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      this.checkedCities = value;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.classifyOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.classifyOptions.length;
    },
    Submit() {
      const params = {
        classifyIds: this.checkedCities,
        onlineIds: this.row.idsArr,
      };
      const comSubmit = () => {
        return onlineClassifyBatchReplace(params)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("编辑成功");
              this.row.callback(true);
            }
          })
          .catch(() => {});
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>
<style lang="scss" scoped>
.tagList {
  .el-checkbox-group {
    .el-checkbox {
      line-height: 35px;
    }
  }
}
.TipsStyle {
  border: 1px solid #ffe58f;
  background: #fffbe6;
  border-radius: 5px;
  padding: 6px;
  margin-bottom: 20px;
  margin-top: -20px;
}
</style>
