<template>
  <div class="mt10">
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="false"
    >
    </tableSearch>
    <el-dialog
      title="编辑"
      :visible.sync="visible"
      width="37%"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <configEdit :row="row"></configEdit>
    </el-dialog>
  </div>
</template>

<script>
import { EnumChannelStatus, EnumProps, optProps } from "@/util/util";
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { clearingAppSchemeDetailList } from "@/api/admin/index";
import configEdit from "./configEdit.vue";
export default {
  components: {
    tableSearch,
    search,
    configEdit,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      tableData: [],
      tableLabel: [
        {
          prop: "subsidyMoney",
          label: "详情",
          type: "html",
          align: "left",
          html: (row) => {
            const propsText = "获得道具:";
            // const propsHtml = row.schemeDetailList
            //   .map((item) => {
            //     const num = optProps.find((v) => v.id === item.type) || {};
            //     if (item.type === EnumProps.SVIP) {
            //       return `${item.userNum}人${item.num}${num.unit}${num.name}`;
            //     } else {
            //       return `${item.userNum}人${item.num}${num.unit}${num.name}`;
            //     }
            //   })
            //   .join(",");

            // let result = "";
            // if (row.toolStatus !== EnumChannelStatus.disabled) {
            //   result = `<div>${propsText} ${propsHtml}</div>`;
            // }

            // return result;
            const propsHtml = row.list
              .map((item) => {
                const num = optProps.find((v) => v.id === item.type) || {};
                // if (item.type === EnumProps.SVIP) {
                //   return `${item.userNum}人${item.num}${num.unit}${num.name}`;
                // } else {
                //   }
                return `${item.userNum}人${item.num}${num.unit}${num.name}`;
              })
              .join(",");
            let result = `<div>${propsText} ${propsHtml}</div>`;
            return result;
          },
        },
        {
          label: "operate",
          type: "html",
          width: "140",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">配置</span>`;
            return edit;
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
      this.loading = true;
      clearingAppSchemeDetailList(0)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data;
          this.tableData = [{ list: data.data }];
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
