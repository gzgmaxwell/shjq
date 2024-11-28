<template>
  <div>
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
      :isIndex="true"
    >
      <template #content="{ row, index }">
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
      :title="title"
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
  </div>
</template>
<script>
import userReportDetails from "@/views/report-and-feedback/user/userReportDetails.vue";
import { queryList } from "@/api/report-and-feedback/video.js";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { resetSearchData } from "@/util/util";
export default {
  props: {
    queryType: {
      type: String,
      default: "",
      required: true,
    },
  },
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
          placeholder: "请输入发表用户昵称",
          clearable: true,
        },
        {
          type: "input",
          prop: "userName",
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
        userName: "",
        time: [],
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
      ],
      tableEvents: {},
      tableLabel: [
        {
          prop: "bulletInfo",
          label: this.labelContent(),
        },
        {
          prop: "appUserName",
          label: "发表用户",
        },
        {
          prop: "accusationClassifyName",
          label: "举报原因",
        },
        {
          prop: "accusationContent",
          label: "详细说明",
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
        {
          label: "操作",
          type: "slot",
          slotName: "content",
          width: "80",
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
  computed: {
    title() {
      return this.queryType == "COMMENT" ? "评论举报详情" : "弹幕举报详情";
    },
  },
  mounted() {
    this.getList();
  },

  methods: {
    labelContent() {
      return this.queryType == "COMMENT" ? "评论" : "弹幕";
    },
    getList() {
      const params = {
        ...this.searchData,
        objectType: this.queryType,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.time && this.searchData.time.length) {
        params.startTime = this.searchData.time[0];
        params.endTime = this.searchData.time[1];
      }
      this.loading = true;
      queryList(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.data.records.map((v) => {
          v.bulletInfo = v.bulletInfo?.content || v.commentInfo?.commentContent;
          v.btnList = this.getBtnList(v);
          return v;
        });
        this.tablePage.total = res.data.data.total;
      });
    },
    getBtnList(row) {
      const btnList = [
        {
          name: "查看",
          type: "check",
          class: "comBtn link",
          callback: ({ row }) => {
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
      ];
      return btnList;
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
