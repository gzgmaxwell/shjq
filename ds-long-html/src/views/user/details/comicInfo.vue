<template>
  <div class="mt20">
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
      <template #name="{ row }">
        <el-tooltip :content="row.name" placement="top">
          <div class="clamp3">
            {{ row.name }}
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
      title="查看"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <comicCheckInfo v-if="visible" :row="row" />
    </el-dialog>
  </div>
</template>
<script>
import comicCheckInfo from "./comicCheckInfo.vue";
import { userInkLoreList } from "@/api/graphicManagement";
import { getSubstanceDataInfo } from "@/api/userList";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { mapGetters } from "vuex";
import {
  showTag,
  videoUnmountStatus,
  ENUM_VIDEO_STATUS,
  optCartoonType,
  resetSearchData,
  filterNullSearchData,
  EnumCartoonType,
  comicStatus,
  ENUM_COMIC_STATUS,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    comicCheckInfo,
  },
  data() {
    return {
      loading: false,
      that: this,
      visible: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "name",
          placeholder: "作品标题",
          clearable: true,
        },
        {
          type: "select",
          prop: "classifyIds",
          placeholder: "全部标签",
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          options: [],
          multiple: true,
          clearable: true,
        },
        {
          type: "select",
          prop: "available",
          placeholder: "全部状态",
          options: comicStatus,
          clearable: true,
        },
        {
          type: "select",
          prop: "type",
          placeholder: "全部类型",
          options: optCartoonType,
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        name: "",
        classifyIds: [],
        available: "",
        type: "",
        dateTime: [],
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
      tableLabel: [
        {
          label: "作品信息",
          type: "imgShow",
          imgUrlkey: "coverImageUrl",
          width: 100,
          callback: (row) => {
            this.$modalPreview({
              id: row.code,
              type: row.type,
            });
          },
        },
        {
          label: "作品标题",
          type: "slot",
          slotName: "name",
        },
        {
          prop: "type",
          label: "类型",
          type: "html",
          html: (row) => {
            const item = optCartoonType.find((v) => v.id === row.type);
            return `<span>${item?.name || ""}</span>`;
          },
        },
        {
          prop: "createTime",
          label: "发布时间",
          width: "150",
          sortable: true,
          callback: (row) => {},
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "状态",
          type: "html",
          html: (row) => {
            const className =
              ENUM_COMIC_STATUS.normal === row.available
                ? "danger"
                : "arrangetwo";
            const item = comicStatus.find((v) => v.id === row.available);
            return `<span class="${className}">${item.name}</span>`;
          },
        },
        {
          prop: "watchCount",
          label: "阅读",
        },
        {
          prop: "commentCount",
          label: "评论",
        },
        {
          prop: "collectionCount",
          label: "收藏",
        },
        {
          prop: "forwardCount",
          label: "分享",
        },

        {
          prop: "accusationCount",
          label: "举报",
        },
        {
          label: "操作",
          type: "html",
          width: "80",
          html: (row) => {
            const look = `<span class="comBtn link" data-tagName="look">查看</span>`;
            return look;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "look") {
              this.visible = true;
              this.row = {
                ...row,
                callback: () => {
                  this.visible = false;
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
        // const conditon = (str || "").split(",") || [];
        return showTag(arr, str);
      };
    },
  },

  mounted() {
    this.getList();
    this.categoryList();
  },

  methods: {
    categoryList() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyIds") {
          v.options = this.classifyOptions;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        authorId: this.$route.query.id,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      userInkLoreList(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
