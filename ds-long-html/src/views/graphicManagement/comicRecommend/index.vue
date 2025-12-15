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
      <template #name="{ row }">
        <el-tooltip :content="row.name" placement="top">
          <div class="clamp3">
            {{ row.name }}
          </div>
        </el-tooltip>
      </template>
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
    <el-dialog
      :title="`新增${pageConfig.name}推荐`"
      :visible.sync="visible"
      width="1700px"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" :type="type" />
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  inkLoreRecommendList,
  deleteInkLoreRecommend,
} from "@/api/graphicManagement/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  optCartoonStatus,
  optCartoonSpace,
  showTag,
  resetSearchData,
  filterNullSearchData,
  optShowExpireTime,
  EnumCartoonType,
  optCartoonType,
} from "@/util/util";
import create from "./create.vue";
import { mapGetters } from "vuex";
import { pageHandle } from "@/util/pageHandle";

export default {
  name: "comicRecommend", //漫画推荐管理
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
  },

  data() {
    return {
      visible: false,
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
      ],
      searchData: {
        name: "",
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
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          label: "新增推荐",
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
        {
          label: "批量移除",
          type: "danger",
          disabled: () => {
            if (!this.selectionData.length) return true;
          },
          callback: () => {
            this.$confirm(
              `确定移除${this.selectionData.length}本${this.pageConfig.name}吗?`,
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
                  inkLoreIds: ids,
                };
                deleteInkLoreRecommend(params).then(() => {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.getList();
                  this.$message.success("移除成功");
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
          type: "slot",
          slotName: "name",
        },
        {
          width: "130",
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
          width: "140",
          label: "上架时间",
          prop: "availableTime",
        },
        {
          width: "140",
          label: "最后更新时间",
          prop: "latestUpdateTime",
        },
        {
          label: "操作",
          type: "html",
          width: "80",
          fixed: "right",
          html: (row) => {
            const del = `<span data-tagName="del" class="comBtn danger">移除</span>`;
            return del;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "del") {
              this.$confirm("此操作将永久移除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  deleteInkLoreRecommend({ inkLoreIds: [row.id] }).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.getList();
                    this.$message.success("移除成功");
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
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
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
        inkLorePageType: "RECOMMEND",
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      inkLoreRecommendList(params)
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
