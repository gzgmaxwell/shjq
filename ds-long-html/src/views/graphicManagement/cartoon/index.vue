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
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="true"
      :isSelection="true"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.intro" placement="top" popper-class="pre">
          <span class="clamp3 pre">{{ row.intro }}</span>
        </el-tooltip>
      </template>
      <template #classifyName="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(classifyOptions, row.classifyIds).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(
                  classifyOptions,
                  row.classifyIds
                )"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" :type="type" />
    </el-dialog>
    <el-dialog
      title="章节"
      :close-on-click-modal="false"
      :visible.sync="chapterVisible"
      width="70%"
    >
      <chapter v-if="chapterVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  inklore_delete,
  inklore_page,
  inklore_available,
  availableBatch,
  modifyAuthorBatch,
  deleteBatch,
  inklore_saveOrUpdate,
} from "@/api/graphicManagement/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import chapter from "./chapter.vue";
import {
  optCartoonStatus,
  optCartoonSpace,
  showTag,
  resetSearchData,
  filterNullSearchData,
  optShowExpireTime,
  isBusPlatform,
  EnumCartoonType,
  optCartoonType,
  optCartoonOrigin,
} from "@/util/util";
import create from "./create.vue";
import { mapGetters } from "vuex";

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: EnumCartoonType.comic,
    },
  },
  components: {
    tableSearch,
    search,
    create,
    chapter,
  },

  data() {
    return {
      visible: false,
      chapterVisible: false,
      row: {},
      pageConfig: optCartoonType.find((v) => v.id === this.type),
      loading: false,
      selectionData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "name",
          placeholder: "作品名称",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          options: optCartoonStatus,
          placeholder: "状态",
          clearable: true,
        },
        {
          type: "input",
          prop: "authorName",
          placeholder: "作者",
          clearable: true,
          styleWidth: "150",
        },

        {
          styleWidth: "150",
          type: "select",
          prop: "classifyIds",
          options: [],
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          placeholder: "请选择APP标签",
          clearable: true,
          multiple: true,
        },
        {
          type: "select",
          prop: "available",
          options: optShowExpireTime,
          placeholder: "上架状态",
          clearable: true,
        },
        {
          type: "select",
          prop: "source",
          options: optCartoonOrigin,
          placeholder: "来源",
          clearable: true,
        },
      ],
      searchData: {
        name: "",
        status: "",
        authorName: "",
        classifyIds: "",
        available: "",
        source: "",
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
          label: "新建",
          type: "primary",
          callback: () => {
            this.$modalGraphic({
              row: {
                callback: ({ form, handleClose }) => {
                  inklore_saveOrUpdate(form).then(() => {
                    this.$message.success(form.id ? "编辑成功" : "保存成功");
                    handleClose();
                    this.getList();
                  });
                },
              },
              type: this.type,
              author: false,
            });
          },
          auth: () => isBusPlatform(),
        },
        {
          label: "批量下架",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            if (this.selectionData.some((v) => !v.authorId)) {
              return true;
            }
            return this.selectionData.some((v) => !v.available);
          },
          callback: () => {
            this.$modalReject({
              tip: `确定下架${this.selectionData.length}本${this.pageConfig.name}吗?`,
              callback: ({ refuseCode }) => {
                availableBatch({
                  ids: this.selectionData.map((v) => v.id),
                  available: false,
                  refuseReason: refuseCode,
                }).then(() => {
                  this.$message.success("批量下架成功");
                  this.getList();
                });
              },
            });
          },
        },
        {
          label: "批量上架",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            if (this.selectionData.some((v) => !v.chapterNum)) {
              return true;
            }
            if (this.selectionData.some((v) => !v.authorId)) {
              return true;
            }
            return this.selectionData.some((v) => v.available);
          },
          callback: () => {
            this.$confirm(
              `确定上架${this.selectionData.length}本${this.pageConfig.name}吗?`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            ).then(() => {
              availableBatch({
                ids: this.selectionData.map((v) => v.id),
                available: true,
              }).then(() => {
                this.$message.success("批量上架成功");
                this.getList();
              });
            });
          },
        },
        {
          label: "修改作者",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            return false;
          },
          callback: () => {
            this.$modalPatchAuthors({
              callback: ({ form, handleClose }) => {
                modifyAuthorBatch({
                  ids: this.selectionData.map((v) => v.id),
                  authorId: form.createUserId,
                })
                  .then(() => {
                    this.$message.success("批量修改作者成功");
                    handleClose();
                    this.getList();
                  })
                  .catch(() => {
                    this.loading = false;
                  });
              },
            });
          },
        },
        {
          label: "批量删除",
          type: "danger",
          disabled: () => {
            if (!this.selectionData.length) return true;
            return this.selectionData.some((v) => v.available);
          },
          callback: () => {
            this.$confirm(
              `确定删除${this.selectionData.length}本${this.pageConfig.name}吗?`,
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
                deleteBatch(params).then(() => {
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
          label: "作品名称",
          prop: "name",
        },
        {
          label: "作者",
          prop: "authorNickName",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "封面",
          type: "imgShow",
          imgUrlkey: "coverImageUrl",
          width: 100,
          callback: (row) => {
            this.$modalImage({
              imageURL: row.coverImageUrl,
            });
          },
        },
        {
          label: "简介",
          type: "slot",
          slotName: "videoTitle",
          align: "left",
          headerAlign: "center",
        },
        {
          label: "来源",
          type: "filter",
          filter: (row) =>
            optCartoonOrigin.find((v) => v.id === row.source)?.name,
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) =>
            optCartoonStatus.find((v) => v.id === row.status)?.name,
        },
        {
          label: "篇幅",
          type: "filter",
          filter: (row) =>
            optCartoonSpace.find((v) => v.id === row.space)?.name,
        },

        {
          label: "正文",
          type: "html",
          html: () => {
            return `<span class='link'>预览</span>`;
          },
          callback: (row) => {
            this.$modalPreview({
              id: row.code,
              type: this.type,
            });
          },
        },

        {
          label: "章节数",
          prop: "chapterNum",
        },
        {
          label: "用户评分",
          prop: "userScore",
        },
        {
          label: "是否上架",
          type: "filter",
          filter: (row) =>
            optShowExpireTime.find((v) => v.id === row.available)?.name,
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
        {
          label: "上架时间",
          prop: "availableTime",
        },
        {
          label: "最后更新时间",
          prop: "latestUpdateTime",
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          fixed: "right",
          html: (row) => {
            const edit = `<span data-tagName="edit" class="link comBtn">编辑</span>`;
            const chapter = `<span data-tagName="chapter" class="link comBtn">章节</span>`;
            const on = `<span data-tagName="on" class="link comBtn ${
              !row.chapterNum ? "disabled" : ""
            }">上架</span>`;
            const off = `<span data-tagName="off" class="comBtn danger">下架</span>`;
            const del = `<span data-tagName="del" class="comBtn danger">删除</span>`;
            let str = edit;

            if (isBusPlatform()) {
              str += chapter;
            }

            if (!row.available) {
              str += del;
            }
            if (row.authorId) {
              if (row.available) {
                str += off;
              } else {
                str += on;
              }
            }
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "edit") {
              this.$modalGraphic({
                row: {
                  ...row,
                  callback: ({ form, handleClose }) => {
                    inklore_saveOrUpdate(form).then(() => {
                      this.$message.success(form.id ? "编辑成功" : "保存成功");
                      handleClose();
                      this.getList();
                    });
                  },
                },
                type: row.type,
                author: false, // 三方作者
              });
            }
            if (tagname === "del") {
              this.$confirm("此操作将永久删除数据，是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                inklore_delete(row.id).then(() => {
                  this.visible = false;
                  this.$message.success("删除成功");
                  this.getList();
                });
              });
            }
            if (tagname === "chapter") {
              this.$router.push({
                path: "/graphicManagement/cartoon/chapter",
                query: {
                  code: row.code,
                  name: row.name,
                  type: this.type,
                },
              });
            }
            if (tagname === "on") {
              if (!row.chapterNum) return;
              this.onAndOff(row.id, true);
            }
            if (tagname === "off") {
              this.$modalReject({
                callback: ({ refuseCode }) => {
                  this.onAndOff(row.id, false, refuseCode);
                },
              });
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
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      permissions: "permissions",
      adminTag: "adminTag",
    }),
    compOpt() {
      return (arr, str) => {
        return showTag(arr, str || []);
      };
    },
  },
  mounted() {
    this.getList();
    this.getClassify();
  },

  methods: {
    getClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyIds") {
          v.options = this.classifyOptions;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        type: this.type,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      inklore_page(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onAndOff(id, available, reason) {
      inklore_available({
        id: id,
        available: available,
        refuseReason: reason,
      })
        .then(() => {
          if (available) {
            this.$message.success("上架成功");
          } else {
            this.$message.success("下架成功");
          }
          this.getList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
