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
      :isIndex="true"
    >
      <template #btnListSlot="{ row, index }">
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
      title="上传URL"
      :visible.sync="visible"
      width="30%"
      :close-on-click-modal="false"
    >
      <uploadURL v-if="visible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import uploadURL from "./uploadURL.vue";
import {
  packageAuditPage,
  packageAuditHandle,
  package_upload_url,
  packageAuditRemove,
} from "@/api/common";
import {
  createParams,
  resetSearchData,
  optAccount,
  optAuditStatus,
  EnumSignature,
  EnumAuditStatus,
  optLong,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";

export default {
  components: {
    tableSearch,
    search,
    uploadURL,
  },
  props: {
    webPageMenu: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "distrMobile",
          placeholder: "渠道商账号",
          clearable: true,
        },
        {
          type: "input",
          prop: "distrName",
          placeholder: "渠道商名称",
          clearable: true,
        },
      ],
      searchData: {
        distrMobile: "",
        distrName: "",
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
      tableData: [],
      tableLabel: [
        {
          label: "版本",
          prop: "appVersion",
        },
        {
          label: "渠道商账号",
          prop: "distrMobile",
        },
        {
          label: "渠道商名称",
          prop: "distrName",
        },
        {
          label: "账号状态",
          type: "filter",
          filter: (row) => {
            return optAccount.find((v) => v.id === row.status)?.name;
          },
        },
        {
          label: "申请签名时间",
          prop: "createTime",
        },
        {
          label: "视频平台",
          type: "filter",
          filter: (row) => {
            return optLong.find((v) => v.id === row.registerBusPlatformId)
              ?.name;
          },
        },
        {
          label: "安装包状态",
          prop: "createTime",
          type: "filter",
          filter: (col) => {
            const isQiyong =
              !col.abandon && !col.versionDeleted && !col.deleted && col.enable; // 启用
            const isFeiqi =
              col.abandon && !col.versionDeleted && !col.deleted && !col.enable; // 废弃
            const isShanchu = col.versionDeleted || col.deleted; // 删除
            if (isQiyong) {
              return "启用";
            }
            if (isFeiqi) {
              return "废弃";
            }
            if (isShanchu) {
              return "删除";
            }
          },
        },
        {
          label: "url",
          prop: "uploadUrl",
          show: () => this.webPageMenu === EnumSignature.SIGNED,
          width: "150",
          showOverflowTooltip: true,
        },
        {
          label: "审核状态",
          prop: "createTime",
          type: "filter",
          filter: (row) => {
            return optAuditStatus.find((v) => v.id === row.auditStatus)?.name;
          },
        },
        {
          label: "操作",
          type: "slot",
          fixed: "right",
          slotName: "btnListSlot",
          width: "150",
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
      const data = createParams({
        ...this.searchData,
      });
      const params = {
        ...data,
        signStatus: this.webPageMenu,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      packageAuditPage(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records.map((v) => {
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [];
      // 未完成
      if (this.webPageMenu === EnumSignature.FAILED) {
        if (row.auditStatus === EnumAuditStatus.PENDING) {
          btnList.push({
            name: "通过",
            class: "comBtn link",
            callback: () => {
              packageAuditHandle({
                id: row.id,
                auditStatus: "PASSED",
              }).then(() => {
                this.getList();
                this.$message.success("通过成功");
              });
            },
          });
          btnList.push({
            name: "拒绝",
            class: "comBtn link",
            callback: () => {
              this.$confirm("确认拒绝该申请签名吗？", "警告", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  packageAuditHandle({
                    id: row.id,
                    auditStatus: "REJECT",
                  }).then(() => {
                    this.getList();
                    this.$message.success("拒绝成功");
                  });
                })
                .catch(() => {});
            },
          });
        }
        if (row.auditStatus === EnumAuditStatus.PASSED) {
          btnList.push({
            name: "下载",
            class: "comBtn link",
            callback: () => {
              window.location.href = row.distrPackageUrl;
            },
          });
          btnList.push({
            name: "上传",
            class: "comBtn link",
            callback: () => {
              this.row = {
                ...row,
                callback: (data) => {
                  if (!data) {
                    return (this.visible = false);
                  }
                  package_upload_url({
                    packageId: row.packageId,
                    uploadUrl: data.uploadUrl,
                  }).then(() => {
                    this.visible = false;
                    this.getList();
                    this.$message.success("上传成功");
                  });
                },
              };
              this.visible = true;
            },
          });
        }
      }
      // 已完成
      if (this.webPageMenu === EnumSignature.SIGNED) {
        if (row.auditStatus === EnumAuditStatus.PASSED) {
          btnList.push({
            name: "下载",
            class: "comBtn link",
            callback: () => {
              window.location.href = row.distrPackageUrl;
            },
          });
          btnList.push({
            name: "修改",
            class: "comBtn link",
            callback: () => {
              this.row = {
                ...row,
                callback: (data) => {
                  if (!data) {
                    return (this.visible = false);
                  }
                  package_upload_url({
                    packageId: row.packageId,
                    uploadUrl: data.uploadUrl,
                  }).then(() => {
                    this.visible = false;
                    this.getList();
                    this.$message.success("上传成功");
                  });
                },
              };
              this.visible = true;
            },
          });
          btnList.push({
            name: "删除",
            class: "comBtn danger",
            callback: () => {
              this.$confirm(
                "确认删除该数据吗？<br>删除之后需要在渠道商后台重新申请签名。",
                "警告",
                {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  packageAuditRemove(row.id).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.getList();
                    this.$message.success("删除成功");
                  });
                })
                .catch(() => {});
            },
          });
        }
      }
      return btnList;
    },
  },
};
</script>
