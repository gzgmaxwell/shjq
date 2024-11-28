<template>
  <div>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      style="position: relative"
    >
      <div style="position: absolute; right: 0; top: 0">
        <el-button :type="dataKey == 0 ? 'danger' : 'primary'" @click="control">
          {{ dataKey == 1 ? "开启" : "关闭" }}自动通过</el-button
        >
      </div>
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
      :isIndex="false"
    >
    </tableSearch>
    <el-dialog
      title="新建"
      :visible.sync="createVisible"
      width="30%"
      v-if="createVisible"
      center
      :close-on-click-modal="false"
    >
      <create :row="row"></create>
    </el-dialog>
    <el-dialog
      title="审批"
      :visible.sync="visible"
      width="30%"
      v-if="visible"
      center
      :close-on-click-modal="false"
    >
      <approval :row="row"></approval>
    </el-dialog>
  </div>
</template>

<script>
import {
  resetSearchData,
  filterNullSearchData,
  ENUM_bloggerAuditOpra,
  bloggerAuditOption,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { infoPageList, updateDictByKey } from "@/api/admin/index";
import { fetchList } from "@/api/admin/dict";
import create from "./create.vue";
import approval from "./approval.vue";
export default {
  components: {
    tableSearch,
    search,
    approval,
    create,
  },
  data() {
    return {
      visible: false,
      createVisible: false,
      dataKey: "",
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "userName",
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
          prop: "status",
          placeholder: "状态",
          clearable: true,
          options: bloggerAuditOption,
        },
      ],
      searchData: {
        userName: "",
        status: "",
        userId: "",
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
        {
          label: "新建",
          type: "primary",
          callback: () => {
            this.createVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.createVisible = false;
              },
            };
          },
          // auth: () => this.permissions.classify_add,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "userName",
          label: "用户昵称",
        },
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "status",
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item =
              bloggerAuditOption.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "createTime",
          label: "提交时间",
        },
        {
          label: "operate",
          type: "html",
          width: "120",
          html: (row) => {
            const approval = `<span class='link comBtn' data-tagName="approval">审批</span>`;
            if (row.status === ENUM_bloggerAuditOpra.UNAUDITED) {
              return approval;
            } else {
              return "";
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "approval") {
              this.visible = true;
              this.row = {
                id: row.id,
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
      tableEvents: {
        selectionChange: (val) => {},
      },
    };
  },
  mounted() {
    this.getKey();
    this.getList();
  },

  methods: {
    getKey() {
      const params = {
        dictionaryKey: "EXT_AGENT_SCHEME",
      };
      fetchList(params).then((res) => {
        if (res.data.data?.records && res.data.data?.records.length) {
          this.dataKey = res.data.data.records[0].dictionaryValue;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      infoPageList(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    control() {
      const params = {
        dictionaryKey: "EXT_AGENT_SCHEME",
        dictionaryValue: this.dataKey == 0 ? "1" : "0",
      };
      updateDictByKey(params).then(() => {
        this.getKey();
        this.$message.success(this.dataKey == 1 ? "开启成功" : "关闭成功");
      });
    },
  },
};
</script>
<style lang="scss"></style>
