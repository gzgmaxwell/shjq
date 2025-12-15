<template>
  <div>
    <el-card class="card">
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
        :isIndex="false"
      >
      </tableSearch>
    </el-card>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="30%"
      center
      v-if="visible"
      :close-on-click-modal="false"
    >
      <userListEdit :row="row"></userListEdit>
    </el-dialog>
  </div>
</template>
<script>
import {
  ENUM_USER_STATUS,
  userAccountStatus,
  userRegistSource,
  ENUM_USER_VIPINFO,
  userVipInfo,
  userGender,
  resetSearchData,
} from "@/util/util";
import userListEdit from "@/views/user/userList/userListEdit.vue";
import { dsUserList, dsUserDelete, userlikePage } from "@/api/userList";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    tableSearch,
    search,
    userListEdit,
  },
  data() {
    return {
      loading: false,
      visible: false,
      row: {},
      searchForm: [
        {
          type: "autocomplete",
          prop: "nickName",
          placeholder: "查询用户昵称",
          clearable: true,
          fetchSuggestions: (queryString, cb) => {
            if (queryString === "") {
              return cb([]);
            }
            const params = {
              nickname: queryString,
            };
            userlikePage(params).then((res) => {
              const data = res.data?.data?.records.map((v) => {
                return {
                  value: v.nickname,
                };
              });
              cb(data);
            });
          },
          select: (item) => (this.searchData.nickName = item.value),
        },
        {
          type: "input",
          prop: "mobile",
          placeholder: "查询手机号",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "全部账号状态",
          options: userAccountStatus,
          clearable: true,
        },
        {
          type: "select",
          prop: "type",
          placeholder: "全部注册来源",
          options: userRegistSource,
          clearable: true,
        },
        {
          type: "select",
          prop: "vipInfo",
          placeholder: "全部用户信息",
          options: userVipInfo,
          clearable: true,
        },
      ],
      searchData: {
        nickName: "",
        mobile: "",
        status: "",
        type: "",
        vipInfo: ENUM_USER_VIPINFO.allVip,
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "重置",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              status: "ENABLE",
              vipType: "no",
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
      tableEvents: {
        selectionChange: (val) => {},
      },
      tableLabel: [
        {
          prop: "nickName",
          label: "用户昵称",
        },
        {
          prop: "mobile",
          label: "手机号",
        },
        {
          prop: "model",
          label: "注册设备",
        },
        {
          label: "注册系统版本",
          type: "html",
          html: (row) => {
            return `<span >${row.systemPlatform || ""}${
              row.osVersion || ""
            }</span>`;
          },
        },
        {
          prop: "loginModel",
          label: "上次登录设备",
        },
        {
          prop: "mobile",
          label: "上次登录系统版本",
          width: 150,
          type: "html",
          html: (row) => {
            return `<span >${row.loginSystemPlatform || ""}${
              row.loginOsVersion || ""
            }</span>`;
          },
        },
        {
          prop: "age",
          label: "年龄",
        },
        {
          prop: "age",
          label: "性别",
          type: "html",
          html: (row) => {
            const gender = userGender.find((v) => v.id == row.gender);
            return `<span >${gender?.name || ""}</span>`;
          },
        },
        // {
        //   prop: "address",
        //   label: "地区",
        // },
        {
          prop: "address",
          label: "注册来源",
          type: "html",
          html: (row) => {
            const item = userRegistSource.find((v) => v.id == row.userType);
            return `<span >${item?.name || "未知"}</span>`;
          },
        },
        {
          prop: "createTime",
          label: "注册时间",
        },
        {
          prop: "vipType",
          label: "全部用户信息",
          type: "html",
          html: (row) => {
            const item = userVipInfo.find((v) => v.id == row.vipType);
            return `<span >${item?.name}</span>`;
          },
        },
        {
          prop: "remainingDays",
          label: "无限观影剩余天数",
          width: "120",
        },
        {
          prop: "status",
          label: "账号状态",
          type: "html",
          html: (row) => {
            const item =
              userAccountStatus.find((v) => v.id === row.status) || {};
            return `<span class='must'>${item.name}</span>`;
          },
        },
        {
          label: "操作",
          width: "130",
          type: "html",
          html: (row) => {
            const str = `<span class='link comBtn' data-tagName="details">详情</span>
              <span class='link comBtn' data-tagName="edit">编辑</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            if (row.status != ENUM_USER_STATUS.logoff) {
              return str + del;
            } else {
              return del;
            }
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
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  dsUserDelete(row.id).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.getList();
                    return this.$message.success("删除成功");
                  });
                })
                .catch(() => {});
            } else if (tagname === "details") {
              this.$router.push({
                path: "/user/details/index",
                query: { id: row.id, createUserName: row.nickName },
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
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      dsUserList(params)
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
::v-deep .el-dialog__header {
  background-color: #0285bd;
  padding: 5px 10px;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>
