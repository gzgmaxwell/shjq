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
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import { downloadExcel, ENUM_DIC_TYPE, createParams } from "@/util/util";
import { mapGetters } from "vuex";
import {
  extensionInstallList,
  extensionInstallExport,
} from "@/api/admin/index";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      optionPackage: [],
      visible: false,
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        {
          type: "select",
          prop: "projectName",
          labelWidth: "50px",
          options: [],
          placeholder: "project_name",
          clearable: true,
          labelValue: {
            label: "dictionaryKey",
            value: "dictionaryKey",
          },
        },
        {
          type: "select",
          prop: "appSystemName",
          labelWidth: "50px",
          options: [
            {
              name: "IOS",
              id: "ios",
            },
            {
              name: "Android",
              id: "android",
            },
          ],
          placeholder: "system",
          clearable: true,
        },
        {
          type: "input",
          prop: "name",
          placeholder: "channel_merchant_name",
          clearable: true,
        },
        {
          type: "input",
          prop: "account",
          placeholder: "channel_merchant_account",
          clearable: true,
        },
        {
          type: "input",
          prop: "appVersion",
          placeholder: "version",
          clearable: true,
        },
      ],
      searchData: {
        projectName: "",
        appSystemName: "",
        account: "",
        name: "",
        appVersion: "",
      },
      searchHandle: [
        { label: "search", type: "primary", callback: this.search },
        { label: "reset", callback: this.reset },
        {
          label: "export",
          type: "success",
          callback: () => {
            const data = createParams(this.searchData);
            const params = {
              ...data,
              current: this.tablePage.current,
              size: this.tablePage.size,
              currentUserType: "1",
            };
            extensionInstallExport(params).then((res) => {
              if (res.status == 200) {
                downloadExcel(res.data, `${this.$t("wrap_count")}`);
              }
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "projectName",
          label: "project_name",
        },
        {
          prop: "appSystemName",
          label: "system",
        },
        {
          prop: "appVersion",
          label: "version",
        },
        {
          prop: "mobile",
          label: "channel_merchant_account",
        },
        {
          prop: "name",
          label: "channel_merchant_name",
        },
        {
          prop: "createTime",
          label: "acquisition_time",
        },
        {
          prop: "installNum",
          label: "invite_number",
        },
        {
          prop: "status",
          label: "status",
          type: "html",
          html: (row) => {
            const status =
              row.status == "NORMAL"
                ? "正常"
                : row.status == "DISABLE"
                ? "禁用"
                : "";
            return `<span>${status}</span>`;
          },
        },
        {
          label: "operate",
          type: "html",
          width: "150",
          html: (row) => {
            return `<span class='link comBtn' data-tagName="search">${this.$t(
              "check"
            )}</span>`;
          },
          callback: (row, index, e) => {
            this.$router.push({
              path: "/distributor-statistics/package-upload/details",
              query: row,
            });
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
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
  },
  mounted() {
    this.optionPackage = this.dictionary[ENUM_DIC_TYPE.package];
    this.getList();
    this.packageList();
  },

  methods: {
    packageList() {
      this.searchForm.forEach((v) => {
        if (v.type === "select" && v.prop == "projectName") {
          v.options = this.optionPackage;
        }
      });
    },
    getList() {
      const data = createParams(this.searchData);
      const params = {
        ...data,
        current: this.tablePage.current,
        size: this.tablePage.size,
        currentUserType: "1",
      };
      this.loading = true;
      extensionInstallList(params).then((res) => {
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
      this.searchData = {};
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
