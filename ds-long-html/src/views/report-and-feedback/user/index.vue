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
      :operation="operation"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      title="举报用户详情"
      :visible.sync="visible"
      center
      v-if="visible"
      :close-on-click-modal="false"
      width="35%"
    >
      <userReportDetails :propSelVidData="row"></userReportDetails>
    </el-dialog>
    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <img width="100%" height="100%" :src="bigImage" alt="" />
    </el-dialog>
  </basic-container>
</template>
<script>
import userReportDetails from "@/views/report-and-feedback/user/userReportDetails.vue";
import { accusationList } from "@/api/accusationList";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { optionADtype } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    userReportDetails,
  },
  data() {
    return {
      bigImage: "",
      imgVisible: false,
      loading: false,
      visible: false,
      row: {},
      tableData: [],
      searchForm: [
        {
          type: "input",
          prop: "accusedUserName",
          placeholder: "请输入被举报用户昵称",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "time",
        },
      ],
      searchData: {
        accusedUserName: "",
        time: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableEvents: {
        selectionChange: (val) => {},
      },
      tableLabel: [
        {
          prop: "targetUserName",
          label: "被举报用户",
        },
        {
          prop: "accusationClassifyName",
          label: "举报原因",
        },
        {
          prop: "accusationContent",
          label: "举报说明",
        },
        {
          prop: "accusationAttachmentList",
          label: "附件",

          width: "300",
          type: "html",
          html: (row) => {
            return row.accusationAttachmentList
              .map((item) => {
                return `<span class='accessory'><img src=${
                  item.attachmentUrl || ""
                }></span>`;
              })
              .join("");
          },
          callback: (row, index, e) => {
            if (e.target.nodeName == "IMG") {
              this.imgVisible = true;
              this.bigImage = e.target.src;
            }
          },
        },
        {
          prop: "accusationUserName",
          label: "举报用户",
        },
        {
          prop: "accusationTime",
          label: "举报时间",
        },

        {
          prop: "handleResult",
          label: "处理结果",
          type: "html",
          html: (row) => {
            const className = row.handleResult == "NONE" ? "" : "must";
            if (row.handleResult == "NONE") {
              return `<span class='${className}'>无违规</span>`;
            } else {
              return `<span class='${className}'>${
                row.handleResult || ""
              }</span>`;
            }
          },
        },
      ],
      operation: {
        label: "操作",
        width: "100",

        btnList: [
          {
            label: "查看",
            type: "primary",
            callback: (row) => {
              this.visible = true;
              this.row = {
                ...row,
                callback: () => {
                  this.visible = false;
                  this.getList();
                },
              };
            },
          },
        ],
      },

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
      if (this.searchData.time && this.searchData.time.length) {
        startTime = this.searchData.time[0];
        endTime = this.searchData.time[1];
      }
      const params = {
        ...this.searchData,
        startTime,
        endTime,
        objectType: "USER",
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      accusationList(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        }
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
::v-deep .accessory {
  display: inline-block;
  cursor: pointer;
  width: 78px;
  height: 78px;
  margin: 5px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
::v-deep .el-dialog--center .el-dialog__body {
  padding: 5px;
}
</style>
