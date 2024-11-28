<template>
  <div class="mt10">
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
      :tableEvents="tableEvents"
      :isSelection="false"
    >
      <template #slotBtn="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
      </template>
    </tableSearch>
    <el-dialog
      title="交流群域名配置"
      :visible.sync="visible"
      width="40%"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <create :row="row"></create>
    </el-dialog>
  </div>
</template>
<script>
import create from "./component/createInvite.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue"; //
import { configPage, configRm } from "@/api/nationalagent/index";

export default {
  components: {
    tableSearch,
    search,
    create,
  },
  data() {
    return {
      loading: false,
      row: {},
      visible: false,
      tableEvents: {},
      searchForm: [],
      searchData: {},
      searchHandle: [
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              type: "COMMUNICATE_GROUP_PAGE",
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "域名地址",
          prop: "url",
        },
        {
          label: "操作",
          type: "slot",
          slotName: "slotBtn",
          width: "260",
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
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
        type: "COMMUNICATE_GROUP_PAGE",
      };
      this.loading = true;
      configPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [];
      btnList.push({
        name: "编辑",
        class: "comBtn link",
        callback: () => {
          this.row = {
            ...row,
            callback: (data) => {
              if (data) {
                this.getList();
              }
              this.visible = false;
            },
          };
          this.visible = true;
        },
      });
      btnList.push({
        name: "删除",
        class: "comBtn danger",
        callback: () => {
          this.$confirm("此操作将被删除, 是否继续?", this.$t("prompt"), {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            configRm(row.id).then(() => {
              this.$message.success("删除成功");
              this.getList();
            });
          });
        },
      });
      return btnList;
    },
  },
};
</script>
