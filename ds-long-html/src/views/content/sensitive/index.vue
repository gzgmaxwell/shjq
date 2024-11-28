<template>
  <basic-container>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
      <el-upload
        class="upload-demo"
        style="display: inline-block"
        action=""
        :auto-upload="true"
        :show-file-list="false"
        :http-request="upload"
        :before-upload="beforeUploadFile"
      >
        <el-button type="success">导入</el-button>
      </el-upload>
    </search>
    <!-- 自定义上传列表及进度条 -->
    <ul class="upload-progress" v-if="file">
      <li>
        <span>{{ file.name }}</span>
        <button
          class="el-icon-close"
          @click="handleFileRemove()"
          :disabled="cancels"
        ></button>
        <el-progress
          v-if="showProgress"
          :stroke-width="5"
          :percentage="progress"
        />
      </li>
    </ul>
    <tableSearch
      :loading="loading"
      :that="that"
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
      width="30%"
      center
      v-if="visible"
      :close-on-click-modal="false"
    >
      <sensitiveEdit :row="row"></sensitiveEdit>
    </el-dialog>
  </basic-container>
</template>

<script>
import { createParams, downloadExcel } from "@/util/util";
import sensitiveEdit from "@/views/content/sensitive/sensitiveEdit";
import {
  getSensitivList,
  delSensitiv,
  importSensitiv,
  dowlodSensitiv,
  sensitiveWordsExport,
} from "@/api/sensitiv/sensitiv";
import pagination from "@/components/bas-pagination/index.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    sensitiveEdit,
  },
  data() {
    return {
      // 进度条按钮禁用状态
      cancels: false,
      // 是否显示进度条
      showProgress: false,
      // 上传进度
      progress: 0,
      file: null,
      visible: false,
      rowUpload: {},
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "sensitiveWords",
          placeholder: "请输入敏感词",
          clearable: true,
        },
      ],
      searchData: {
        sensitiveWords: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.title = "新 增";
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
        { label: "模版下载", type: "primary", callback: this.dowlod },
        {
          label: "导出",
          type: "success",
          callback: () => {
            // const data = createParams(this.searchData);
            // const params = {
            //   ...data,
            //   current: this.tablePage.current,
            //   size: this.tablePage.size,
            //   currentUserType: "1",
            // };
            sensitiveWordsExport().then((res) => {
              if (res.status == 200) {
                downloadExcel(res.data, "敏感词库列表");
              }
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "sensitiveWords",
          label: "敏感词",
          headerAlign: "center",
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
              this.title = "编 辑";
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
              this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  delSensitiv(row.id).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      return this.$message.success("删除成功");
                    }
                  });
                })
                .catch(() => {});
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
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
  },
  mounted() {
    this.getList();
  },

  methods: {
    // 上传文件之前
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (extension !== "xlsx") {
        this.$message.warning("只能上传后缀是.xlsx");
        return false;
      }
    },
    //上传
    async upload(param) {
      this.cancels = true;
      this.file = param.file;
      const formData = new FormData();
      formData.append("file", param.file);
      this.progress = 0;
      this.showProgress = true;
      try {
        let res = await importSensitiv(formData, (progress) => {
          this.progress = progress;
        });
        if (res.data.code == 200) {
          this.showProgress = false;
          this.file = "";
          this.cancels = false;
          this.getList();
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      } catch (error) {
        this.showProgress = false;
        this.cancels = false;
      }
    },
    // 上传文件移除
    handleFileRemove() {
      this.file = "";
    },
    // 模板下载
    async dowlod() {
      let res = await dowlodSensitiv();
      let href = "";
      if (res.data.code == 200) {
        href = res.data.data;
      }
      window.location.href = href + "/public/template/sensitive.xlsx";
    },
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      getSensitivList(params)
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
      this.searchData.sensitiveWords = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #0285bd;
  .el-dialog__title,
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
.upload-progress {
  list-style: none;
  padding: 0;
  li {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px 10px;
    margin-top: 5px;
    .el-icon-close {
      border: none;
      outline: none;
      background: none;
      display: block;
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      opacity: 0.75;
      color: #606266;
    }
  }
}
</style>
