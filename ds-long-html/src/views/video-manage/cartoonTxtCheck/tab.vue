<template>
  <div>
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
        <el-tooltip :content="row.intro" placement="top">
          <div class="clamp3">
            {{ row.intro }}
          </div>
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
  </div>
</template>

<script>
import {
  inkloreGather_page,
  inkloreGather_update,
  inkloreGather_deleteBatch,
  chapterGather_page,
  chapterGather_preview,
  inkloreGather_modifyAuthorBatch,
} from "@/api/graphicManagement/index";
import { getVidViolationList } from "@/api/common.js";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import chapter from "./chapter.vue";
import {
  optCartoonTxtStatus,
  optCartoonSpace,
  showTag,
  resetSearchData,
  filterNullSearchData,
  EnumCartoonType,
  optCartoonType,
  EnumCartoonTxtStatus,
  optCartoonStatus,
} from "@/util/util";
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
    chapter,
  },

  data() {
    return {
      row: {},
      pageConfig: optCartoonType.find((v) => v.id === this.type),
      loading: false,
      optRefuseReason: [],
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
          options: optCartoonTxtStatus,
          placeholder: "状态",
          clearable: true,
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
      ],
      searchData: {
        name: "",
        status: "",
        authorName: "",
        classifyIds: "",
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
          label: "修改作者",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            return false;
          },
          callback: () => {
            this.$modalPatchAuthors({
              callback: ({ form, handleClose }) => {
                inkloreGather_modifyAuthorBatch({
                  ids: this.selectionData.map((v) => v.id),
                  authorId: form.createUserId,
                  busPlatformId: localStorage.getItem("BusPlatformId"),
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
            // 10、批量删除仅在选中非审核中状态的图文时高亮。修改作者按钮在选中任意一图文时高亮
            if (!this.selectionData.length) return true;
            return this.selectionData.some(
              (v) => v.auditStatus === EnumCartoonTxtStatus.AUDITING
            );
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
                inkloreGather_deleteBatch({
                  ids: this.selectionData.map((item) => item.id),
                  busPlatformId: localStorage.getItem("BusPlatformId"),
                }).then(() => {
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
          label: "三方作者名称",
          prop: "thirdAuthorName",
          width: "120",
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
        },
        {
          label: "连载状态",
          type: "filter",
          filter: (row) =>
            optCartoonStatus.find((v) => v.id === row.status)?.name,
        },
        {
          prop: "type",
          label: "状态",
          type: "html",
          width: 120,
          html: (row) => {
            const item = optCartoonTxtStatus.find(
              (v) => v.id === row.auditStatus
            );
            let str = `<span>${item?.name}</span>`;
            if (row.refuseCode) {
              const refuseReason = this.optRefuseReason.find(
                (v) => v.refuseCode === row?.refuseCode
              ).refuseReason;
              str += `<div class='danger'>${refuseReason}</div>`;
            }
            return str;
          },
        },

        {
          label: "篇幅",
          type: "filter",
          filter: (row) =>
            optCartoonSpace.find((v) => v.id === row.space)?.name,
        },
        {
          label: "编辑员",
          prop: "editorUserName",
        },
        {
          label: "审核员",
          prop: "rejectUserName",
        },
        {
          label: "渠道来源",
          prop: "channel",
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
              API_chapterPage: chapterGather_page,
              API_chapterPre: chapterGather_preview,
            });
          },
        },

        {
          label: "章节数",
          prop: "chapterNum",
        },
        {
          label: "上传时间",
          prop: "createTime",
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          fixed: "right",
          html: (row) => {
            const edit = `<span data-tagName="edit" class="link comBtn">编辑</span>`;
            const chapter = `<span data-tagName="chapter" class="link comBtn">章节</span>`;
            const del = `<span data-tagName="del" class="comBtn danger">删除</span>`;
            const check = `<span data-tagName="check" class="comBtn link">查看</span>`;
            let str = "";

            if (row.auditStatus === EnumCartoonTxtStatus.AUDIT_REJECTED) {
              str += check + del;
            }

            if (row.auditStatus === EnumCartoonTxtStatus.DRAFT) {
              str += edit + chapter + del;
            }

            if (row.auditStatus === EnumCartoonTxtStatus.AUDITING) {
              str += check;
            }

            if (row.auditStatus === EnumCartoonTxtStatus.UNQUALIFIED) {
              str += edit + del;
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
                  callback: ({ form, handleClose, btnType }) => {
                    let params = {};
                    if (btnType == "sub") {
                      params = {
                        ...form,
                        commit: true,
                      };
                    }
                    if (btnType == "save") {
                      params = {
                        ...form,
                        commit: false,
                      };
                    }
                    inkloreGather_update(params).then(() => {
                      this.$message.success(
                        params.commit ? "提交成功" : "编辑成功"
                      );
                      handleClose();
                      this.getList();
                    });
                  },
                },
                type: row.type,
                author: true, // 三方作者
                submit: true,
              });
            }
            if (tagname === "check") {
              this.$modalGraphic({
                row: {
                  ...row,
                },
                author: true, // 三方作者
                submit: false, // 提交
                check: true, // 查看
              });
            }
            if (tagname === "del") {
              this.$confirm("此操作将永久删除数据，是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                inkloreGather_deleteBatch({
                  ids: [row.id],
                  busPlatformId: localStorage.getItem("BusPlatformId"),
                }).then(() => {
                  this.$message.success("删除成功");
                  this.getList();
                });
              });
            }
            if (tagname === "chapter") {
              this.$router.push({
                path: "/video-manage/cartoonTxtCheck/chapter",
                query: {
                  code: row.code,
                  name: row.name,
                  type: this.type,
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
    this.getInfo();
    this.getList();
    this.getClassify();
  },

  methods: {
    getInfo() {
      let params = {
        current: 1,
        size: 10000,
        contentType: "INK_LORE",
      };
      getVidViolationList(params).then((res) => {
        this.optRefuseReason = res.data.data;
      });
    },
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
        inkLoreType: this.type,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      inkloreGather_page(params)
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
