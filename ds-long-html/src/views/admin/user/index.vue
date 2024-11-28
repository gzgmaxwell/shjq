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
      :isSelection="true"
      :isIndex="true"
      :tableEvents="tableEvents"
    >
      <el-button type="primary" class="mb10" @click="removeUserList">
        {{ $t("batch_delete") }}
      </el-button>
    </tableSearch>
    <el-dialog
      :title="row.userId ? $t('edit') : $t('add')"
      :visible.sync="visible"
      width="50%"
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
import create from "./doc/create.vue";
import reset from "@/views/common/reset/reset.vue";
import { delObj, fetchList, removeUser } from "@/api/admin/user";
import { deptRoleList } from "@/api/admin/role";
import { listUserIdByUsername } from "@/api/userList";
import {
  optionsAuthenticator,
  resetSearchData,
  filterNullSearchData,
} from "@/util/util";
import { mapGetters } from "vuex";

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
          type: "autocomplete",
          prop: "username",
          placeholder: "user_name",
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
          type: "autocomplete",
          prop: "realName",
          placeholder: "real_name",
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
                  value: v.realName,
                };
              });
              cb(data);
            });
          },
          select: (item) => (this.searchData.realName = item.value),
        },
        {
          type: "input",
          prop: "phone",
          placeholder: "phone",
          clearable: true,
        },
        {
          type: "select",
          prop: "role",
          placeholder: "role",
          multiple: true,
          labelValue: {
            label: "roleName",
            value: "roleId",
          },
          clearable: true,
          options: [],
        },
      ],
      searchData: {
        username: "",
        realName: "",
        phone: "",
        role: [],
        deptId: [],
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
          label: "user_name",
          prop: "username",
        },
        {
          label: "real_name",
          prop: "realName",
        },
        {
          label: "部门",
          prop: "deptName",
        },
        {
          label: "phone",
          prop: "phone",
        },
        {
          label: "role",
          type: "html",
          showOverflowTooltip: true,
          html: (row) => {
            const roleList = row.roleList || [];
            let str = "";
            roleList.forEach((v) => {
              str += `<span class='priBtn'> ${v.roleName} </span>`;
            });
            return str;
          },
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
        // 4.3.9删除
        // {
        //   label: "platform",
        //   type: "html",
        //   html: (row) => {
        //     const roleList = row.platformList || [];
        //     let str = "";
        //     roleList.forEach((v) => {
        //       str += `<span class='comBtn'>${v.platformName}</span>`;
        //     });
        //     return str;
        //   },
        // },
        {
          label: "create_time",
          prop: "createTime",
        },

        {
          label: "operate",
          type: "html",
          width: "240",
          html: () => {
            const btn = `<span class='link comBtn' data-tagName="edit">${this.$t(
              "edit"
            )}</span>
            <span class='comBtn danger' data-tagName="del">${this.$t(
              "delete"
            )}</span>
            <span class='comBtn link' data-tagName="reset">${this.$t(
              "reset"
            )}</span>`;
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
              this.del(row.userId);
            } else if (tagname === "reset") {
              this.resetVisible = true;
              this.row = {
                ...row,
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
      tableEvents: {
        selectionChange: (val) => {
          this.selectData = val;
        },
      },
    };
  },

  mounted() {
    this.getList();
    this.getNodeData();
    this.searchForm.push({
      type: "cascader",
      prop: "deptId",
      placeholder: "部门",
      props: {
        label: "name",
        value: "id",
        checkStrictly: true,
      },
      clearable: true,
      options: this.department,
    });
  },
  computed: {
    ...mapGetters({
      department: "department",
    }),
  },

  methods: {
    removeUserList() {
      if (this.selectData.length) {
        this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
          confirmButtonText: this.$t("determine"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }).then(() => {
          const arr = this.selectData.map((item) => item.userId);
          removeUser(arr).then(() => {
            this.$notify.success(this.$t("successfully_deleted"));
            this.getList();
          });
        });
      } else {
        this.$message.error(this.$t("no_selected_items"));
      }
    },
    getNodeData() {
      deptRoleList().then((response) => {
        this.searchForm.forEach((v) => {
          if (v.prop === "role") {
            v.options = response.data.data;
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

      if (this.searchData.deptId.length) {
        params.deptId =
          this.searchData.deptId[this.searchData.deptId.length - 1];
      }
      if (this.searchData.role.length) {
        params.role = this.searchData.role;
      }
      this.loading = true;
      fetchList(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    del(id) {
      this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
        confirmButtonText: this.$t("determine"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      }).then(() => {
        delObj(id).then(() => {
          this.getList();
          this.$notify.success(this.$t("successfully_deleted"));
        });
      });
    },
  },
};
</script>
