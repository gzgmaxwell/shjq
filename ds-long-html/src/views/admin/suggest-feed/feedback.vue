<template>
  <div>
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
      :title="title"
      :visible.sync="visible"
      center
      v-if="visible"
      :close-on-click-modal="false"
    >
      <feedbackEdit :row="row"></feedbackEdit>
    </el-dialog>
    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <div style="height: 700px">
        <img width="100%" height="100%" :src="bigImage" alt="" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryList } from "@/api/admin/suggest-feed.js";
import feedbackEdit from "@/views/admin/suggest-feed/feedbackEdit.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
export default {
  components: {
    tableSearch,
    search,
    feedbackEdit,
  },
  data() {
    return {
      bigImage: "",
      loading: false,
      that: this,
      visible: false,
      imgVisible: false,
      title: "",
      row: {},
      searchForm: [
        {
          label: "反馈用户:",
          type: "input",
          prop: "createUserName",
          placeholder: "请输入反馈用户昵称",
          clearable: true,
          labelWidth: "75px",
        },
        {
          label: "反馈内容:",
          type: "input",
          prop: "feedbackContent",
          placeholder: "请输入反馈内容",
          clearable: true,
        },

        {
          label: "反馈时间:",
          type: "datetimerange",
          prop: "createTime",
        },
      ],
      searchData: {
        createUserName: "",
        feedbackContent: "",
        createTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableData: [],

      tableLabel: [
        {
          prop: "createUserName",
          label: "反馈用户",
          width: "150",
        },
        {
          prop: "feedbackContent",
          label: "反馈内容",
        },
        {
          prop: "attachmentList",
          label: "附件",

          width: "300",
          type: "html",
          html: (row) => {
            return row.attachmentList
              .map((item) => {
                return item.attachmentUrl
                  ? `<span class='accessory'><img  src="${item.attachmentUrl}"></span>`
                  : "";
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
          prop: "contactInfo",
          label: "联系方式",
        },
        {
          prop: "createTime",
          label: "反馈时间",
        },
        {
          label: "操作",

          width: "100",
          type: "html",
          html: (row) => {
            if (row.replyStatus == "1") {
              return `<span class='link comBtn' data-tagName='reply'>回复</span>`;
            } else if (row.replyStatus == "2") {
              return `<span class='link comBtn' data-tagName='serch'>查看</span>`;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "reply") {
              this.title = "编辑";
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
            } else if (tagname === "serch") {
              this.title = "查看";
              this.visible = true;
              this.row = {
                ...row,
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
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      let startTime = "";
      let endTime = "";
      if (this.searchData.createTime && this.searchData.createTime.length) {
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
      this.searchData.createUserName = "";
      this.searchData.feedbackContent = "";
      this.searchData.createTime = [];
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
</style>
