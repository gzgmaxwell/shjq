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
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="35%"
      :close-on-click-modal="false"
    >
      <create :row="row" v-if="visible" />
    </el-dialog>
    <!--  删除   <el-dialog
      title="上传Android文档"
      :visible.sync="IOSvisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <iosUpload :row="row" v-if="IOSvisible" />
    </el-dialog> -->
    <!--  删除  <el-dialog
      title="历史版本"
      :visible.sync="historyVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <history :row="row" v-if="historyVisible" />
    </el-dialog> -->
    <el-dialog
      title="关联租户"
      :visible.sync="relativeVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <relative :row="row" v-if="relativeVisible" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { versionStyle_page, updateVersionStyleStatus } from "@/api/admin/index";
import {
  resetSearchData,
  optTheme,
  EnumTheme,
  EnumVERSIONTYPE,
  filterNullSearchData,
} from "@/util/util";
import create from "./doc/create.vue";
import iosUpload from "./doc/iosUpload.vue";
import history from "./doc/history.vue";
import relative from "./doc/relative.vue";

export default {
  components: {
    tableSearch,
    search,
    create,
    iosUpload,
    history,
    relative,
  },
  data() {
    return {
      loading: false,
      visible: false,
      /*删除  IOSvisible: false, */
      /* 删除 historyVisible: false, */
      relativeVisible: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "name",
          placeholder: "名称",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "状态",
          options: optTheme,
          clearable: true,
        },
      ],
      searchData: {
        name: "",
        status: "",
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
          label: "新建",
          type: "primary",
          callback: () => {
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
        /*    删除   {
          label: "上传Android文档",
          type: "primary",
          callback: () => {
            this.IOSvisible = true;
            this.row = {
              platform: EnumVERSIONTYPE.android,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.IOSvisible = false;
              },
            };
          },
          disabled: () => !this.tableData.length,
        }, */
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "name",
          label: "名称",
        },
        {
          label: "风格图标",
          type: "imgShow",
          imgUrlkey: "imgUrl",
          width: 100,
          callback: (row) => (row.visible = true),
          closeCallback: (row) => (row.visible = false),
        },
        {
          label: "android替换资源",
          type: "html",
          html: (row) => {
            return `<span class="link" data-tagName="edit">${
              row.resourceAddressUrl || ""
            }</span>`;
          },
          callback: (row) => {
            window.location.href = row.resourceAddressUrl;
          },
        },
        {
          label: "IOS替换资源",
          type: "html",
          html: (row) => {
            return `<span class="link" data-tagName="edit">${
              row.iosResourceAddressUrl || ""
            }</span>`;
          },
          callback: (row) => {
            window.location.href = row.iosResourceAddressUrl;
          },
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            return optTheme.find((v) => v.id === row.status)?.name;
          },
        },
        {
          label: "关联租户数量",
          type: "html",
          width: "120",
          html: (row) => {
            if (row.tenantCount) {
              return `<span class="link" data-tagName="edit">${row.tenantCount}</span>`;
            }
            return "";
          },
          callback: (row) => {
            this.relativeVisible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.relativeVisible = false;
              },
            };
          },
        },
        {
          prop: "updateTime",
          label: "修改时间",
        },
        {
          label: "操作",
          type: "html",
          width: "180",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const start = `<span class='link comBtn' data-tagName="start">启用</span>`;
            const stop = `<span class='comBtn danger' data-tagName="stop">停用</span>`;
            /* 删除 const history = `<span class='link comBtn' data-tagName="history">查看历史版本</span>`; */
            if (row.status === EnumTheme.start) {
              return `${edit} ${stop}`;
            } else if (row.status === EnumTheme.stop) {
              return `${edit} ${start}`;
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
            }
            if (tagname === "stop") {
              this.$confirm("此风格将被停用，是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                updateVersionStyleStatus({
                  id: row.id,
                  status: EnumTheme.stop,
                }).then(() => {
                  this.$message.success("停用成功");
                  this.getList();
                });
              });
            }
            if (tagname === "start") {
              updateVersionStyleStatus({
                id: row.id,
                status: EnumTheme.start,
              }).then(() => {
                this.$message.success("启用成功");
                this.getList();
              });
            }
            /*  删除   if (tagname === "history") {
              this.historyVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.historyVisible = false;
                },
              };
            } */
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
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      permissions: "permissions",
    }),
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      versionStyle_page(params)
        .then((res) => {
          this.loading = false;
          res.data.data.records.forEach((v) => (v.visible = false));
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
