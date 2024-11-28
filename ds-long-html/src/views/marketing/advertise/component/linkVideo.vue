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
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="true"
      :isSelection="true"
      :isSingleSelection="true"
      :pageSizes="[5, 10, 20, 30, 40, 50]"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
    <span slot="footer" style="display: block; text-align: right">
      <el-button @click="row.callback && row.callback()">取 消</el-button>
      <el-button
        type="primary"
        :disabled="selectionData.length !== 1"
        @click="
          () => {
            row.callback({
              from: 'video',
              ...this.selectionData[0],
            });
          }
        "
        >添加</el-button
      >
    </span>
  </div>
</template>
<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { resetSearchData, filterNullSearchData } from "@/util/util";
import { videotab } from "@/api/content/management";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入标题",
          clearable: true,
          styleWidth: "150",
        },
      ],
      searchData: {
        videoTitle: "",
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
            this.tablePage.size = 5;
            this.getList();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "videoTitle",
          label: "视频信息",
          type: "videoPlay",
          callback: (row) => {
            row.visible = true;
          },
          closeCallback: (row) => {
            row.visible = false;
          },
        },
        {
          label: "视频标题",
          type: "slot",
          slotName: "videoTitle",
        },
        {
          label: "综合评分",
          prop: "overallScoring",
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
      ],

      tablePage: {
        total: 1,
        current: 1,
        size: 5,
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
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        failure: false,
        size: this.tablePage.size,
      };
      this.loading = true;
      videotab(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.data.page.records.map((v) => {
          v.visible = false;
          v.coverUrl = v?.coverFileUrl;
          return v;
        });
        this.tablePage.total = res.data.data.page.total;
      });
    },
  },
};
</script>
