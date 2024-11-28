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
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog
      title="添加来源"
      :visible.sync="soruceVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <addSource v-if="soruceVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { pageHandle } from "@/util/pageHandle";
import { channelList, deleteVideoGatherChannel } from "@/api/content/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import create from "./create.vue";
import addSource from "@/views/content/triateralplatform/addSource.vue";
import { optionTriaStatus } from "@/util/util";
import { getAuthorName } from "@/api/authorName/index";

export default {
  components: {
    tableSearch,
    search,
    create,
    addSource,
  },
  data() {
    return {
      loading: false,
      visible: false,
      soruceVisible: false,
      optionUserId: [],
      row: {},
      searchForm: [
        {
          label: "渠道名称:",
          type: "input",
          prop: "channelName",
          placeholder: "请输入视频名称",
          clearable: true,
          labelWidth: "50",
        },
        {
          label: "状态:",
          type: "select",
          prop: "status",
          placeholder: "请选择",
          options: optionTriaStatus,
          clearable: true,
        },
        {
          label: "创建时间:",
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        channelName: "",
        status: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        { label: "新增", type: "primary", callback: this.create },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "渠道名称",
          prop: "channelName",
        },
        {
          label: "主键",
          prop: "id",
        },
        {
          label: "上传权限目录",
          prop: "channelPath",
        },
        {
          label: "渠道密钥key",
          prop: "secretKey",
        },
        {
          label: "渠道标识UUID",
          prop: "channelKey",
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item =
              optionTriaStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
        {
          label: "修改时间",
          prop: "updateTime",
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            const addSource = `<span class='link comBtn' data-tagName="addSource">添加来源</span>`;
            return `${edit} ${del} ${addSource}`;
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
              this.$confirm("确定要删除此条数据?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  deleteVideoGatherChannel(row.id).then((res) => {
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
            } else if (tagname === "addSource") {
              this.soruceVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.soruceVisible = false;
                },
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
    getAuthorName({ nickName: "" }).then((res) => {
      this.loading = false;
      this.optionUserId = res.data.data;
      this.getList();
    });
  },

  methods: {
    getList() {
      let startCreateTime = "";
      let endCreateTime = "";
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        startCreateTime = this.searchData.dateTime[0];
        endCreateTime = this.searchData.dateTime[1];
      }
      const params = {
        ...this.searchData,
        startCreateTime,
        endCreateTime,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      channelList(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },

    create() {
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
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.dateTime = [];
      this.searchData.channelName = "";
      this.searchData.status = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
