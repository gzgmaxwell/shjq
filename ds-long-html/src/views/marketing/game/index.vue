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
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      center
      width="30%"
      :close-on-click-modal="false"
    >
      <gamepad :row="row" v-if="visible"></gamepad>
    </el-dialog>
    <el-dialog
      class="imgDialog"
      title="图片预览"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <img width="100%" :src="bigImage" alt="" />
    </el-dialog>
  </basic-container>
</template>
<script>
import gamepad from "./component/gamepad.vue";
import { machineslist, omit } from "@/api/marketing/planning";
import revamp from "@/views/Appinventory/mymanage/component/revamp.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
import {
  optionJumpType,
  optionsScreenDirection,
  optionComStatus,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    revamp,
    gamepad,
  },
  data() {
    return {
      bigImage: "",
      loading: false,
      visible: false,
      imgVisible: false,
      title: "",
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "gameName",
          placeholder: "查询游戏名称",
          clearable: true,
        },
      ],
      searchData: {
        gameName: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.title = "新增";
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
          prop: "gameName",
          label: "游戏名称",
          width: "150",
        },
        {
          prop: "gameDiscription",
          label: "游戏描述",
          width: "150",
        },
        {
          label: "游戏海报",
          width: "120",
          type: "html",
          html: (row) => {
            return row.gamePosterUrl
              ? `<span class='accessory'><img  src="${row.gamePosterUrl}"></span>`
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
          label: "游戏图标",
          width: "120",
          type: "html",
          html: (row) => {
            return row.gameIconUrl
              ? `<span class='accessory'><img  src="${row.gameIconUrl}"></span>`
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
          prop: "urlType",
          label: "推广类型",
          type: "filter",
          filter: (row) => {
            const item = optionJumpType.find((v) => v.id === row.urlType) || {};
            return item.name;
          },
        },
        {
          label: "屏幕方向",
          type: "filter",
          filter: (row) => {
            const item =
              optionsScreenDirection.find(
                (v) => v.id === row.screenDirection
              ) || {};
            return item.name;
          },
        },
        {
          prop: "gameUrl",
          label: "跳转链接",
        },

        {
          label: "游戏状态",
          type: "filter",
          filter: (row) => {
            const item = optionComStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "sort",
          label: "排序",
        },
      ],
      operation: {
        label: "操作",
        width: "150",
        btnList: [
          {
            label: "编辑",
            type: "primary",
            callback: (row) => {
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
            },
          },
          {
            label: "删除",
            type: "danger",
            callback: (row) => {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                omit({ id: row.id }).then((res) => {
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
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      machineslist(params)
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

.imgDialog {
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
}
</style>
