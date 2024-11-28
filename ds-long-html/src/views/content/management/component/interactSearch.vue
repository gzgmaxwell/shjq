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
      :tableEvents="tableEvents"
      :isIndex="true"
    >
    </tableSearch>
  </basic-container>
</template>
<script>
import { getCommentDetail, deletereview } from "@/api/content/management";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      bigImage: "",
      loading: false,
      that: this,
      visible: false,
      imgVisible: false,
      refuseReason: [],
      searchForm: [
        {
          type: "input",
          prop: "commentContent",
          placeholder: "请输入评论内容",
          clearable: true,
        },
      ],
      searchData: {
        commentContent: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableData: [],

      tableEvents: {
        selectionChange: (val) => {},
      },
      tableLabel: [
        {
          prop: "commentContent",
          label: "评论内容",
        },
        {
          prop: "createTime",
          label: "评论时间",
        },
        {
          prop: "likeNumber",
          label: "点赞",

          sortable: true,
        },
        {
          prop: "commentUserName",
          label: "评论人",
        },
        {
          label: "操作",
          width: "100",

          type: "html",
          html: (row) => {
            return `<span class='danger comBtn'>删除</span>`;
          },
          callback: (row, index, e) => {
            this.$confirm("确认删除吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                deletereview({ commentId: row.id }).then((res) => {
                  const { data } = res;
                  if (data.code == 200) {
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
        },
      ],
      operation: {},

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
        commentId: this.row.id,
      };
      this.loading = true;
      getCommentDetail(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        }
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
