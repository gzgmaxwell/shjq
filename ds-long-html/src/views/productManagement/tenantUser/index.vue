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
      :isIndex="true"
      :tableEvents="tableEvents"
    >
    </tableSearch>
    <el-dialog
      :title="row.adminUserId ? '编辑租户' : '新增租户'"
      :visible.sync="visible"
      width="35%"
      :close-on-click-modal="false"
    >
      <create :row="row" v-if="visible" />
    </el-dialog>
    <el-dialog
      :title="$t('reset')"
      :visible.sync="resetVisible"
      width="35%"
      :close-on-click-modal="false"
    >
      <reset :row="row" v-if="resetVisible" />
    </el-dialog>
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import create from "./create.vue";
import reset from "@/views/common/reset/reset.vue";
import { tenantDelete, tenantQueryPage } from "@/api/admin/user";
import { listUserIdByUsername } from "@/api/userList";
import { queryPage } from "@/api/content/index";
import {
  resetSearchData,
  filterNullSearchData,
  optionsAuthenticator,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";

export default {
  components: {
    tableSearch,
    search,
    create,
    reset,
  },
  data() {
    return {
      visible: false,
      resetVisible: false,
      row: {},
      loading: false,
      selectData: [],
      searchForm: [
        {
          label: "产品名称:",
          type: "input",
          prop: "name",
          placeholder: "请输入产品名称",
          clearable: true,
          labelWidth: "50",
        },
        {
          label: "用户名:",
          type: "autocomplete",
          prop: "username",
          placeholder: "请输入用户名",
          clearable: true,
          fetchSuggestions: (queryString, cb) => {
            if (queryString === "") {
              return cb([]);
            }
            const params = {
              username: queryString,
            };
            listUserIdByUsername(params).then((res) => {
              const data = res.data.data.map((v) => {
                return {
                  value: v.username,
                };
              });
              cb(data);
            });
          },
          select: (item) => (this.searchData.username = item.value),
        },
        {
          label: "套餐:",
          type: "select",
          prop: "servicePackageId",
          placeholder: "请选择套餐",
          labelValue: {
            label: "name",
            value: "id",
          },
          clearable: true,
          options: [],
        },
      ],
      searchData: {
        name: "",
        username: "",
        servicePackageId: "",
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
          label: "add",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: () => {
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
          label: "产品名称",
          prop: "name",
        },
        {
          label: "用户名",
          prop: "username",
        },
        {
          label: "套餐",
          prop: "servicePackageName",
        },
        {
          label: "appid",
          prop: "busPlatformId",
        },
        {
          label: "认证状态",
          type: "filter",
          filter: (row) => {
            const item = optionsAuthenticator.find(
              (v) => v.id === row.authenticatorStatus
            );
            return item?.name;
          },
        },
        {
          label: "操作",
          type: "html",
          width: "150",
          html: () => {
            const btn = `<span class='link comBtn' data-tagName="edit">${this.$t(
              "edit"
            )}</span>
            <span class='comBtn danger' data-tagName="del">${this.$t(
              "delete"
            )}</span>
            <span class='comBtn link' data-tagName="reset">重置</span>`;
            return btn;
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
            } else if (tagname === "del") {
              this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
                confirmButtonText: this.$t("determine"),
                cancelButtonText: this.$t("cancel"),
                type: "warning",
              })
                .then(() => {
                  tenantDelete(row.id).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.getList();
                    this.$message.success(this.$t("successfully_deleted"));
                  });
                })
                .catch(() => {});
            } else if (tagname === "reset") {
              this.resetVisible = true;
              this.row = {
                userId: row.adminUserId,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.resetVisible = false;
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
      tableEvents: {},
    };
  },

  mounted() {
    this.getList();
    this.getMealData();
  },

  methods: {
    getMealData() {
      const params = {
        current: 1,
        size: 99999,
      };
      queryPage(params).then((res) => {
        this.searchForm.forEach((v) => {
          if (v.prop === "servicePackageId") {
            v.options = res.data.data.records;
          }
        });
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      tenantQueryPage(params)
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
