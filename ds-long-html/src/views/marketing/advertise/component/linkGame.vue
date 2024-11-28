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
        <el-tooltip :content="row.gameName" placement="top">
          <div class="clamp3">
            {{ row.gameName }}
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
    <el-dialog
      class="imgDialog"
      title="图片预览"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <img width="100%" :src="bigImage" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { resetSearchData, filterNullSearchData } from "@/util/util";
import { machineslist } from "@/api/marketing/planning";

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
      bigImage: "",
      imgVisible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "gameName",
          placeholder: "请输入标题",
          clearable: true,
          styleWidth: "150",
        },
      ],
      searchData: {
        gameName: "",
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
          label: "游戏名称",
          prop: "gameName",
        },
        {
          label: "游戏描述",
          prop: "gameDiscription",
          showOverflowTooltip: true,
        },
        {
          label: "游戏海报",
          type: "html",
          html: (row) => {
            if (row.gamePosterUrl) {
              return `<img class='imgWrap' src="${row.gamePosterUrl}">`;
            }
          },
          callback: (row, index, e) => {
            if (e.target.nodeName == "IMG") {
              this.imgVisible = true;
              this.bigImage = e.target.src;
            }
          },
        },
        {
          label: "游戏图标",
          type: "html",
          html: (row) => {
            if (row.gameIconUrl) {
              return `<img class='imgWrap' src="${row.gameIconUrl}">`;
            }
          },
          callback: (row, index, e) => {
            if (e.target.nodeName == "IMG") {
              this.imgVisible = true;
              this.bigImage = e.target.src;
            }
          },
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
        size: this.tablePage.size,
        status: "ON",
      };
      this.loading = true;
      machineslist(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.data.records;
        this.tablePage.total = res.data.data.total;
      });
    },
  },
};
</script>
