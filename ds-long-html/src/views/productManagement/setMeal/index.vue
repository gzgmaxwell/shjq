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
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑套餐' : '新增套餐'"
      :visible.sync="visible"
      width="35%"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { pageHandle } from "@/util/pageHandle";
import { queryPage } from "@/api/content/index";
import { servicePackageDelete } from "@/api/admin/role";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import create from "./create.vue";
import { filterNullSearchData, resetSearchData } from "@/util/util";

export default {
  components: {
    tableSearch,
    search,
    create,
  },
  data() {
    return {
      loading: false,
      visible: false,
      soruceVisible: false,
      row: {},
      searchForm: [
        {
          label: "套餐名称:",
          type: "input",
          prop: "name",
          placeholder: "请输入套餐名称",
          clearable: true,
          labelWidth: "50",
        },
        {
          label: "创建时间:",
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        name: "",
        dateTime: [],
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "重置",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.$store
                    .dispatch("GetMenu", { type: true, id: -1 })
                    .then((data) => {
                      if (data.length === 0) return;
                      this.$router.$avueRouter.formatRoutes(data, true);
                      window.location.reload();
                      this.getList();
                    });
                }
                this.visible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "套餐名称",
          prop: "name",
        },
        {
          label: "权限",
          prop: "menuCount",
        },
        {
          label: "创建人",
          prop: "createUsername",
        },
        {
          label: "租户数量",
          prop: "serviceCount",
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
        {
          label: "操作",
          type: "html",
          width: "100",
          html: () => {
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            return `${edit} ${del}`;
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
                    this.$store
                      .dispatch("GetMenu", { type: true, id: -1 })
                      .then((data) => {
                        if (data.length === 0) return;
                        this.$router.$avueRouter.formatRoutes(data, true);
                        window.location.reload();
                        this.getList();
                      });
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "del") {
              this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  servicePackageDelete(row.id).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      return this.$message.success("删除成功");
                    }
                  });
                })
                .catch(() => {});
            }
          },
        },
      ],
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
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      queryPage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
  },
};
</script>
