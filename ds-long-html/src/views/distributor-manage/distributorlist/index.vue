<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      style="position: relative"
    >
      <div style="position: absolute; right: 0; top: 0">
        <el-button type="primary" @click="recycleBin">回收站</el-button>
      </div>
    </search>
    <!-- 下级先隐藏 -->
    <!-- rowKey="id"
      :defaultExpandAll="defaultExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
    <tableSearch
      :loading="loading"
      v-if="!defaultExpandAll && !loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
      :lazy="true"
      :tableEvents="tableEvents"
    >
    </tableSearch>
    <!--     //暂时隐藏
    <tableSearch
      v-if="defaultExpandAll && !loading"
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
      :lazy="true"
      rowKey="id"
      :defaultExpandAll="defaultExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :tableEvents="tableEvents"
    >
    </tableSearch> -->
    <el-dialog
      :title="row.id ? $t('edit') : $t('add')"
      :visible.sync="visible"
      width="40%"
      :close-on-click-modal="false"
    >
      <create :row="row" v-if="visible"></create>
    </el-dialog>
    <el-dialog
      :title="$t('reset')"
      :visible.sync="passwordVisible"
      width="35%"
      :close-on-click-modal="false"
    >
      <reset :row="passwordRow" v-if="passwordVisible" />
    </el-dialog>
    <el-dialog
      title="回收站"
      :visible.sync="recycleBinVisible"
      width="70%"
      :close-on-click-modal="false"
      class="recycleBinTitle"
    >
      <recycleBinPage :row="recycleBinRow" v-if="recycleBinVisible" />
    </el-dialog>
    <!--     //需求删除
    <el-dialog
      :visible.sync="dataStatisticVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <dataStatisticsTable
        :row="row"
        v-if="dataStatisticVisible"
      ></dataStatisticsTable>
    </el-dialog> -->
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import create from "./create.vue";
import reset from "@/views/common/reset/reset.vue";
import dataStatisticsTable from "@/views/common/commDataStatistics/dataStatisticsTable.vue";
import recycleBinPage from "./recycleBinPage.vue";
import {
  distributorQueryPage,
  distributorOperate,
  treeByDistr,
  statisticsPageListAll,
} from "@/api/admin/index";

