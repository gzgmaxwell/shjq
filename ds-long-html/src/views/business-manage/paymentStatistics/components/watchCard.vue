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
      :isIndex="false"
      :isSelection="false"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
      <template #classifyName="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(classifyOptions, row.classifyId).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(classifyOptions, row.classifyId)"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
      <el-dialog
        title="购买详情"
        :visible.sync="visible"
        width="50%"
        :close-on-click-modal="false"
      >
        <buyDetails :row="row" v-if="visible"></buyDetails>
      </el-dialog>
    </tableSearch>
  </div>
</template>

<script>
import { videoCardUseStatistics } from "@/api/admin/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import buyDetails from "./buyDetails.vue";
import {
  formatDurationToTime,
  showTag,
  resetSearchData,
  filterNullSearchData,
} from "@/util/util";
import { mapGetters } from "vuex";

export default {
  name: "watchCard",
  components: {
    tableSearch,
    search,
    buyDetails,
  },

  data() {
    return {
      row: {},
      visible: false,
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          styleWidth: "150",
          type: "select",
          prop: "classifyId",
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
          type: "input",
          prop: "createUserName",
          placeholder: "请输入作者名",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        classifyId: "",
        createUserName: "",
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
      ],
      tableData: [],
      tableEvents: {},
      tableLabel: [
        {
          prop: "",
          label: "视频信息",
          type: "videoPlay",
          width: 100,
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
          label: "作者",
          prop: "createUserName",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "用户评分",
          prop: "userOverallScoring",
        },
        {
          prop: "videoLength",
          label: "视频时长",
          type: "filter",
          filter: (row) => {
            const result = parseInt(row.videoLength / 1000);
            const videoLength = formatDurationToTime(result);
            return videoLength;
          },
        },
        {
          label: "上架时间",
          prop: "auditTime",
          sortable: true,
        },
        {
          label: "观影卡使用次数",
          type: "html",
          html: (row) => {
            return `<span>${row.useCount}</span>`;
          },
          callback: (row) => {
            // this.visible = true;
            // this.row = {
            //   onlineId: row.onlineId,
            //   callback: (data) => {
            //     if (data) {
            //       this.getList();
            //     }
            //     this.visible = false;
            //   },
            // };
          },
        },
      ],
      tablePage: {
        total: 1,
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
        const conditon = (str || "").split(",") || [];
        return showTag(arr, conditon);
      };
    },
  },
  mounted() {
    this.getList();
    this.searchClassify();
  },

  methods: {
    searchClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      videoCardUseStatistics(params)
        .then((res) => {
          this.loading = false;
          this.tableData =
            res.data.data.records.map((item) => {
              item.visible = false;
              item.coverUrl = item?.coverFileUrl;
              return item;
            }) || [];
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
