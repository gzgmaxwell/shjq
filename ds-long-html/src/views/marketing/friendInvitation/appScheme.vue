<template>
  <basic-container class="mt10">
    <!-- <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search> -->
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
      :title="row.id ? $t('edit') : $t('add')"
      :visible.sync="visible"
      width="37%"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <appSchemeEdit :row="row"></appSchemeEdit>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  EnumChannelStatus,
  filterNullSearchData,
  EnumProps,
  optProps,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import {
  clearingAppSchemeList,
  updateSchemeStatus,
  deleteScheme,
} from "@/api/admin/index";
import appSchemeEdit from "@/views/distributor-manage/distributor-scheme/appSchemeEdit.vue";
export default {
  components: {
    tableSearch,
    search,
    appSchemeEdit,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      // 1.30号需求改动
      // searchForm: [
      //   {
      //     type: "input",
      //     prop: "schemeName",
      //     placeholder: "方案名称",
      //     clearable: true,
      //   },
      //   {
      //     type: "input",
      //     prop: "createName",
      //     placeholder: "创建人",
      //     clearable: true,
      //   },
      // ],
      // searchData: {
      //   schemeName: "",
      //   createName: "",
      // },
      // searchHandle: [
      //   {
      //     label: "查询",
      //     type: "primary",
      //     callback: this.search,
      //   },
      //   {
      //     label: "重置",
      //     callback: this.reset,
      //   },
      //   {
      //     label: "add",
      //     type: "primary",
      //     callback: () => {
      //       this.visible = true;
      //       this.row = {
      //         callback: (data) => {
      //           if (data) {
      //             this.getList();
      //           }
      //           this.visible = false;
      //         },
      //       };
      //     },
      //   },
      // ],
      tableData: [],
      tableLabel: [
        // {
        //   prop: "appSchemeName",
        //   label: "C端方案",
        // },
        {
          prop: "subsidyMoney",
          label: "详情",
          type: "html",
          align: "left",
          html: (row) => {
            /*      3.8号需求删除
            const commissionText = "消费:";
            const commissionHtml = row.commissionRatioList
              .map((item) => {
                return `${item.level}级用户${item.ratio}%`;
              })
              .join(","); */
            const propsText = "获得道具:";
            const propsHtml =
              row?.schemeDetailList
                ?.map((item) => {
                  const num = optProps.find((v) => v.id === item.type) || {};
                  if (item.type === EnumProps.SVIP) {
                    return `${item.userNum}人${item.num}${num.unit}${num.name}`;
                  } else {
                    return `${item.userNum}人${item.num}${num.unit}${num.name}`;
                  }
                })
                .join(",") || "";

            let result = "";
            /*     3.8号需求删除
                 if (
              row.commissionStatus !== EnumChannelStatus.disabled &&
              row.toolStatus !== EnumChannelStatus.disabled
            ) {
              result = `<div>${commissionText} ${commissionHtml}</div> <div>${propsText} ${propsHtml}</div>`;
            } else if (row.commissionStatus !== EnumChannelStatus.disabled) {
              result = `<div>${commissionText} ${commissionHtml}</div>`;
            } else  */
            if (row.toolStatus !== EnumChannelStatus.disabled) {
              result = `<div>${propsText} ${propsHtml}</div>`;
            }

            return result;
          },
        },
        // {
        //   prop: "createName",
        //   label: "创建人",
        // },
        // {
        //   prop: "createTime",
        //   label: "create_time",
        // },
        {
          label: "operate",
          type: "html",
          width: "140",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">配置</span>`;
            // const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            // let enable = `<span class='link comBtn' data-tagName="enable">${this.$t(
            //   "enable"
            // )}</span>`;
            // let disabled = `<span class='danger comBtn' data-tagName="disabled">${this.$t(
            //   "disable"
            // )}</span>`;
            // if (row.schemeStatus == EnumChannelStatus.disabled) {
            //   return edit + del + enable;
            // } else {
            //   return edit + del + disabled;
            // }
            return edit;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            // const operations = {
            //   enable: {
            //     confirmMessage: `${this.$t("confirm_enable")}`,
            //     successMessage: `${this.$t("success_enabled")}`,
            //   },
            //   disabled: {
            //     confirmMessage: `${this.$t("confirm_disable")}`,
            //     successMessage: `${this.$t("success_disable")}`,
            //   },
            // };

            // const operation = operations[tagname];
            // if (operation) {
            //   const { confirmMessage, successMessage } = operation;

            //   this.$confirm(confirmMessage, `${this.$t("prompt")}`, {
            //     confirmButtonText: `${this.$t("determine")}`,
            //     cancelButtonText: `${this.$t("cancel")}`,
            //     type: "warning",
            //   })
            //     .then(() => {
            //       const params = {
            //         id: row.id,
            //         schemeStatus: tagname === "enable" ? "NORMAL" : "DISABLED",
            //         updateId: this.$store.getters.userInfo.id,
            //       };
            //       updateSchemeStatus(params).then((res) => {
            //         const { data } = res;
            //         if (data.code == 200) {
            //           this.$message.success(successMessage);
            //           this.getList();
            //         }
            //       });
            //     })
            //     .catch(() => {});
            // } else
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
            // else if (tagname === "del") {
            //   this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
            //     confirmButtonText: this.$t("determine"),
            //     cancelButtonText: this.$t("cancel"),
            //     type: "warning",
            //   }).then(() => {
            //     deleteScheme({ id: row.id }).then((res) => {
            //       const { data } = res;
            //       if (data.code == 200) {
            //         const newCurrent = pageHandle(
            //           this.tablePage.current,
            //           this.tablePage.size,
            //           this.tablePage.total
            //         );
            //         this.tablePage.current = newCurrent;
            //         this.$message.success(`${this.$t("successfully_deleted")}`);
            //         this.getList();
            //       }
            //     });
            //   });
            // }
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
      const params = {
        // ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      clearingAppSchemeList(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          // this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // search() {
    //   this.tablePage.current = 1;
    //   this.getList();
    // },
    // reset() {
    //   this.searchData.schemeName = "";
    //   this.searchData.createName = "";
    //   this.getList();
    // },
  },
};
</script>
