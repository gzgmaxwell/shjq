<template>
  <basic-container>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :operation="operation"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { schedulePage } from "@/api/admin/index";
import {
  videoLength,
  formatDurationToTime,
  optionsTimeType,
  createParams,
  optionsChannelSource,
} from "@/util/util";
export default {
  components: {
    pagination,
    tableSearch,
    search,
  },
  data() {
    return {
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "input",
          prop: "createUserName",
          placeholder: "请输入作者",
          clearable: true,
          styleWidth: "150",
        },
        {
          styleWidth: "180",
          type: "select",
          prop: "channel",
          options: optionsChannelSource,
          placeholder: "全部视频来源",
          clearable: true,
        },
        {
          styleWidth: "180",
          type: "select",
          prop: "tiemData",
          options: optionsTimeType,
          placeholder: "请选择视频时长(分钟)",
          clearable: true,
          multiple: true,
        },
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        channel: "",
        tiemData: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
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
          prop: "videoTitle",
          label: "视频标题",
        },
        {
          prop: "createUserName",
          label: "作者",
        },
        {
          prop: "channel",
          label: "视频来源",
          type: "filter",
          filter: (row) => {
            const item = optionsChannelSource.find((item) => {
              return item.id == row.channel;
            });
            return item.name;
          },
        },
        {
          prop: "videoLength",
          label: "视频时长",
          type: "filter",
          filter: (row) => {
            const result = row.videoLength / 1000;
            const direct = formatDurationToTime(result);
            return direct;
          },
        },
        {
          prop: "createTime",
          label: "发布时间",
        },
        {
          prop: "waterMarkOnSchedule",
          label: "加水印",
          type: "html",
          html: (row) => {
            return `<span>${"处理"} ${row.waterMarkOnSchedule}${"%"}</span>`;
          },
        },
        {
          prop: "waterMarkOffSchedule",
          label: "去水印",
          type: "html",
          html: (row) => {
            return `<span>${"处理"} ${row.waterMarkOffSchedule}${"%"}</span>`;
          },
        },
        {
          prop: "m3u8SplitSchedule",
          label: "切片",
          type: "html",
          html: (row) => {
            return `<span>${"处理"} ${row.m3u8SplitSchedule}${"%"}</span>`;
          },
        },
      ],
      operation: {},
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
    selectedTimeLength() {
      return videoLength(this.searchData.tiemData, optionsTimeType);
    },
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const data = createParams(this.searchData);
      const params = {
        ...data,
        videoLengthDTOList: this.selectedTimeLength,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      schedulePage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        data.data.records.forEach((v) => (v.visible = false));
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.videoTitle = "";
      this.searchData.createUserName = "";
      this.searchData.channel = "";
      this.searchData.tiemData = [];
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
