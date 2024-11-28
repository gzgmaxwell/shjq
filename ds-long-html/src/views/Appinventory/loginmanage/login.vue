<template>
  <div>
    <basic-container>
      <el-form
        :inline="true"
        :model="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item>
          <el-button type="primary" @click="create">+新建</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column label="文件">
          <template v-slot="scope">
            <img :src="scope.row.coverFileUrl" alt="" width="100" height="50" />
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="260"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="jumpAddress" label="链接地址"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            {{ scope.row.status ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="展示时间" width="260">
          <template v-slot="scope">
            {{ scope.row.startTime }}
            {{ scope.row.startTime || scope.row.endTime != null ? "—" : ""
            }}{{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="权重"> </el-table-column>
        <el-table-column prop="createUser" label="创建人"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>

        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              style="color: red"
              size="mini"
              type="text"
              @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="ruleForm.total"
        :ruleForm="ruleForm.current"
        :limit="ruleForm.size"
        @pagination="pagination"
      ></pagination>
      <CreateLoginDialog
        @onChange="handleChange"
        :row="row"
        :dialogVisible.sync="dialogVisible"
      />
    </basic-container>
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { appLoginDelete, appLoginList } from "@/api/Appinventory/enter";
import CreateLoginDialog from "./component/createLoginDialog.vue";
export default {
  components: {
    pagination,
    CreateLoginDialog,
  },
  data() {
    return {
      dialogVisible: false,
      row: {},
      loading: false,
      ruleForm: {
        current: 1,
        size: 10,
        total: 10,
      },
      tableData: [], //表格数据
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    handleChange(data) {
      if (data) {
        this.getList();
      }
    },
    //页码与条数发生变化时
    pagination(val) {
      if (this.ruleForm.size != val.limit) {
        this.ruleForm.current = 1;
        this.ruleForm.size = val.limit;
      } else {
        this.ruleForm.current = val.page;
        this.ruleForm.size = val.limit;
      }
    },
    // 获取列表数据
    getList() {
      this.loading = true;
      appLoginList(this.ruleForm).then((res) => {
        const { data } = res;
        this.loading = false;
        if (data.data.records.length == 0 && this.ruleForm.current != 1) {
          this.ruleForm.current = this.ruleForm.current - 1;
          this.getList();
          return;
        }
        this.tableData = data.data.records;
        this.ruleForm.total = data.data.total;
      });
    },
    // 删除列表数据
    del(id) {
      this.loading = true;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          appLoginDelete(id).then(() => {
            this.loading = false;
            this.getList();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 添加数据列表
    create() {
      this.row = {};
      this.dialogVisible = true;
    },
    // 编辑列表数据
    edit(row) {
      this.dialogVisible = true;
      this.row = row;
    },
  },
};
</script>
<style lang="scss" scoped></style>
