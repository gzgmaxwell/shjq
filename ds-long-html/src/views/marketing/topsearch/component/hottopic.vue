<template>
  <!-- 营销中心/热搜管理/热搜词统计 -->
  <div>
    <el-form
      :inline="true"
      :model="ruleForm"
      label-width="55px"
      class="demo-ruleForm"
    >
      <el-form-item label="话题：">
        <el-input
          placeholder="请输入话题"
          clearable
          v-model="ruleForm.topicName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="create">+新建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%" align="center">
      <!-- <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column> -->
      <el-table-column prop="sort" label="当前排序" width="100" align="center">
      </el-table-column>
      <el-table-column prop="topicName" label="话题" align="center">
      </el-table-column>
      <el-table-column prop="topicContent" label="话题详情" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template v-slot="scope">
          {{ compuStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right" align="center">
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
    <createHotTopicDialog
      :row="row"
      @onChange="dialogChange"
      :dialogVisible.sync="dialogVisible"
    />
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import {
  substanceHotTopicPage,
  substanceHotTopicUpdate,
} from "@/api/marketing/topsearch";
import createHotTopicDialog from "./createHotTopicDialog";
import { pageHandle } from "@/util/pageHandle";
import { optionStatus } from "@/util/util";

export default {
  components: {
    pagination,
    createHotTopicDialog,
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      row: {},
      ruleForm: {
        current: 1,
        size: 10,
        total: 10,
      },
      tableData: [], //表格数据
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
    // 当前页数发生变化
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
    // 获取列表数据
    getList() {
      substanceHotTopicPage(this.ruleForm).then((res) => {
        const { data } = res;
        this.ruleForm.total = data.data.total;
        this.tableData = data.data.records;
      });
    },
    // 查询列表数据
    search() {
      this.ruleForm.current = 1;
      this.ruleForm.size = 10;
      this.getList();
    },
    create() {
      this.row = {};
      this.dialogVisible = true;
    },
    dialogChange(data) {
      if (data) {
        this.getList();
      }
    },
    // 重置查询数据
    reset() {
      this.ruleForm = {
        current: 1,
        size: 10,
        total: 10,
        topicName: "", //热搜词
      };
      this.getList();
    },
    // 编辑广告信息
    edit(row) {
      this.row = row;
      this.dialogVisible = true;
    },
    // 删除表格数据项
    del(row) {
      const params = {
        status: -1,
        id: row.id,
      };
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          substanceHotTopicUpdate(params).then((res) => {
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
  },
};
</script>

<style lang="scss" scoped></style>
