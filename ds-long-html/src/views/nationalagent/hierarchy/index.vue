<template>
  <basic-container style="position: relative">
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
      <div style="position: absolute; right: 30px; top: 30px">
        <el-button type="primary" @click="logVisible = true"
          >操作日志</el-button
        >
      </div>
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      v-if="!loading"
      :tablePage="tablePage"
      :lazy="true"
      rowKey="selfId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :tableEvents="tableEvents"
    >
    </tableSearch>

    <el-dialog
      title="修改绑定关系"
      width="30%"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <edit v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog
      title="操作日志"
      width="80%"
      :visible.sync="logVisible"
      :close-on-click-modal="false"
    >
      <logPage v-if="logVisible" />
    </el-dialog>
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { pageForTop, listForNextFloor, pageList } from "@/api/admin/index";
import edit from "./components/edit.vue";
import logPage from "./components/logPage.vue";
import { resetSearchData, filterNullSearchData } from "@/util/util";

const sortType = {
  INCOME_ASC: "INCOME_ASC", // 总收益升序
  INCOME_DESC: "INCOME_DESC", // 总收益降序
  INCOME_TODAY_ASC: "INCOME_TODAY_ASC", // 今日收益升序
  INCOME_TODAY_DESC: "INCOME_TODAY_DESC", // 今日收益降序
  INCOME_YESTERDAY_ASC: "INCOME_YESTERDAY_ASC", // 昨日收益升序
  INCOME_YESTERDAY_DESC: "INCOME_YESTERDAY_DESC", // 昨日收益降序
  DIRECT_COUNT_ASC: "DIRECT_COUNT_ASC", // 直推人数升序
  DIRECT_COUNT_DESC: "DIRECT_COUNT_DESC", // 直推人数降序
  DIRECT_CHARGE_COUNT_ASC: "DIRECT_CHARGE_COUNT_ASC", // 直推付费人数升序
  DIRECT_CHARGE_COUNT_DESC: "DIRECT_CHARGE_COUNT_DESC", // 直推付费人数降序
};
export default {
  components: {
    tableSearch,
    search,
    edit,
    logPage,
  },
  data() {
    return {
      visible: false,
      logVisible: false,
      row: {},
      loading: false,
      tableEvents: {
        load: (tree, treeNode, resolve) => {
          const params = {
            ...filterNullSearchData({ orderType: this.searchData.orderType }),
            parentId: tree.userId,
            size: 999,
            current: 1,
          };
          listForNextFloor(params).then((res) => {
            const data = res.data?.data?.map((v) => {
              v.hasChildren = true;
              v.selfId = `${new Date().getTime()}-${v.userId}`;
              return v;
            });
            resolve(data || []);
          });
        },
        sortChange: (val) => {
          if (val.order === "ascending") {
            if (val.prop === "income") {
              this.searchData.orderType = sortType.INCOME_ASC;
            } else if (val.prop === "incomeToday") {
              this.searchData.orderType = sortType.INCOME_TODAY_ASC;
            } else if (val.prop === "incomeYesterday") {
              this.searchData.orderType = sortType.INCOME_YESTERDAY_ASC;
            } else if (val.prop === "directCount") {
              this.searchData.orderType = sortType.DIRECT_COUNT_ASC;
            } else if (val.prop === "directChargeCount") {
              this.searchData.orderType = sortType.DIRECT_CHARGE_COUNT_ASC;
            }
          } else {
            if (val.prop === "income") {
              this.searchData.orderType = sortType.INCOME_DESC;
            } else if (val.prop === "incomeToday") {
              this.searchData.orderType = sortType.INCOME_TODAY_DESC;
            } else if (val.prop === "incomeYesterday") {
              this.searchData.orderType = sortType.INCOME_YESTERDAY_DESC;
            } else if (val.prop === "directCount") {
              this.searchData.orderType = sortType.DIRECT_COUNT_DESC;
            } else if (val.prop === "directChargeCount") {
              this.searchData.orderType = sortType.DIRECT_CHARGE_COUNT_DESC;
            }
          }
          this.getList();
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "nickname",
          placeholder: "用户昵称",
          clearable: true,
        },
        {
          type: "input",
          prop: "userId",
          placeholder: "用户ID",
          clearable: true,
        },
        {
          type: "select",
          prop: "schemeId",
          placeholder: "代理等级",
          options: [],
          clearable: true,
          labelValue: {
            label: "agentName",
            value: "id",
          },
        },
      ],
      searchData: {
        nickname: "",
        orderType: "",
        schemeId: "",
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
          prop: "nickname",
          label: "用户昵称",
          align: "left",
        },
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "agentName",
          label: "当前等级",
        },
        {
          prop: "parentNickname",
          label: "直接上级",
        },
        {
          label: "总收益",
          prop: "income",
          sortable: true,
        },
        {
          label: "今日收益",
          prop: "incomeToday",
          sortable: true,
        },
        {
          label: "昨日收益",
          prop: "incomeYesterday",
          sortable: true,
        },
        {
          label: "直推人数",
          prop: "directCount",
          sortable: true,
        },
        {
          label: "直推付费人数",
          prop: "directChargeCount",
          sortable: true,
        },
        {
          label: "operate",
          type: "html",
          width: "120",
          html: () => {
            const details = `<span class='link comBtn' data-tagName="details">详情</span>`;
            const edit = `<span class='link comBtn' data-tagName="edit">修改</span>`;
            return details + edit;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "details") {
              this.$router.push({
                path: "/user/details/index",
                query: { id: row.userId },
              });
            } else if (tagname === "edit") {
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
    const params = {
      current: 1,
      size: 999,
    };
    pageList(params).then((res) => {
      this.tableData = res.data?.data?.records.map((v) => {});
      this.searchForm.forEach((v) => {
        if (v.prop === "schemeId") {
          v.options = res.data?.data?.records;
        }
      });
    });
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
      pageForTop(params)
        .then((res) => {
          this.loading = false;
          res.data?.data?.records.forEach((v) => {
            v.hasChildren = true;
            v.selfId = `${new Date().getTime()}-${v.userId}`;
          });
          this.tableData = res.data?.data?.records;
          this.tablePage.total = res.data?.data?.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
