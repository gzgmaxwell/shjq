<template>
  <div>
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
      :isIndex="false"
      :lazy="true"
      :tableEvents="tableEvents"
    >
    </tableSearch>
  </div>
</template>

<script>
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { distributorOperate, statisticsPageListAll } from "@/api/admin/index";
import {
  EnumChannelStatus,
  resetSearchData,
  filterNullSearchData,
  optWebmasterType,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: {},
    },
  },
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      tableEvents: {},
      searchForm: [
        {
          type: "input",
          prop: "distrMobile",
          placeholder: "渠道商账号",
          clearable: true,
        },
        {
          type: "input",
          prop: "distrName",
          placeholder: "渠道商名称",
          clearable: true,
        },
      ],
      searchData: {
        distrMobile: "",
        distrName: "",
      },
      searchHandle: [
        {
          label: "搜索",
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
          prop: "distrMobile",
          label: "渠道商账号",
          type: "html",
          width: 150,
          html: (row) => {
            return `<span>${row.distrMobile}</span>`;
          },
        },
        {
          prop: "distrName",
          label: "渠道商名称",
        },
        {
          label: "渠道商身份",
          type: "filter",
          filter: (row) => {
            const item = optWebmasterType.find(
              (item) => item.id === row.channelType
            );
            return item?.name;
          },
        },
        {
          label: "operate",
          type: "html",
          width: "100",
          html: (row) => {
            let enable = `<span class='link comBtn' data-tagName="enable">启用</span>`;
            return enable;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "enable") {
              distributorOperate(row.distrId).then(() => {
                const newCurrent = pageHandle(
                  this.tablePage.current,
                  this.tablePage.size,
                  this.tablePage.total
                );
                this.tablePage.current = newCurrent;
                this.$message.success("启用成功");
                this.getList();
                this.row.callback(true);
              });
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
        status: EnumChannelStatus.disabled,
      };
      this.loading = true;
      statisticsPageListAll(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
