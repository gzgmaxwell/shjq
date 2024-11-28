<template>
  <basic-container>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
      <el-upload
        style="display: inline-block"
        class="upload-demo"
        action=""
        :auto-upload="true"
        :show-file-list="false"
        :http-request="upload"
        :before-upload="beforeUploadFile"
      >
        <el-button type="success">导入</el-button>
      </el-upload>
      <el-button type="success" class="ml10" @click="exportExcel()">导出</el-button>
    </search>
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
      v-if="visible"
      :close-on-click-modal="false"
    >
      <languageEdit :row="row"></languageEdit>
    </el-dialog>
  </basic-container>
</template>

<script>
import { dowlodSensitiv } from "@/api/sensitiv/sensitiv";
import languageEdit from "@/views/Appinventory/language/languageEdit.vue";
import {
  langPageConfig,
  langImport,
  langDelete,
  langExport,
} from "@/api/language/index";
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { ENUM_DIC_TYPE, downloadExcel } from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
    languageEdit,
  },
  data() {
    return {
      originalTableData: [],
      title: "",
      cancels: false,
      showProgress: false,
      file: null,
      progress: 0,
      optionLanguage: [],
      visible: false,
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "select",
          prop: "dictionaryId",
          placeholder: "状态",
          options: [],
          placeholder: "请选择语言",
          clearable: true,
          labelValue: {
            label: "dictionaryKey",
            value: "id",
          },
        },
        {
          styleWidth: "215",
          type: "input",
          prop: "langKey",
          placeholder: "编码值",
          clearable: true,
          change: () => {
            this.getList();
          },
        },
      ],
      searchData: {
        dictionaryId: "",
        langKey: "",
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
        {
          label: "模版下载",
          type: "primary",
          callback: async () => {
            let res = await dowlodSensitiv();
            let href = "";
            if (res.data.code == 200) {
              href = res.data.data;
            }
            window.location.href = href + "/public/template/lang_template.xlsx";
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "dictionaryKey",
          label: "语言类型",
        },
        {
          prop: "langKey",
          label: "编码值",
        },
        {
          prop: "langValue",
          label: "更改后的值",
        },
        {
          prop: "createUserRealName",
          label: "创建人",
        },
        {
          prop: "langVersion",
          label: "版本号",
        },
        {
          prop: "createTime",
          label: "导入时间",
        },
      ],
      operation: {
        label: "操作",
        width: "250",

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
                  langDelete(row.id).then((res) => {
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
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消删除",
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
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
  },
  mounted() {
    this.optionLanguage = this.dictionary[ENUM_DIC_TYPE.language_select];
    this.getList();
    this.languageList();
  },

  methods: {
    // 上传文件之前
    beforeUploadFile(file) {
      console.log("before upload");
      console.log(file);
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
        let res = await langImport(formData, (progress) => {
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
    languageList() {
      this.searchForm.forEach((v) => {
        if (v.type === "select") {
          v.options = this.optionLanguage;
        }
      });
    },
    exportExcel() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      langExport(params)
        .then((res) => {
          if (res.status == 200) {
            downloadExcel(res.data, "国际化列表");
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      langPageConfig(params)
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
