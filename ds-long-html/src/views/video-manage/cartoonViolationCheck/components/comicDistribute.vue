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
      :tableEvents="tableEvents"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isSelection="false"
    >
      <template #intro="{ row }">
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
    <!-- 待分配页面 -->
    <el-dialog
      title="分配"
      :visible.sync="distributionVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <cartoonDistribution v-if="distributionVisible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import cartoonDistribution from "./cartoonDistribution.vue";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  orderAssignBatch,
  assign_pre,
  chapterGather_page,
  chapterGather_preview,
} from "@/api/graphicManagement/index";

import {
  optionsTimeType,
  debounceCallBack,
  showTag,
  resetSearchData,
  filterNullSearchData,
  optCartoonStatus,
  optCartoonSpace,
  EnumCartoonType,
  optCartoonType,
} from "@/util/util";

export default {
  name: "comicDistribute", //图文违规审核待分配
  components: {
    tableSearch,
    search,
    cartoonDistribution,
  },
  data() {
    return {
      optionsTimeType: optionsTimeType,
      distributionVisible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "inkLoreName",
          placeholder: "作品名称",
          clearable: true,
        },
        {
          type: "select",
          prop: "inkLoreStatus",
          options: optCartoonStatus,
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
        {
          type: "select",
          prop: "inkLoreType",
          options: optCartoonType,
          placeholder: "作品类型",
        },
      ],
      searchData: {
        inkLoreName: "",
        inkLoreStatus: "",
        classifyIds: [],
        inkLoreType: EnumCartoonType.comic,
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
            this.searchData.inkLoreType = EnumCartoonType.comic;
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {},
      },
      tableLabel: [
        {
          label: "作品名称",
          prop: "inkLoreName",
        },
        {
          label: "作者",
          prop: "authorNickName",
        },
        {
          width: "100",
          label: "三方作者名称",
          prop: "thirdAuthorName",
        },
        {
          label: "简介",
          type: "slot",
          slotName: "intro",
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
          label: "上传时间",
          prop: "uploadTime",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "章节数",
          prop: "chapterNum",
        },
        {
          label: "正文",
          type: "html",
          html: () => {
            return `<span class='link'>预览</span>`;
          },
          callback: (row) => {
            this.$modalPreview({
              id: row.inkLoreCode,
              type: row.inkLoreType,
              API_chapterPage: chapterGather_page,
              API_chapterPre: chapterGather_preview,
            });
          },
        },
        {
          label: "连载状态",
          type: "filter",
          filter: (row) =>
            optCartoonStatus.find((v) => v.id === row.inkLoreStatus)?.name,
        },
        {
          label: "篇幅",
          type: "filter",
          filter: (row) =>
            optCartoonSpace.find((v) => v.id === row.space)?.name,
        },
        // {
        //   label: "编辑员",
        //   prop: "editorUserName",
        // },
        // {
        //   label: "审核员",
        //   prop: "rejectUserName",
        // },
        {
          label: "渠道来源",
          prop: "channel",
        },
        {
          label: "作品类型",
          type: "filter",
          filter: (row) =>
            optCartoonType.find((v) => v.id === row.inkLoreType)?.name,
        },
        {
          label: "操作",
          type: "html",
          width: "120",
          fixed: "right",
          html: (row) => {
            const allocation = `<span data-tagName="allocation" class="comBtn link">分配</span>`;
            let str = "";
            str += allocation;
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "allocation") {
              this.distributionVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data && Object.keys(data).length) {
                    const { id, userId } = data;
                    const params = {
                      userId,
                      workOrderIds: [id],
                      workContent: "INK_LORE_CONTENT_EXAMINE",
                    };
                    const comSubmit = () => {
                      return orderAssignBatch(params).then(() => {
                        this.$message.success("分配成功");
                        this.getList();
                      });
                    };
                    debounceCallBack(comSubmit)();
                  }
                  this.distributionVisible = false;
                },
              };
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
    this.getClassify();
    this.getList();
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
        current: this.tablePage.current,
        size: this.tablePage.size,
        busPlatformId: localStorage.getItem("BusPlatformId"),
      };
      this.loading = true;
      assign_pre(params)
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
