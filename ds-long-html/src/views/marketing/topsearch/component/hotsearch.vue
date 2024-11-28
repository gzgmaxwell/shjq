<template>
  <div>
    <el-form
      :inline="true"
      :model="ruleForm"
      label-width="90px"
      class="demo-ruleForm"
    >
      <el-form-item label="搜索内容：">
        <el-input
          v-model="ruleForm.hotSearchName"
          clearable
          placeholder="请输入搜索内容"
        ></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select placeholder="请选择状态" clearable v-model="ruleForm.status">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="create">+新建</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%" border v-loading="loading">
      <!-- <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column> -->
      <el-table-column prop="sort" label="排序" align="center">
      </el-table-column>
      <el-table-column prop="hotSearchName" label="热搜内容" align="center">
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="scope">
          {{ compuStatus(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template v-slot="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button
            style="color: red"
            size="mini"
            type="text"
            @click="del(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="ruleForm.total"
      :page="ruleForm.current"
      :limit="ruleForm.size"
      @pagination="pagination"
    ></pagination>
    <createHotSearchDialog
      @onChange="handleChange"
      :row="row"
      :dialogVisible.sync="dialogVisible"
    />
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { hotSearchPage, hotSearchUpdate } from "@/api/marketing/topsearch";
import createHotSearchDialog from "./createHotSearchDialog.vue";
import { pageHandle } from "@/util/pageHandle";
import { optionStatus } from "@/util/util";
export default {
  components: {
    pagination,
    createHotSearchDialog,
  },
  data() {
    return {
      loading: false,
      row: {},
      ruleForm: {
        current: 1,
        size: 10,
        total: 10,
        status: "",
        hotSearchName: "",
      },
      options: optionStatus,
      tableData: [], //表格数据
      dialogVisible: false,
    };
  },
  computed: {
    compuStatus() {
      return (val) => {
        const item = optionStatus.find((v) => v.id === val) || {};
        return item.name;
      };
    },
  },
  mounted() {
    this.getList();
  },

  methods: {
    pagination(val) {
      if (this.ruleForm.size != val.limit) {
        this.ruleForm.current = 1;
        this.ruleForm.size = val.limit;
      } else {
        this.ruleForm.current = val.page;
        this.ruleForm.size = val.limit;
      }
      this.getList();
    },
    handleChange(data) {
      if (data) {
        this.getList();
      }
    },
    create() {
      this.row = {};
      this.dialogVisible = true;
    },
    getList() {
      this.loading = true;
      const statusCode = this.ruleForm.status === "" ? 2 : this.ruleForm.status;
      const params = {
        current: this.ruleForm.current,
        hotSearchName: this.ruleForm.hotSearchName,
        size: this.ruleForm.size,
        statusCode: statusCode,
      };
      hotSearchPage(params)
        .then((res) => {
          const { data } = res;
          if (data.data.records.length == 0 && this.ruleForm.current !== 1) {
            this.ruleForm.current = this.ruleForm.current - 1;
            this.getList();
            return;
          }
          this.loading = false;
          this.ruleForm.total = data.data.total;
          this.tableData = data.data.records;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    search() {
      this.ruleForm.current = 1;
      this.ruleForm.size = 10;
      this.getList();
    },
    reset() {
      this.ruleForm = {
        current: 1,
        size: 10,
        total: 10,
        status: "",
        hotSearchName: "",
      };
      this.getList();
    },
    del(row) {
      const params = {
        id: row.id,
        status: -1,
      };
      this.$confirm("是否确认删除该数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          hotSearchUpdate(params).then((res) => {
            if (res.data.code == 200) {
              const newCurrent = pageHandle(
                this.ruleForm.current,
                this.ruleForm.size,
                this.ruleForm.total
              );
              this.ruleForm.current = newCurrent;
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    // 编辑表格数据
    edit(row) {
      this.dialogVisible = true;
      this.row = row;
    },
  },
};
</script>

<style lang="scss" scoped></style>
