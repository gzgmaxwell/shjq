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
      :operation="{}"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      center
      width="40%"
      :close-on-click-modal="false"
    >
      <create :row="row" v-if="visible"></create>
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
import create from "./component/create.vue";
import {
  organization,
  listdelete,
} from "@/api/marketing/planning";
import revamp from "@/views/Appinventory/mymanage/component/revamp.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
import {
  createParams,
  activitiesStatus,
  ENUM_ACTIVE_STATUS,
  EnumComStatus,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    revamp,
    create,
  },
  data() {
    return {
      statusClassEnum: {
        ONGOING: "proceed",
        TOSTART: "wait",
        OVER: "finish",
        OFF: "block",
      },
      bigImage: "",
      loading: false,
      visible: false,
      imgVisible: false,
      row: {},
      searchForm: [
        {
          label: "活动标题:",
          type: "input",
          prop: "activityTilte",
          placeholder: "请输入活动标题",
          clearable: true,
          labelWidth: "75px",
        },
        {
          label: "状态:",
          type: "select",
          prop: "status",
          placeholder: "请选择状态",
          clearable: true,
          options: activitiesStatus,
        },
        {
          label: "活动时间:",
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        activityTilte: "",
        status: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              status: 1,
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
          prop: "activityTilte",
          label: "活动标题",
          width: "150",
        },
        {
          prop: "activityDescription",
          label: "活动描述",
        },
        {
          label: "活动海报",
          width: "150",
          type: "html",
          html: (row) => {
            return row.posterFileUrl
              ? `<span class='accessory'><img  src="${row.posterFileUrl}"></span>`
              : "";
          },
          callback: (row, index, e) => {
            if (e.target.nodeName == "IMG") {
              this.imgVisible = true;
              this.bigImage = e.target.src;
            }
          },
        },
        {
          prop: "activityUrl",
          label: "活动链接",
          sortable: true,
        },
        {
          label: "活动时间",
          sortable: true,
          type: "html",
          html: (row) => {
            return `<span>${row.activityStartTime} ~ ${row.activityEndTime}</span>`;
          },
        },
        {
          label: "活动状态",
          type: "html",
          html: (row) => {
            const item = activitiesStatus.find(
              (item) => item.id === row.status
            );
            return `<span>${item?.name ? item.name : ""}</span>`;
          },
        },
        {
          label: "操作",
          type: "html",
          width: "280",
          html: (col) => {
            let edit = `<span data-tagName="editBtn" class="comBtn link">编辑</span>`;
            let fixeBtn = `<span data-tagName="delBtn" class="comBtn danger">删除</span>`;
            // let startBtn = `<span data-tagName="startBtn" class="comBtn link">启用</span>`;
            // let stopBtn = `<span data-tagName="stopBtn" class="comBtn danger">停用</span>`;
            let strBtn = "";
            const incEdit = [
              ENUM_ACTIVE_STATUS.ongoing,
              ENUM_ACTIVE_STATUS.tostart,
              ENUM_ACTIVE_STATUS.over,
              ENUM_ACTIVE_STATUS.off,
            ];
            const incStart = [
              ENUM_ACTIVE_STATUS.ongoing,
              ENUM_ACTIVE_STATUS.tostart,
            ];
            // const incStop = [ENUM_ACTIVE_STATUS.off];
            if (incEdit.includes(col.status)) {
              strBtn += edit;
            }
            // if (incStart.includes(col.status)) {
            //   strBtn += stopBtn;
            // }
            // if (incStop.includes(col.status)) {
            //   strBtn += startBtn;
            // }
            strBtn += fixeBtn;
            return strBtn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "editBtn") {
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
              this.visible = true;
            } else if (tagname === "delBtn") {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                listdelete({ id: row.id }).then((res) => {
                  if (res.data.code == 200) {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.$message.success("删除成功");
                    this.getList();
                  }
                });
              });
            }
            // else if (tagname === "startBtn") {
            //   activityOperate(row.id).then(() => {
            //     this.$message.success("启用成功");
            //     this.getList();
            //   });
            // } else if (tagname === "stopBtn") {
            //   activityOperate(row.id).then(() => {
            //     this.$message.success("停用成功");
            //     this.getList();
            //   });
            // }
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
      let activityStartTime = "";
      let activityEndTime = "";
      if (this.searchData.dateTime && this.searchData.dateTime.length > 0) {
        activityStartTime = this.searchData.dateTime[0];
        activityEndTime = this.searchData.dateTime[1];
      }
      const data = createParams({
        ...this.searchData,
        activityStartTime,
        activityEndTime,
      });
      const params = {
        ...data,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      organization(params)
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
<style>
.proceed {
  color: #01d18c;
  font-weight: bold;
}
.wait {
  color: #6ffa44;
  font-weight: bold;
}
.finish {
  color: #0caab6;
  font-weight: bold;
}
.block {
  color: #ccc;
  font-weight: bold;
}
</style>
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
