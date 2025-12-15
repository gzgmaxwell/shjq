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
    <el-dialog
      :title="chapterRow.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <chapterCreate v-if="visible" :row="chapterRow" />
    </el-dialog>
    <el-dialog
      title="生成章节"
      :visible.sync="visibleSplit"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <chapterCreateSplit v-if="visibleSplit" :row="chapterRow" />
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  chapterPage,
  chapterDelete,
  chapterDel,
} from "@/api/graphicManagement/index.js";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  resetSearchData,
  filterNullSearchData,
  EnumCartoonType,
  optCartoonType,
} from "@/util/util";
import chapterCreate from "./chapterCreate.vue";
import chapterCreateSplit from "./chapterCreateSplit.vue";
import { pageHandle } from "@/util/pageHandle";

export default {
  components: {
    tableSearch,
    search,
    chapterCreate,
    chapterCreateSplit,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      visible: false,
      visibleSplit: false,
      previewVisible: false,
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
        {
          label: "新建章节",
          type: "primary",
          callback: () => {
            this.$modalChapter({
              row: {
                callback: ({ form, handleClose }) => {
                  handleClose();
                  this.getList();
                },
              },
              query: this.$route.query,
              contentList: true, // 源文件
            });
            // this.visible = true;
            // this.chapterRow = {
            //   inkLoreCode: this.$route.query.code,
            //   name: this.$route.query.name,
            //   callback: (data) => {
            //     if (data) {
            //       this.getList();
            //     }
            //     this.visible = false;
            //   },
            // };
          },
        },
        {
          label: "生成章节",
          type: "primary",
          callback: () => {
            this.visibleSplit = true;
            this.chapterRow = {
              inkLoreCode: this.$route.query.code,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visibleSplit = false;
              },
            };
          },
          auth: () => this.$route.query?.type === EnumCartoonType.novel,
        },
        {
          label: "批量删除",
          type: "danger",
          disabled: () => {
            if (!this.selectionData.length) return true;
          },
          callback: () => {
            this.$confirm(
              `确定删除${this.selectionData.length}个章节吗?`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                const ids = this.selectionData.map((item) => {
                  return item.id;
                });
                const params = {
                  ids: ids,
                  busPlatformId: localStorage.getItem("BusPlatformId"),
                };
                chapterDel(params).then(() => {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.getList();
                  this.$message.success("删除成功");
                });
              })
              .catch(() => {});
          },
        },
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
            let str = edit + del;
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
                contentList: true, // 源文件:
              });
              // this.visible = true;
              // this.chapterRow = {
              //   ...row,
              //   name: this.$route.query.name,
              //   callback: (data) => {
              //     if (data) {
              //       this.getList();
              //     }
              //     this.visible = false;
              //   },
              // };
            }
            if (tagname === "del") {
              this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  chapterDelete(row.id).then(() => {
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
          .goback,
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
      chapterPage(params)
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
