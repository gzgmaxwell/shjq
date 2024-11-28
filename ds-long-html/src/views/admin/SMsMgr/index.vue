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
      :isIndex="false"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="30%"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  platformQueryPage,
  platformOperate,
  platformDelete,
} from "@/api/admin/index";
import { pageHandle } from "@/util/pageHandle";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import create from "@/views/admin/SMsMgr/create.vue";
import addSource from "@/views/content/triateralplatform/addSource.vue";
import {
  optionsSmsStatus,
  EnumSmsStatus,
  optionsPlatformType,
} from "@/util/util";

export default {
  components: {
    tableSearch,
    search,
    create,
    addSource,
  },
  data() {
    return {
      loading: false,
      visible: false,
      soruceVisible: false,
      smsVisible: false,
      optionUserId: [],
      row: {},
      searchForm: [],
      searchData: {},
      searchHandle: [
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
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
          label: "短信平台",
          prop: "platformName",
        },
        {
          label: "AccesskeyID",
          prop: "accessKey",
        },
        {
          label: "平台类型",
          prop: "type",
          type: "filter",
          filter: (row) => {
            const item =
              optionsPlatformType.find((v) => v.id === row.type) || {};
            return item.name;
          },
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item =
              optionsSmsStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const template = `<span class='link comBtn' data-tagName="smsTemplate">模版</span>`;
            const enable = `<span class='link comBtn' data-tagName="enable">启用</span>`;
            const disabled = `<span class='danger comBtn' data-tagName="disabled">禁用</span>`;
            const del = `<span class='danger comBtn ${
              row.status === EnumSmsStatus.platformOpen ? "btnDisable" : ""
            }' data-tagName="del">删除</span>`;
            if (row.status === EnumSmsStatus.platformClose) {
              return `${edit} ${template} ${enable} ${del}`;
            } else {
              return `${edit} ${template} ${disabled} ${del}`;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            const operations = {
              enable: {
                confirmMessage: `确定要启用平台吗？`,
                successMessage: `启用成功！`,
              },
              disabled: {
                confirmMessage: `确定要禁用平台吗？`,
                successMessage: `禁用成功！`,
              },
            };
            const operation = operations[tagname];
            if (operation) {
              const { confirmMessage, successMessage } = operation;
              this.$confirm(confirmMessage, `${this.$t("prompt")}`, {
                confirmButtonText: `${this.$t("determine")}`,
                cancelButtonText: `${this.$t("cancel")}`,
                type: "warning",
              })
                .then(() => {
                  platformOperate(row.id).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      this.$message.success(successMessage);
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
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
            } else if (tagname === "del") {
              this.$confirm("确定要删除此条数据?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  platformDelete(row.id).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      return this.$message.success("删除成功");
                    }
                  });
                })
                .catch(() => {});
            } else if (tagname === "smsTemplate") {
              this.$router.push({
                path: "/admin/SMsMgr/smsTemplate",
                query: {
                  ...row,
                },
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

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      platformQueryPage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },

    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.dateTime = [];
      this.searchData.channelName = "";
      this.searchData.status = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
