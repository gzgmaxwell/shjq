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
      <template #report="{ row }">
        <el-tooltip :content="row.accusationContent" placement="top">
          <div class="clamp3">
            {{ row.accusationContent }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
    <el-dialog
      title="广告投诉详情"
      :visible.sync="visible"
      center
      v-if="visible"
      :close-on-click-modal="false"
    >
      <advertisingComplaintEdit
        :propSelVidData="row"
      ></advertisingComplaintEdit>
    </el-dialog>
    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      v-if="imgVisible"
      :close-on-click-modal="false"
    >
      <img width="100%" :src="bigImage" alt="" />
    </el-dialog>
  </basic-container>
</template>
<script>
import {
  optionADHandletype,
  ENUM_AD_HANDLETYPE,
  optionUpDownStatus,
  optionAdType,
} from "@/util/util";
import { queryViolationTypeList } from "@/api/common.js";
import advertisingComplaintEdit from "@/views/report-and-feedback/advertising-complaint/advertisingComplaintEdit.vue";
import { accusationList } from "@/api/accusationList";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
export default {
  components: {
    tableSearch,
    search,
    advertisingComplaintEdit,
  },
  data() {
    return {
      bigImage: "",
      loading: false,
      visible: false,
      imgVisible: false,
      row: {},
      refuseReason: [],
      searchForm: [
        {
          type: "input",
          prop: "userName",
          placeholder: "举报用户昵称",
          clearable: true,
        },
        {
          type: "input",
          prop: "searchKey",
          placeholder: "广告标题",
          clearable: true,
        },
        {
          type: "select",
          prop: "accusationClassifyId",
          placeholder: "举报原因",
          clearable: true,
          options: [],
          labelValue: {
            label: "classifyName",
            value: "classifyId",
          },
        },
        {
          type: "select",
          prop: "adType",
          placeholder: "广告类型",
          clearable: true,
          options: optionAdType,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "状态",
          clearable: true,
          options: optionADHandletype,
        },
      ],
      searchData: {
        userName: "",
        searchKey: "",
        accusationClassifyId: "",
        adType: "",
        status: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableData: [],

      tableEvents: {
        selectionChange: (val) => {},
      },
      tableLabel: [
        {
          prop: "substanceInfo",
          label: "广告内容",
          width: "100",
          type: "videoPlay",
          callback: (row, index, e) => {
            if (!row.videoOriginalUrl) {
              if (e.target.nodeName == "IMG") {
                this.imgVisible = true;
                this.bigImage = e.target.src;
              }
            } else if (row.videoOriginalUrl) {
              row.visible = true;
            }
          },
          closeCallback: (row) => {
            row.visible = false;
          },
        },
        {
          prop: "advertTitle",
          label: "广告标题",
        },
        {
          prop: "location",
          label: "广告类型",

          type: "filter",
          filter: (row) => {
            const item = optionAdType.find((v) => v.id === row.location) || {};
            return item.name;
          },
        },
        {
          prop: "accusationClassifyName",
          label: "举报原因",
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
        // {
        //   prop: "accusationContent",
        //   label: "举报说明",

        //   type: "tooltip",
        // },
        {
          label: "举报说明",
          type: "slot",
          slotName: "report",
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
          prop: "handleStatus",
          label: "处理状态",

          type: "html",
          html: (row) => {
            const item =
              optionADHandletype.find((v) => v.id == row.handleStatus) || {};
            const className =
              item.id == ENUM_AD_HANDLETYPE.unprocessed ? "must" : "";
            return `<span class=${className}>${item.name}</span>`;
          },
        },
        {
          prop: "status",
          label: "是否下架",

          type: "filter",
          filter: (row) => {
            const item =
              optionUpDownStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          label: "操作",
          width: "100",

          type: "html",
          html: (row) => {
            const item =
              optionADHandletype.find((v) => v.id == row.handleStatus) || {};
            if (item.id == ENUM_AD_HANDLETYPE.unprocessed) {
              return `<span class='link comBtn'>处理</span>`;
            } else {
              return "";
            }
          },
          callback: (row, index, e) => {
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
      operation: {},

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
    this.getViolationTypeList();
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        objectType: "AD",
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      accusationList(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records.map((item) => {
              item.visible = false;
              if (item.adInfo) {
                Object.keys(item.adInfo).forEach((key) => {
                  item[key] = item.adInfo[key];
                });
              }
              item.videoOriginalUrl = item?.videoFileUrl;
              item.coverUrl = item?.adFileUrl;
              return item;
            });
            this.tablePage.total = data.data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getViolationTypeList() {
      queryViolationTypeList(Object.assign({ current: 1, size: 10000 })).then(
        (res) => {
          const { data } = res;
          if (data.code == 200) {
            this.searchForm.forEach((item) => {
              if (item.prop == "accusationClassifyId") {
                item.options = data.data.records;
              }
            });
          }
        }
      );
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
