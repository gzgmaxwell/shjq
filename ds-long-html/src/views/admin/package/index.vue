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
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '安装包重新生成' : '安装包生成'"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <create :row="row" v-if="visible" />
    </el-dialog>
    <el-dialog
      title="查看"
      :visible.sync="checkVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <packegeCheck :row="row" v-if="checkVisible" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { package_page, package_delete, package_regenerate } from "@/api/admin";
import { pageHandle } from "@/util/pageHandle";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import create from "./component/create.vue";
import packegeCheck from "@/views/common/packegeCheck";
import { optPackage, resetSearchData, EnumPackage } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    create,
    packegeCheck,
  },
  data() {
    return {
      timer: null,
      visible: false,
      checkVisible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "packageName",
          placeholder: "包名",
          clearable: true,
        },
        {
          type: "input",
          prop: "versionOfficial",
          placeholder: "版本",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "状态",
          clearable: true,
          options: optPackage,
        },
      ],
      searchData: {
        packageName: "",
        versionOfficial: "",
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
          label: "reset",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          label: "安装包生成",
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
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "versionOfficial",
          label: "版本号",
        },
        {
          prop: "packageName",
          label: "包名",
        },
        {
          prop: "appid",
          label: "appid",
        },

        {
          label: "状态",
          type: "filter",
          filter: (row) => optPackage.find((v) => v.id === row.status)?.name,
        },
        {
          prop: "createTime",
          label: "提交时间",
        },
        {
          prop: "generateTime",
          label: "生成时间",
        },
        {
          label: "操作",
          type: "html",
          width: "180",
          html: (row) => {
            let str = "";
            const reInstallPackage = `<span class='link comBtn' data-tagName="reInstallPackage">重新打包</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            const download = `<span class='link comBtn' data-tagName="download">下载</span>`;
            if (row.status === EnumPackage.FAILED) {
              str += reInstallPackage;
            }
            if (row.status === EnumPackage.SUCCEED) {
              str += download;
            }
            str += del;
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "reInstallPackage") {
              package_regenerate({
                id: row.id,
              }).then(() => {
                this.$message.success("正在打包中");
                this.getList();
              });
            } else if (tagname === "del") {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                package_delete({
                  id: row.id,
                }).then(() => {
                  const newCurrent = pageHandle(
                    this.tablePage.current,
                    this.tablePage.size,
                    this.tablePage.total
                  );
                  this.tablePage.current = newCurrent;
                  this.$message.success("删除成功");
                  this.getList();
                });
              });
            } else if (tagname === "download") {
              if (!row.packageUrl) {
                return this.$message.warning("下载地址为空");
              }
              window.location.href = row.packageUrl;
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
    this.timer = setInterval(() => {
      this.getList();
    }, 10000);
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      package_page(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
