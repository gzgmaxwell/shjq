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
      <template #name="{ row }">
        <el-tooltip :content="row.name" placement="top">
          <div class="clamp3">
            {{ row.name }}
          </div>
        </el-tooltip>
      </template>
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
  </div>
</template>

<script>
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  showTag,
  resetSearchData,
  filterNullSearchData,
  optCartoonStatus,
  optCartoonSpace,
} from "@/util/util";
import { newClassifyListForPlatForm } from "@/api/content/classify";
import {
  inklore_contentCenter,
  inklore_tenantImport,
} from "@/api/graphicManagement";

export default {
  components: {
    tableSearch,
    search,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      bigImage: "",
      imgVisible: false,
      classifyOptions: [],
      selectionData: [],
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "name",
          placeholder: "请输入作品名称",
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
          prop: "status",
          placeholder: "状态",
          options: optCartoonStatus,
          styleWidth: "120",
          clearable: true,
        },
      ],
      searchData: {
        name: "",
        classifyIds: "",
        status: "",
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
          label: "转入漫画库",
          type: "primary",
          disabled: () => this.selectionData.length === 0,
          callback: () => {
            this.$confirm(
              "<div style='font-size: 15px;font-weight: 600'>这是进行一项操作时必须了解的重要信息</div><div>所选漫画将加入漫画库，确认继续吗?</div>",
              "提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                inklore_tenantImport({
                  inkLoreIds: this.selectionData.map((v) => v.id),
                }).then(() => {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.$message.success("转入漫画库成功");
                  this.getList();
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
          label: "作者",
          prop: "authorNickName",
        },
        {
          label: "标签",
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
          slotName: "intro",
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const data = optCartoonStatus.find((v) => v.id === row.status);
            return data?.name;
          },
        },
        {
          label: "篇幅",
          type: "filter",
          filter: (row) => {
            const data = optCartoonSpace.find((v) => v.id === row.space);
            return data?.name;
          },
        },
        {
          label: "正文",
          type: "html",
          html: (row) => {
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
      let params = {
        current: 1,
        size: 1000,
      };
      newClassifyListForPlatForm(params).then((res) => {
        this.classifyOptions = res.data.data.records;
        this.searchClassify();
      });
    },
    searchClassify() {
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
        type: this.type,
      };
      this.loading = true;
      inklore_contentCenter(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records || [];
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .accessory {
  display: inline-block;
  cursor: pointer;
  width: 78px;
  height: 78px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
