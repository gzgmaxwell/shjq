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
      :operation="operation"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      center
      v-if="visible"
      width="30%"
      :close-on-click-modal="false"
    >
      <violationEdit :row="row"></violationEdit>
    </el-dialog>
    <el-dialog
      :visible.sync="in8nVisible"
      width="30%"
      title="国际化"
      :close-on-click-modal="false"
    >
      <createIn18n v-if="in8nVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>
<script>
import createIn18n from "@/views/content/navigation/component/createIn18n.vue";
import { queryList, delObj } from "@/api/report-and-feedback/violation.js";
import violationEdit from "@/views/report-and-feedback/violation/violationEdit.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";
// 4.29需求屏蔽
// import { optionsClassifyType } from "@/util/util";

export default {
  components: {
    tableSearch,
    search,
    violationEdit,
    createIn18n,
  },
  data() {
    return {
      loading: false,
      visible: false,
      in8nVisible: false,
      row: {},
      tableData: [],
      searchForm: [
        {
          label: "违规原因:",
          type: "input",
          prop: "classifyName",
          placeholder: "请输入违规原因",
          clearable: true,
          labelWidth: "75px",
        },
        {
          label: "创建用户:",
          type: "input",
          prop: "createUserName",
          placeholder: "请输入创建用户",
          clearable: true,
        },
        // 4.29需求屏蔽
        // {
        //   label: "分类:",
        //   type: "select",
        //   prop: "classifyType",
        //   placeholder: "请选择分类",
        //   clearable: true,
        //   options: optionsClassifyType,
        // },
      ],
      searchData: {
        classifyName: "",
        createUserName: "",
        classifyType: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              isShow: true,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visible = false;
              },
            };
          },
        },
      ],
      tableLabel: [
        {
          prop: "classifyName",
          label: "违规原因",
        },
        {
          prop: "createUserName",
          label: "创建用户",
        },
        // 4.29需求屏蔽
        // {
        //   prop: "classifyType",
        //   label: "分类",
        //   type: "filter",
        //   filter: (row) => {
        //     const item =
        //       optionsClassifyType.find((v) => v.id === row.classifyType) || {};
        //     return item.name;
        //   },
        // },
        {
          prop: "createTime",
          label: "创建时间",

          sortable: true,
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          html: (row) => {
            let btn = `
              <span class='comBtn link' data-tagName="edit">编辑</span>
              <span class='comBtn danger' data-tagName="del">删除</span>`;
            let in18 = `<span class='comBtn link' data-tagName="in18">国际化</span>`;
            if (this.permissions?.reportfeedback_violation_in18n) {
              return `${btn}${in18}`;
            }
            return `${btn}`;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "edit") {
              this.visible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "del") {
              this.$confirm("是否确认删除?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  delObj(row).then((res) => {
                    if (res.data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      this.$message.success("删除成功");
                    }
                  });
                })
                .catch(() => {});
            } else if (tagname === "in18") {
              this.in8nVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.in8nVisible = false;
                },
              };
            }
          },
        },
      ],
      operation: {},

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

  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      queryList(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        }
      });
    },

    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData = {};
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #0285bd;
  padding: 5px 10px;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>
