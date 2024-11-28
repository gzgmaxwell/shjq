<template>
  <basic-container>
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
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      title="新增"
      :visible.sync="visible"
      width="35%"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row"></create>
    </el-dialog>
  </basic-container>
</template>

<script>
import { ENUM_DIC_TYPE } from "@/util/util";
import { mapGetters } from "vuex";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { projectPackageList, updateProjectPackage } from "@/api/admin/index";
import create from "./create.vue";
export default {
  components: {
    tableSearch,
    search,
    create,
  },
  data() {
    return {
      visible: false,
      row: {},
      optionPackage: [],
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        {
          type: "select",
          prop: "projectName",
          labelWidth: "50px",
          options: [],
          placeholder: "请选择项目",
          clearable: true,
          labelValue: {
            label: "dictionaryKey",
            value: "dictionaryKey",
          },
        },
        {
          type: "select",
          prop: "appSystemName",
          labelWidth: "50px",
          options: [
            {
              name: "ios",
              id: "ios",
            },
            {
              name: "android",
              id: "android",
            },
          ],
          placeholder: "操作系统",
          clearable: true,
        },
      ],
      searchData: {
        projectName: "",
        appSystemName: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "success",
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
          prop: "projectName",
          label: "项目",
        },
        {
          prop: "appSystemName",
          label: "操作系统",
        },
        {
          prop: "appVersion",
          label: "版本号",
        },
        {
          prop: "createUserName",
          label: "上传人",
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          label: "操作",
          type: "html",
          width: "120",
          html: (row) => {
            const del = `<span class='danger comBtn' data-tagName="delete">删除</span> `;
            let enable = `<span class='link comBtn' data-tagName="enable">启用</span> `;
            let disabled = `<span class='danger comBtn' data-tagName="disabled">禁用</span> `;
            if (row.status == "NORMAL") {
              return disabled + del;
            } else if (row.status == "DISABLED") {
              return enable + del;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "enable") {
              this.$confirm("此操作将 启用, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  let params = {
                    id: row.id,
                    status: "NORMAL",
                  };
                  updateProjectPackage(params).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      this.$message.success("启用成功");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            } else if (tagname === "disabled") {
              this.$confirm(
                "此操作将 被禁用的安装包将无法结算收益！, 是否继续?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  let params = {
                    id: row.id,
                    status: "DISABLED",
                  };
                  updateProjectPackage(params).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      this.$message.success("禁用成功");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            } else if (tagname === "delete") {
              this.$confirm("此操作将 删除 安装包, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  let params = {
                    id: row.id,
                    status: "DELETED",
                  };
                  updateProjectPackage(params).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      this.$message.success("删除成功");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
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
      tableEvents: {
        selectionChange: (val) => {},
      },
    };
  },
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
  },

  mounted() {
    this.optionPackage = this.dictionary[ENUM_DIC_TYPE.package];
    this.getList();
    this.packageList();
  },

  methods: {
    packageList() {
      this.searchForm.forEach((v) => {
        if (v.type === "select" && v.prop == "projectName") {
          v.options = this.optionPackage;
        }
      });
    },
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      projectPackageList(params).then((res) => {
        const { data } = res;
        this.loading = false;
        data.data.records.forEach((v) => (v.visible = false));
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.projectName = "";
      this.searchData.appSystemName = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
