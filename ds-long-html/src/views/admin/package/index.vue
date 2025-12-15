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
      title="安装包生成"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <tabIndex :row="row" v-if="visible" />
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
import {
  package_page,
  package_delete,
  package_regenerate,
  uploadSign,
  saveVersionByTenant,
} from "@/api/admin";
import { pageHandle } from "@/util/pageHandle";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import tabIndex from "./component/tabIndex.vue";
import packegeCheck from "@/views/common/packegeCheck";
import {
  optPackage,
  EnumPackage,
  resetSearchData,
  optAutoPackag,
  EnumVERSIONTYPE,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    tabIndex,
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
          prop: "appName",
          label: "应用名称",
        },
        {
          prop: "platform",
          label: "平台",
        },
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
          prop: "styleName",
          label: "风格",
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
          label: "是否租户同步",
          type: "filter",
          filter: (row) =>
            optAutoPackag.find((v) => v.id === row.copyTenant)?.name,
        },
        {
          label: "发布状态",
          type: "filter",
          filter: (row) =>
            optAutoPackag.find((v) => v.id === row.publishStatus)?.label,
        },
        {
          label: "操作",
          type: "html",
          width: "220",
          html: (row) => {
            const reInstallPackage = `<span class='link comBtn' data-tagName="reInstallPackage">重新打包</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            const download = `<span class='link comBtn' data-tagName="download">下载</span>`;
            const superLink = `<span class='link comBtn' data-tagName="superLink">超级签</span>`;
            const publish = `<span class='link comBtn' data-tagName="publish">发布版本</span>`;
            let str = "";
            if (row.status === EnumPackage.FAILED) {
              str += reInstallPackage;
            }
            if (row.status === EnumPackage.SUCCEED) {
              str += download;
            }
            if (
              row.platform === EnumVERSIONTYPE.ios &&
              row.status === EnumPackage.SUCCEED &&
              !row.sign
            ) {
              str += superLink;
            }
            if (
              (!row.publishStatus &&
                row.status === EnumPackage.SUCCEED &&
                row.sign &&
                row.platform === EnumVERSIONTYPE.ios) ||
              (!row.publishStatus &&
                row.status === EnumPackage.SUCCEED &&
                row.platform === EnumVERSIONTYPE.android)
            ) {
              str += publish;
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
              package_regenerate({ id: row.id }).then(() => {
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
            } else if (tagname === "superLink") {
              this.$prompt("请输入URL", "超级签", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: row.sign,
                // inputPattern: /^(?!s*$). +/,
                inputErrorMessage: "请输入URL",
              })
                .then(({ value }) => {
                  uploadSign({ sign: value, id: row.id }).then(() => {
                    this.$message.success("保存成功");
                    this.getList();
                  });
                })
                .catch(() => {});
            } else if (tagname === "publish") {
              saveVersionByTenant({
                versionId: row.versionId,
                versionFieldId: row.versionFieldId,
                saasPackageId: row.id,
                storeUrl: row.sign,
                busPlatformId: localStorage.getItem("BusPlatformId"),
                apkBucketName: row.packageBucketName,
                apkFileName: row.packageFile,
                packageName: row.packageName,
              }).then(() => {
                this.$message.success("发布成功");
                this.getList();
              });
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
    // this.timer = setInterval(() => {
    //   this.getList();
    // }, 10000);
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
