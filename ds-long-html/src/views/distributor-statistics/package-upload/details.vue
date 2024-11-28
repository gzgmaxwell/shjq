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
import { downloadExcel, ENUM_DIC_TYPE } from "@/util/util";
import { mapGetters } from "vuex";
import { createParams } from "@/util/util";
import {
  extensionInstallExport,
  extensionInstallList,
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
              id: "1",
            },
            {
              name: "Android",
              id: "2",
            },
          ],
          placeholder: "system",
          clearable: true,
        },
        {
          type: "input",
          prop: "agentName",
          placeholder: "agent_name",
          clearable: true,
        },
        {
          type: "input",
          prop: "agentMobile",
          placeholder: "proxy_account",
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
        agentMobile: "",
        agentName: "",
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
              packageId: this.packageId,
              currentUserType: "2",
            };
            extensionInstallExport(params).then((res) => {
              if (res.status == 200) {
                downloadExcel(
                  res.data,
                  `${this.$t("agent_statistics_details")}`
                );
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
          label: "proxy_account",
        },
        {
          prop: "name",
          label: "agent_name",
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
            return `<span>${row.status == "NORMAL" ? "正常" : "禁用"}</span>`;
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
        selectionChange: (val) => {
          console.log(val);
          this.selectionData = val;
        },
      },
    };
  },
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
  },
  mounted() {
    console.log(this.$route.query.packageId);
    this.packageId = this.$route.query.packageId;
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
        packageId: this.packageId,
        currentUserType: 2,
      };
      this.loading = true;
      extensionInstallList(params).then((res) => {
        const { data } = res;
        this.loading = false;
        data.data.records.forEach((v) => (v.visible = false));
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
