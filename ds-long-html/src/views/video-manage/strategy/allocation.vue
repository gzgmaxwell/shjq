<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :operation="operation"
    >
    </tableSearch>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <allocationEdit :row="row" v-if="visible"></allocationEdit>
    </el-dialog>
  </basic-container>
</template>

<script>
import allocationEdit from "@/views/video-manage/strategy/allocationEdit.vue";
import stateRep from "@/const/stateRep";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { getData, deleteData } from "@/api/video-manage/allocation.js";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    tableSearch,
    search,
    allocationEdit,
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: "",
      row: {},
      searchForm: [
        {
          label: "审核策略名称:",
          type: "input",
          prop: "strategyName",
          placeholder: "请输入审核策略名称...",
          clearable: true,
        },
      ],
      searchData: {
        strategyName: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.title = "新增";
            this.row = {
              status: "启用",
              callback: () => {
                this.visible = false;
                this.getList();
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "strategyName",
          label: "审核策略名称",
        },
        {
          prop: "status",
          label: "状态",
        },

        {
          prop: "workRounds",
          label: "审核人数",
        },

        {
          prop: "passRounds",
          label: "通过人数",
        },

        {
          prop: "classifyListName",
          label: "视频类别",
        },
        {
          prop: "times",
          label: "生效时间",

          width: "300",
        },
      ],
      operation: {
        label: "操作",
        width: "150",

        btnList: [
          {
            label: "编辑",
            type: "primary",
            callback: (row) => {
              this.visible = true;
              this.title = "编辑";
              this.row = {
                ...row,
                callback: () => {
                  this.visible = false;
                  this.getList();
                },
              };
            },
          },
          {
            label: "删除",
            type: "danger",
            callback: (row) => {
              this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  deleteData({ strategyIds: [row.id] }).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.$message.success("删除成功");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            },
          },
        ],
      },
      tablePage: {
        total: 1,
        current: 1,
        size: 10,
        pagination: (val) => {
          this.tablePage.current = val.page;
          this.tablePage.size = val.limit;
          this.getList();
        },
      },
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        strategyName: this.searchData.strategyName,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      getData(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data?.data?.records.map((item) => {
            item.times =
              item.startTime === null
                ? "长期"
                : `${item.startTime} -- ${item.endTime}`;
            const classifyNames = item.classifyList?.map(
              (item) => item.classifyName
            );
            const str = classifyNames?.join(" ") || "";
            item.classifyListName = str;
            item.status = stateRep.allocationType[item.status];
            return item;
          });
          this.tablePage.total = data?.data?.total || 0;
        }
      });
    },

    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.strategyName = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss"></style>
