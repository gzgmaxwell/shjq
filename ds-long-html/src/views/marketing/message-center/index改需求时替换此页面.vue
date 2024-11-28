<template>
  <basic-container>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '查看' : '新建'"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <create :row="row" v-if="visible" />
    </el-dialog>
  </basic-container>
</template>

<script>
import create from "@/views/marketing/message-center/create";
import {
  queryList,
  addObj,
  putObj,
  cancel,
  putObjView,
} from "@/api/marketing/message-center";
import pagination from "@/components/bas-pagination/index";
import { trackingCountAdDayData } from "@/api/marketing/index";
import { seat } from "@/api/content/advertising";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { optionComStatus, optionsMessageType } from "@/util/util";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    create,
  },
  data() {
    return {
      loading: false,
      visible: false,
      that: this,
      row: {},
      searchForm: [
        {
          label: "消息描述:",
          type: "input",
          prop: "msgDesc",
          placeholder: "请输入消息描述",
          clearable: true,
          labelWidth: "75px",
        },
        {
          label: "消息状态:",
          type: "select",
          prop: "status",
          placeholder: "请选择消息状态",
          clearable: true,
          options: optionsMessageType,
        },
        {
          label: "推送时间:",
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        msgDesc: "",
        status: "ALL",
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "发送消息",
          type: "primary",
          callback: (row) => {
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
          prop: "msgDescription",
          label: "消息描述",
        },
        {
          prop: "msgTitle",
          label: "标题",
        },
        {
          prop: "sendUserName",
          label: "发送人",
        },
        {
          prop: "status",
          label: "消息状态",
          type: "filter",
          filter: (row) => {
            const item =
              optionsMessageType.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "sendTime",
          label: "推送时间",
        },
        {
          label: "操作",
          type: "html",
          width: 100,
          html: (row) => {
            const search = `<span class="link comBtn">查看</span>`;
            return search;
          },
          callback: (row) => {
            this.visible = true;
            this.row = {
              ...row,
              callback: () => {
                this.visible = false;
              },
            };
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
      };
      this.loading = true;
      queryList(params).then((res) => {
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
      this.searchData.msgDesc = "";
      this.searchData.status = "ALL";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