import {
  EnumChannelStatus,
  optionChannelStatus,
  resetSearchData,
  filterNullSearchData,
  optionsAuthenticator,
  optWebmasterType,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    tableSearch,
    search,
    create,
    dataStatisticsTable,
    reset,
    recycleBinPage,
  },
  data() {
    return {
      visible: false,
      passwordVisible: false,
      recycleBinVisible: false,
      // dataStatisticVisible: false,
      row: {},
      passwordRow: {},
      recycleBinRow: {},
      loading: false,
      defaultExpandAll: false,
      tableEvents: {
        load: (tree, treeNode, resolve) => {
          const params = {
            current: 1,
            size: 999,
            parentId: tree.distrId,
          };
          distributorQueryPage(params).then((res) => {
            const data = res.data.data.records.map((v) => {
              v.hasChildren = true;
              return v;
            });
            resolve(data);
          });
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "distrMobile",
          placeholder: "channel_merchant_account",
          clearable: true,
        },
        {
          type: "input",
          prop: "distrName",
          placeholder: "channel_merchant_name",
          clearable: true,
        },
        /*         // 暂时隐藏
        {
          type: "input",
          prop: "distrMobilePath",
          placeholder: "渠道商链路查询（渠道商账号）",
          styleWidth: "230",
          clearable: true,
        }, */
      ],
      searchData: {
        distrMobile: "",
        distrName: "",
        /*   //暂时隐藏
        distrMobilePath: "", */
      },
      searchHandle: [
        {
          label: "search",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            /*        // 暂时隐藏
            if (this.searchData.distrMobilePath) {
              this.getListPath();
            } else {
              this.getList();
            } */
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
        {
          label: "add",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: (data) => {
                this.getList();
                this.visible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "distrMobile",
          label: "channel_merchant_account",
          type: "html",
          align: "left",
          width: 150,
          html: (row) => {
            return `<span class='link'>${row.distrMobile}</span>`;
          },
          // callback: (row) => {
          //   this.$router.push({
          //     path: "/distributor-manage/distributorlist/distributorInfo/index",
          //     query: { distrId: row.distrId },
          //   });
          // },
          callback: (row) => {
            this.$router.push({
              path: "/distributor-manage/distributorlist/webmasterDetails/index",
              query: { ...row },
            });
          },
        },
        {
          prop: "distrName",
          label: "channel_merchant_name",
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
          prop: "level",
          label: "渠道商等级",
        },
        {
          prop: "newUserCount",
          label: "新增用户数",
        },
        {
          prop: "totalAmount",
          label: "充值总金额",
        },
        {
          prop: "amountForRecharge",
          label: "充值金币金额",
        },
        {
          prop: "amountForSVIP",
          label: "充值vip金额",
        },
        {
          label: "status",
          type: "html",
          html: (row) => {
            const item = optionChannelStatus.find((v) => v.id === row.status);
            return `<span>${item?.name}</span>`;
          },
        },
        {
          label: "认证状态",
          type: "html",
          html: (row) => {
            const item = optionsAuthenticator.find(
              (v) => v.id === row.authenticatorStatus
            );
            return `<span>${item?.name || ""}</span>`;
          },
        },
        {
          prop: "createTime",
          label: "add_time",
          width: "140",
        },
        {
          label: "operate",
          type: "html",
          width: "180",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">${this.$t(
              "edit"
            )}</span>`;
            const changePassword = `<span class='link comBtn' data-tagName="changePassword">重置</span>`;
            /*     // 需求删除
            const dataStatistics = `<span class='link comBtn' data-tagName="dataStatistics">数据统计</span>`; */
            // let enable = `<span class='arrangetwo comBtn' data-tagName="enable">${this.$t(
            //   "enable"
            // )}</span>`;
            let disabled = `<span class='danger comBtn' data-tagName="disabled">${this.$t(
              "disable"
            )}</span>`;
            // if (row.status == EnumChannelStatus.disabled) {
            //   return edit + enable + changePassword;
            // } else {
            //   }
            return edit + disabled + changePassword;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "disabled") {
              this.$confirm(
                "确认禁用当前账号? 禁用之后,该账号所创建的下级账号均无法登录,但可通过回收站重新启用账号!",
                `提示`,
                {
                  confirmButtonText: `确认`,
                  cancelButtonText: `取消`,
                  type: "warning",
                }
              )
                .then(() => {
                  distributorOperate(row.distrId).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.$message.success("禁用成功");
                    /*          //暂时隐藏
                  if (this.searchData.distrMobilePath) {
                    this.getListPath();
                  } else {
                    this.getList();
                  } */
                    this.getList();
                  });
                })
                .catch(() => {});
            } else if (tagname === "edit") {
              this.visible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    row.distrName = data.distrName;
                    /*      // 暂时隐藏
                    if (this.searchData.distrMobilePath) {
                      this.getListPath();
                    } else {
                      this.getList();
                    } */
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "changePassword") {
              this.passwordVisible = true;
              this.passwordRow = {
                ...row,
                userId: row.distrId,
                callback: (data) => {
                  if (data) {
                    /*        // 暂时隐藏
                    if (this.searchData.distrMobilePath) {
                      this.getListPath();
                    } else {
                      this.getList();
                    } */
                    this.getList();
                  }
                  this.passwordVisible = false;
                },
              };
            }
            /*           // 需求删除
            else if (tagname === "dataStatistics") {
              this.dataStatisticVisible = true;
              this.row = {
                ...row,
              };
            } */
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

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.defaultExpandAll = false;
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
        status: EnumChannelStatus.normal,
      };
      this.loading = true;
      statisticsPageListAll(params)
        .then((res) => {
          this.loading = false;
          res.data.data.records.forEach((v) => (v.hasChildren = true));
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /*     //暂时隐藏
    getListPath() {
      this.loading = true;
      this.defaultExpandAll = true;
      this.tableData = [];
      treeByDistr({ distrMobile: this.searchData.distrMobilePath })
        .then((res) => {
          this.loading = false;
          const data = res.data.data || [];
          const fun = (arr) => {
            arr.forEach((v) => {
              if (v.children && v.children.length) {
                v.hasChildren = false;
                fun(v.children);
              } else {
                v.hasChildren = true;
              }
            });
          };
          fun(data);
          this.tableData = data;
          this.tablePage.total = 0;
        })
        .catch(() => {
          this.loading = false;
        });
    }, */
    recycleBin() {
      this.recycleBinVisible = true;
      this.recycleBinRow = {
        callback: (data) => {
          if (data) {
            this.getList();
          }
          this.recycleBinVisible = false;
        },
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .recycleBinTitle .el-dialog__header {
  text-align: center;
}
</style>
