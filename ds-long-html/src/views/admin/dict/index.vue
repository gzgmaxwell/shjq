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
      <dictEdit :row="row"></dictEdit>
    </el-dialog>
  </basic-container>
</template>

<script>
import { delObj, fetchList } from "@/api/admin/dict";
import dictEdit from "@/views/admin/dict/dictEdit.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { ENUM_DIC_TYPE } from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    tableSearch,
    search,
    dictEdit,
  },
  data() {
    return {
      title: "",
      visible: false,
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          label: "字典 key:",
          type: "input",
          prop: "dictionaryKey",
          placeholder: "请输入字典key",
          clearable: true,
          labelWidth: "70px",
        },
        {
          label: "字典类型:",
          type: "select",
          prop: "dictionaryType",
          options: [
            {
              label: "视频推荐等级",
              value: ENUM_DIC_TYPE.recommend_level,
            },
            {
              label: "视频观看权限",
              value: ENUM_DIC_TYPE.watch_power,
            },
            {
              label: "视频下载权限",
              value: ENUM_DIC_TYPE.download_power,
            },
            {
              label: "排序等级",
              value: ENUM_DIC_TYPE.sort_level,
            },
            {
              label: "封禁时长",
              value: ENUM_DIC_TYPE.ban_duration,
            },
            {
              label: "语言切换",
              value: ENUM_DIC_TYPE.language_select,
            },
          ],
          placeholder: "请选择字典类型",
          clearable: true,
          labelValue: {
            label: "label",
            value: "value",
          },
        },
      ],
      searchData: {
        dictionaryKey: "",
        dictionaryType: "",
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
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "dictionaryKey",
          label: "字典 key",
        },
        {
          prop: "dictionaryValue",
          label: "字典value",
        },
        {
          prop: "dictionaryTypeDesc",
          label: "字典详情",
        },
        {
          prop: "dictionaryType",
          label: "字典类型",
        },
        {
          prop: "createTime",
          label: "创建时间",
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
              this.$confirm(
                '是否确认删除数据类型为"' + row.dictionaryKey + '"的数据项?',
                "警告",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              ).then(() => {
                delObj(row).then((res) => {
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
      fetchList(params)
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
      this.searchData.dictionaryType = "";
      this.searchData.dictionaryKey = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped></style>
