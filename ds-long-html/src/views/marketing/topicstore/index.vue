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
      :operation="{}"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <CreateTopicDialog :row="row" v-if="visible" />
    </el-dialog>
    <el-dialog
      title="变更记录"
      :visible.sync="editRecordVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <editRecord :row="row" v-if="editRecordVisible" />
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  substanceTopicPage,
  substanceTopicDel,
} from "@/api/marketing/topic-store";
import { pageHandle } from "@/util/pageHandle";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import CreateTopicDialog from "@/views/marketing/topicstore/component/createTopicDialog.vue";
import editRecord from "@/views/marketing/topicstore/component/editRecord.vue";
import { optionsUserCreateType, optionStatus } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    CreateTopicDialog,
    editRecord,
  },
  data() {
    return {
      visible: false,
      editRecordVisible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "topicName",
          placeholder: "请输入话题",
          clearable: true,
        },
        {
          type: "select",
          prop: "createType",
          placeholder: "请选择创建类型",
          clearable: true,
          options: optionsUserCreateType,
        },
      ],
      searchData: {
        topicName: "",
        createType: "",
      },
      searchHandle: [
        { label: "search", type: "primary", callback: this.search },
        { label: "reset", callback: this.reset },
        {
          label: "新增",
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
          prop: "topicName",
          label: "话题",
        },
        {
          prop: "relativeObjectCount",
          label: "相关作品",
        },
        {
          prop: "seeCount",
          label: "浏览次数",
        },

        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item = optionStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          label: "创建类型",
          type: "filter",
          filter: (row) => {
            const item =
              optionsUserCreateType.find((v) => v.id === row.createType) || {};
            return item.name;
          },
        },
        {
          prop: "createUserName",
          label: "创建人",
        },
        {
          prop: "updateUserName",
          label: "最后修改人",
        },
        {
          prop: "updateTime",
          label: "修改时间",
        },
        {
          label: "操作",
          type: "html",
          width: "180",
          html: () => {
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            const editRecord = `<span class='link comBtn' data-tagName="editRecord">变更记录</span>`;
            const btn = `${edit} ${del} ${editRecord}`;
            return btn;
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
            } else if (tagname === "del") {
              this.del(row.id);
            } else if (tagname === "editRecord") {
              this.editRecordVisible = true;
              this.row = {
                ...row,
              };
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
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      substanceTopicPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    del(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          substanceTopicDel(id).then((res) => {
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
        })
        .catch(() => {});
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
