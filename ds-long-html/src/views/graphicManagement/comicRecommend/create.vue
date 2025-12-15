<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <div class="choice">
      <span class="el-icon-warning icon-span"></span>
      <p>
        已选择 {{ selectionData.length }} 个列表
        <el-button
          @click="AllAdd"
          :disabled="selectionData.length === 0"
          class="deleteBtn"
          type="primary"
        >
          批量添加
        </el-button>
      </p>
    </div>
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
  </basic-container>
</template>

<script>
import {
  inkLoreRecommendList,
  saveInkLoreRecommend,
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
  debounceCallBack,
} from "@/util/util";
import { mapGetters } from "vuex";
import { pageHandle } from "@/util/pageHandle";

export default {
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      required: false,
      default: EnumCartoonType.comic,
    },
  },
  components: {
    tableSearch,
    search,
  },

  data() {
    return {
      visible: false,
      chapterVisible: false,
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
            const add = `<span data-tagName="add" class="comBtn link">添加</span>`;
            return add;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "add") {
              const comSubmit = () => {
                return saveInkLoreRecommend({ inkLoreIds: [row.id] }).then(
                  () => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.row.callback(true);
                    this.getList();
                    this.$message.success("添加成功");
                    Promise.resolve();
                  }
                );
              };
              debounceCallBack(comSubmit)();
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
    AllAdd() {
      if (this.selectionData.length == 0) return;
      const params = this.selectionData.map((item) => {
        return item.id;
      });
      let info = {
        inkLoreIds: params,
      };
      const comSubmit = () => {
        return saveInkLoreRecommend(info).then(() => {
          if (this.tableData.length && this.tablePage.current > 1) {
            this.tablePage.current--;
          }
          this.$message.success("新增成功");
          this.getList();
          this.row.callback(true);
          Promise.resolve();
        });
      };
      debounceCallBack(comSubmit)();
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
        type: this.type,
        inkLorePageType: "INKLORE",
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
<style lang="scss" scoped>
.choice {
  width: 100%;
  height: 40px;
  border: 1px solid #b3d8ff;
  background-color: #ecf5ff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  .icon-span {
    color: #409eff;
  }
  .deleteBtn {
    padding: 5px 5px;
  }
}
</style>
