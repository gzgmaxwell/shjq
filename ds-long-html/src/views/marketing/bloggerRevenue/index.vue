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
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="cmpTitle"
      :visible.sync="visible"
      width="30%"
      v-if="visible"
      center
      :close-on-click-modal="false"
    >
      <chargingRevenue :row="row"></chargingRevenue>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  resetSearchData,
  filterNullSearchData,
  bloggerAuditOption,
  ENUM_bloggerAuditOpra,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { commissionPage } from "@/api/admin/index";
import chargingRevenue from "@/views/marketing/bloggerRevenue/components/chargingRevenue.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
    chargingRevenue,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "applyUserName",
          placeholder: "申请人",
          clearable: true,
        },
        {
          type: "input",
          prop: "userName",
          placeholder: "姓名",
          clearable: true,
        },
        {
          type: "input",
          prop: "userId",
          placeholder: "用户ID",
          clearable: true,
        },
      ],
      searchData: {
        applyUserName: "",
        userName: "",
        userId: "",
      },
      searchHandle: [
        {
          label: "search",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "reset",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "applyUserName",
          label: "申请人",
        },
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "userName",
          label: "姓名",
        },
        {
          label: "当前分成占比",
          type: "html",
          html: (row) => {
            return `<span>${row.currentRatio || 0}</span>%`;
          },
        },
        {
          label: "申请分成占比",
          type: "html",
          html: (row) => {
            return `<span>${row.expectRatio || 0}</span>%`;
          },
        },
        {
          prop: "status",
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item =
              bloggerAuditOption.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "submitTime",
          label: "提交时间",
        },
        {
          label: "operate",
          type: "html",
          width: "120",
          html: (row) => {
            const approval = `<span class='link comBtn' data-tagName="approval">审批</span>`;
            const details = `<span class='link comBtn' data-tagName="details">详情</span>`;
            if (
              row.status === ENUM_bloggerAuditOpra.UNAUDITED &&
              this.permissions.sys_blogger_revenue_audit
            ) {
              return approval;
            } else if (this.permissions.sys_blogger_revenue_detail) {
              return details;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "approval") {
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
            } else if (tagname === "details") {
              this.visible = true;
              this.row = {
                isShow: true,
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
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
  computed: {
    ...mapGetters(["permissions"]),
    cmpTitle() {
      return this.row.isShow ? "详情" : "审批";
    },
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
      commissionPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss"></style>
