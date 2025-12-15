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
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { stylePackageDetail_page, againPackage } from "@/api/admin/index";
import {
  createParams,
  resetSearchData,
  optPackage,
  EnumPackage,
  optionsVersionType,
} from "@/util/util";

export default {
  components: {
    tableSearch,
    search,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      IOSvisible: false,
      timer: null,
      searchForm: [
        {
          type: "select",
          prop: "platform",
          placeholder: "选择平台",
          options: optionsVersionType,
          clearable: true,
        },
      ],
      searchData: {
        platform: "",
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
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "name",
          label: "风格",
        },
        {
          prop: "platform",
          label: "平台",
        },
        {
          prop: "versionOfficial",
          label: "安装包版本",
        },
        {
          label: "打包状态",
          type: "filter",
          filter: (row) => {
            return optPackage.find((v) => v.id === row.status)?.name;
          },
        },
        {
          prop: "packageCreateTime",
          label: "生成时间",
        },
        {
          label: "操作",
          type: "html",
          width: "100",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">重新打包</span>`;
            if (row.status === EnumPackage.FAILED) {
              return `${edit}`;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "edit") {
              againPackage(row.id)
                .then(() => {
                  this.$message.success("处理中...");
                  this.getList();
                })
                .catch(() => {
                  this.loading = false;
                });
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
    ...mapGetters({
      dictionary: "dictionary",
      permissions: "permissions",
    }),
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const data = createParams({
        ...this.searchData,
      });
      const params = {
        ...data,
        id: this.row.id,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      stylePackageDetail_page(params)
        .then((res) => {
          this.loading = false;
          res.data.data.records.forEach((v) => (v.visible = false));
          const isHANDING = res.data.data.records.some(
            (v) => v.status === EnumPackage.FAILED
          );
          if (this.timer) {
            clearInterval(this.timer);
          }
          if (isHANDING) {
            this.timer = setInterval(() => {
              this.getList();
            }, 3000);
          }
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
