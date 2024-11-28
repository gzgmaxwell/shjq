<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="font-weight: bold">{{ title }}</div>
      <div style="display: flex; margin-bottom: 10px">
        <div
          style="display: flex"
          v-for="(item, index) in searchList"
          :key="index"
        >
          <span
            :style="`width:${
              item.labelWidth ? item.labelWidth : '120'
            }px;line-height:30px;font-size:14px;`"
            >{{ item.label }}:</span
          >
          <el-cascader
            v-if="item.formType === 'cascader'"
            v-model="item.value"
            :options="searchOptions"
            :props="item.props"
            :show-all-levels="false"
          ></el-cascader>
          <el-date-picker
            v-else-if="item.formType === 'date'"
            v-model="item.value"
            type="datetimerange"
            range-separator="~"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-input
            v-else
            type="text"
            :placeholder="item.place"
            v-model="item.value"
          />&emsp;
        </div>
        &emsp;
        <el-button
          v-if="searchList.length > 0"
          type="primary"
          slot="append"
          icon="el-icon-search"
          @click.enter="searchHandler"
          >搜索</el-button
        >
        <el-button
          v-if="searchList.length > 0 && resetShow"
          slot="append"
          icon="el-icon-refresh"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <!-- 表格数据 -->
    <bas-table
      :tableColumns="tableColumns"
      :tableData="tableData"
      :border="true"
      :tableOperation="tableOperation"
      :loading="loading"
      @handleClick="handleClick"
    ></bas-table>
    <!-- 分页 -->
    <bas-pagination
      :total="total"
      :page="page"
      :limit="limit"
      @pagination="pagination"
    ></bas-pagination>
  </div>
</template>

<script>
import basTable from "@/components/bas-table";
import basPagination from "@/components/bas-pagination";

export default {
  components: {
    basTable,
    basPagination,
  },
  props: {
    //   标题
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    // 搜索
    searchList: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    // 搜索下拉
    searchOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 表格数据
    tableData: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    // 表格模板
    tableColumns: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    // 操作模板
    tableOperation: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 总条目数
    total: {
      required: true,
      type: Number,
    },
    // 当前页数
    page: {
      type: Number,
    },
    // 每页显示条目个数
    limit: {
      type: Number,
    },
    resetShow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    searchHandler() {
      let objs = {};
      this.searchList.map((item) => {
        let obj = eval("(" + `{${item.name}:"${item.value}"}` + ")");
        Object.assign(objs, obj);
      });
      this.$emit("searchClick", objs);
    },
    handleClick(row, type) {
      this.$emit("handleClick", row, type);
    },
    pagination(val) {
      this.$emit("pagination", val);
    },
    reset() {
      this.searchList.map((item) => {
        item.value = "";
      });
      this.$emit("resetSearch");
    },
  },
};
</script>

<style lang="scss" scoped></style>
