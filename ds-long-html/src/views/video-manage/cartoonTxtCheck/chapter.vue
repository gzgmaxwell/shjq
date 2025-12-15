<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      style="position: relative"
    >
      <el-button
        type="primary"
        style="position: absolute; right: 0"
        @click="goback"
        >返回</el-button
      >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="true"
      :isSelection="true"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
  </basic-container>
</template>

<script>
import {
  chapterGather_page,
  chapterGather_deleteBatch,
  chapterGather_update,
  chapterGather_preview,
} from "@/api/graphicManagement/index.js";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  resetSearchData,
  filterNullSearchData,
  optCartoonType,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";

export default {
  components: {
    tableSearch,
    search,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      chapterRow: {},
      loading: false,
      selectionData: [],
      searchForm: [
        {
          type: "input",
          prop: "title",
          placeholder: "请输入章节名称",
          clearable: true,
        },
      ],
      searchData: {
        title: "",
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
        // {
        //   label: "批量删除",
        //   type: "danger",
        //   disabled: () => {
        //     if (!this.selectionData.length) return true;
        //   },
        //   callback: () => {
        //     this.$confirm(
        //       `确定删除${this.selectionData.length}个章节吗?`,
        //       "提示",
        //       {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         type: "warning",
        //       }
        //     )
        //       .then(() => {
        //         chapterGather_deleteBatch({
        //           ids: this.selectionData.map((item) => item.id),
        //           busPlatformId: localStorage.getItem("BusPlatformId"),
        //         }).then(() => {
        //           if (this.tableData.length && this.tablePage.current > 1) {
        //             this.tablePage.current--;
        //           }
        //           this.getList();
        //           this.$message.success("删除成功");
        //         });
        //       })
        //       .catch(() => {});
        //   },
        // },
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      tableLabel: [
        {
          label: "章节标题",
          prop: "title",
        },
        {
          label: "章节序号",
          prop: "sort",
        },
        {
          label: "章节正文",
          type: "html",
          html: (row) => {
            return `<span class='link'>预览</span>`;
          },
          callback: (row, index) => {
            this.$modalPreview({
              id: row.inkLoreCode,
              chapterId: row.id,
              type: this.$route.query.type,
              API_chapterPage: chapterGather_page,
              API_chapterPre: chapterGather_preview,
            });
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
        {
          label: "最后更新时间",
          prop: "latestUpdateTime",
        },
        {
          label: "操作",
          type: "html",
          width: "150",
          fixed: "right",
          html: (row) => {
            const edit = `<span data-tagName="edit" class="link comBtn">编辑</span>`;
            const del = `<span data-tagName="del" class="danger comBtn">删除</span>`;
            let str = edit;
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "edit") {
              this.$modalChapter({
                row: {
                  ...row,
                  callback: ({ form, handleClose }) => {
                    handleClose();
                    this.getList();
                  },
                },
                query: this.$route.query,
                contentList: false, // 源文件
                API: chapterGather_update,
                API_preview: chapterGather_preview,
              });
            }
            if (tagname === "del") {
              this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  chapterGather_deleteBatch({
                    ids: [row.id],
                    busPlatformId: localStorage.getItem("BusPlatformId"),
                  }).then(() => {
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
            }
          },
        },
      ],
      tablePage: {
        total: 0,
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
  computed: {},
  mounted() {
    this.getList();
  },

  methods: {
    goback() {
      this.$router.push({
        path: optCartoonType.find((v) => v.id === this.$route.query.type)
          .gobackCheck,
        query: { back: this.$route.query.type },
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        code: this.$route.query.code,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      chapterGather_page(params)
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
};
</script>
