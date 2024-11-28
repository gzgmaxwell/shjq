<template>
  <div>
    <el-card class="card">
      <search
        :that="that"
        :searchData="searchData"
        :searchForm="searchForm"
        :searchHandle="searchHandle"
      >
      </search>
      <span style="display: inline-block; margin-bottom: 10px"
        >共计获得收益:{{ yieldTotal }}</span
      >
      <tableSearch
        :loading="loading"
        :that="that"
        :tableData="tableData"
        :searchData="searchData"
        :tableLabel="tableLabel"
        :tablePage="tablePage"
        :tableEvents="tableEvents"
        :isIndex="true"
      >
      </tableSearch>
    </el-card>
  </div>
</template>
<script>
import { createParams, downloadExcel } from "@/util/util";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  yieldUserList,
  yieldYieldTotal,
  yieldUserListExport,
  updateStatus,
} from "@/api/admin/index";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      yieldTotal: 0,
      loading: false,
      that: this,
      title: "",
      visible: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "mobile",
          placeholder: "查询账号",
          clearable: true,
        },
        {
          type: "input",
          prop: "name",
          placeholder: "查询昵称",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        name: "",
        mobile: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "导出",
          type: "success",
          callback: () => {
            const data = createParams(this.searchData);
            const params = {
              ...data,
              current: this.tablePage.current,
              size: this.tablePage.size,
              agentProjectId: this.agentId,
            };
            yieldUserListExport(params).then((res) => {
              console.log(res);
              if (res.status == 200) {
                downloadExcel(res.data, "用户列表");
              }
            });
          },
        },
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {},
      },
      tableLabel: [
        {
          prop: "name",
          label: "用户昵称",

          type: "html",
          html: (row) => {
            return `<span class='userName'>${row.name}</span>`;
          },
          callback: (row) => {
            this.$router.push({
              path: "/distributor-manage/distributorlist/distributorUserList/distributorUserInfo/index",
              query: row,
            });
          },
        },
        {
          prop: "mobile",
          label: "手机号",
        },
        {
          prop: "createTime",
          label: "注册时间",
        },
        {
          prop: "money",
          label: "获得奖励",
        },
        {
          label: "操作",

          type: "html",
          width: "100",
          html: (row) => {
            if (row.status == "DISABLED") {
              return "";
            } else {
              return `<span class='link comBtn' data-tagName="unbind">解绑</span>`;
            }
          },
          callback: (row, index, e) => {
            this.$confirm(
              "此操作将 解绑 之后不再计算佣金收益, 是否继续?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                const params = {
                  userId: row.userId,
                  status: "DELETED",
                };
                updateStatus(params).then((res) => {
                  if (res.status == 200) {
                    this.getList();
                    return this.$message.success("解绑成功");
                  }
                });
              })
              .catch(() => {});
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
    this.agentId = this.$route.query.row.id;
    this.getList();
    this.getYieldYieldTotal();
  },

  methods: {
    getYieldYieldTotal() {
      yieldYieldTotal({ agentProjectId: this.agentId }).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.yieldTotal = data.data;
        }
      });
    },
    getList() {
      let startTime = "";
      let endTime = "";
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        startTime = this.searchData.dateTime[0];
        endTime = this.searchData.dateTime[1];
      }
      const params = {
        ...this.searchData,
        startTime,
        endTime,
        current: this.tablePage.current,
        size: this.tablePage.size,
        agentProjectId: this.agentId,
      };
      this.loading = true;
      yieldUserList(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records;
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
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
<style lang="scss" scoped>
.el-card.is-always-shadow {
  margin: 10px;
}
::v-deep .userName {
  color: #169bd5;
  cursor: pointer;
}
</style>
