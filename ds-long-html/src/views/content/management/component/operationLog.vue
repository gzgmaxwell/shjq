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
    >
    </tableSearch>
  </div>
</template>
<script>
import { operateRecord } from "@/api/admin/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table.vue";
import { createParams, optNodes, resetSearchData } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      searchForm: [
        {
          styleWidth: "180",
          type: "select",
          prop: "operateStage",
          options: optNodes,
          placeholder: "请选择修改节点类型",
          clearable: true,
        },
        {
          prop: "dateTime",
          type: "datetimerange",
        },
      ],
      searchData: {
        operateStage: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "变更页",
          type: "filter",
          filter: (row) => {
            const item = optNodes.find((v) => v.id === row.operateStage);
            return item?.name;
          },
        },
        {
          label: "变更前",
          headerAlign: "center",
          align: "left",
          type: "html",
          html: (row) => {
            return row.operateInfo
              .map((v) => {
                let content = "";
                if (v.preValue) {
                  content += `<div>【${v.columnDesc}】: ${v.preValue}`;
                  if (v.preReason) {
                    content += ` : ${v.preReason}</div>`;
                  } else {
                    content += `</div>`;
                  }
                }
                return content;
              })
              .join("");
          },
        },
        {
          label: "变更后",
          headerAlign: "center",
          align: "left",
          type: "html",
          html: (row) => {
            return row.operateInfo
              .map((v) => {
                let content = "";
                if (v.currentValue) {
                  content += `<div>【${v.columnDesc}】: ${v.currentValue}`;
                  if (v.currentReason) {
                    content += ` : ${v.currentReason}</div>`;
                  } else {
                    content += `</div>`;
                  }
                }
                return content;
              })
              .join("");
          },
        },
        {
          prop: "operateUsername",
          label: "变更人",
        },
        {
          prop: "createTime",
          label: "变更时间",
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
        ...createParams({
          ...this.searchData,
        }),
        preId: this.$route.query.preId,
        size: this.tablePage.size,
        current: this.tablePage.current,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      operateRecord(params).then((res) => {
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
      resetSearchData(this.searchData);
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
