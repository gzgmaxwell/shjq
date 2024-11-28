<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      :remoteMethod="this.remoteMethod"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :lazy="true"
      :tableEvents="tableEvents"
    >
    </tableSearch>
  </div>
</template>

<script>
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { ModifyRelationshipRecordPage } from "@/api/admin/index";
import { listUserIdByUsername } from "@/api/userList";

import { resetSearchData, filterNullSearchData } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      visible: false,
      logVisible: false,
      row: {},
      loading: false,
      tableEvents: {},
      searchForm: [
        {
          type: "input",
          prop: "userId",
          placeholder: "用户ID",
          clearable: true,
        },
        {
          type: "input",
          prop: "userName",
          placeholder: "用户昵称",
          clearable: true,
        },
        {
          styleWidth: "180",
          type: "select",
          prop: "updateUserId",
          options: [],
          placeholder: "请选择操作账号",
          remote: true,
          filterable: true,
          clearable: true,
          reserveKeyword: true,
          labelValue: {
            label: "username",
            value: "userId",
          },
          clear: () => {
            this.getAuthorName();
          },
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        userId: "",
        userName: "",
        updateUserId: "",
        dateTime: [],
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
            this.getAuthorName();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "userName",
          label: "用户昵称",
        },
        {
          label: "原上级ID",
          type: "html",
          html: (row) => {
            const item = row.preInviteUserId ? row.preInviteUserId : "-";
            return `<span>${item}</span>`;
          },
        },
        {
          label: "原上级昵称",
          type: "html",
          html: (row) => {
            const item = row.preInviteUserName ? row.preInviteUserName : "-";
            return `<span>${item}</span>`;
          },
        },
        {
          label: "修改后上级ID",
          type: "html",
          html: (row) => {
            const item = row.curInviteUserId ? row.curInviteUserId : "-";
            return `<span>${item}</span>`;
          },
        },
        {
          label: "修改后上级昵称",
          type: "html",
          html: (row) => {
            const item = row.curInviteUserName ? row.curInviteUserName : "-";
            return `<span>${item}</span>`;
          },
        },

        {
          prop: "createTime",
          label: "操作时间",
        },
        {
          label: "操作账号",
          prop: "updateUserName",
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
    this.getAuthorName();
  },

  methods: {
    //用户列表的接口
    async getAuthorName() {
      const params = {
        current: 1,
        size: 20,
      };
      let { data: res } = await listUserIdByUsername(params);
      this.searchForm.forEach((v) => {
        if (v.prop === "updateUserId") {
          v.options = res.data;
        }
      });
    },
    async remoteMethod(query) {
      if (query) {
        const params = {
          current: 1,
          size: 20,
          username: query,
        };
        let { data: res } = await listUserIdByUsername(params);
        this.searchForm.forEach((v) => {
          if (v.prop === "updateUserId") {
            v.options = res.data.filter((item) => {
              return item.username.indexOf(query) > -1;
            });
          }
        });
      } else {
        this.getAuthorName();
      }
    },
    getList() {
      const params = {
        ...filterNullSearchData({
          ...this.searchData,
        }),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length > 0) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      ModifyRelationshipRecordPage(params)
        .then((res) => {
          this.loading = false;
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
