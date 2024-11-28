<template>
  <div class="mt10">
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
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? $t('edit') : $t('add')"
      :visible.sync="visible"
      width="30%"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <cpaEdit :row="row"></cpaEdit>
    </el-dialog>
  </div>
</template>

<script>
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { clearingSchemeList } from "@/api/admin/index";
import cpaEdit from "@/views/distributor-manage/distributor-scheme/cpaEdit.vue";
export default {
  components: {
    tableSearch,
    search,
    cpaEdit,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [],
      searchData: {},
      searchHandle: [
        {
          label: "add",
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
          prop: "schemeName",
          label: "cpa_programme",
        },
        {
          prop: "subsidyMoney",
          label: "rule",
        },
        {
          prop: "createUserName",
          label: "updated_by",
        },
        {
          prop: "createTime",
          label: "create_time",
        },
        {
          label: "operate",
          type: "html",
          width: "120",
          html: (row) => {
            return `<span class='link comBtn' data-tagName="edit">${this.$t(
              "edit"
            )}</span>`;
          },
          callback: (row, index, e) => {
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
      tableEvents: {
        selectionChange: (val) => {},
      },
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        current: this.tablePage.current,
        size: this.tablePage.size,
        platformType: "1",
        // schemeType: "CPA",
      };
      this.loading = true;
      clearingSchemeList(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.schemeName = "";
      this.searchData.createName = "";
      this.getList();
    },
  },
};
</script>
