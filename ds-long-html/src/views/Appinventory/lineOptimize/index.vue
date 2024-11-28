<template>
  <basic-container>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isSelection="false"
      :isIndex="false"
    >
    </tableSearch>
    <el-dialog
      title="新增"
      :visible.sync="visible"
      width="30%"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <create :row="row"></create>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  filterNullSearchData,
  resetSearchData,
  optDomainType,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import create from "./create.vue";
import { linesPage, linesDelete } from "@/api/admin/index";
import { pageHandle } from "@/util/pageHandle";

export default {
  components: {
    tableSearch,
    search,
    create,
  },
  data() {
    return {
      row: {},
      loading: false,
      visible: false,
      that: this,
      searchForm: [
        {
          label: "域名:",
          type: "input",
          prop: "domain",
          placeholder: "请输入域名",
          clearable: true,
          labelWidth: "45px",
        },
        {
          label: "域名类型:",
          type: "select",
          prop: "type",
          labelWidth: "80px",
          options: optDomainType,
          placeholder: "请选择域名类型",
          clearable: true,
        },
      ],
      searchData: {
        domain: "",
        type: "",
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
          label: "新建",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
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
      tableData: [],
      tableLabel: [
        {
          prop: "domain",
          label: "域名",
        },
        {
          label: "域名类型",
          type: "filter",
          filter: (row) => {
            const item = optDomainType.find((item) => item.id === row.type);
            return item?.name;
          },
        },
        {
          prop: "createTime",
          label: "创建时间",
        },
        {
          label: "操作",
          width: "100",
          type: "html",
          html: (row) => {
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            return del;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "del") {
              this.$confirm("该域名将被删除, 确定要继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  linesDelete(row.id).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.getList();
                    return this.$message.success("删除成功");
                  });
                })
                .catch(() => {});
            }
          },
        },
      ],
      tablePage: {
        total: 0,
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
      this.loading = true;
      linesPage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
  },
};
</script>
