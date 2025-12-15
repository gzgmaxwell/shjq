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
    >
      <template #content="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
      </template>
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
    <el-dialog
      title="操作日志"
      :visible.sync="logsVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <logs v-if="logsVisible" :row="row" />
    </el-dialog>
  </div>
</template>
<script>
import logs from "@/views/video-manage/audit-record/components/logs.vue";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { getMyVidTabData } from "@/api/video-manage/my-audit-record.js";
import {
  auditOption,
  formatDurationToTime,
  optionsTimeType,
  videoLength,
  createParams,
  resetSearchData,
  AuditPhaseStatus,
  optVideoStyle,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    logs,
  },
  data() {
    return {
      loading: false,
      visible: false,
      logsVisible: false,
      row: {},
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
        },
        {
          type: "select",
          prop: "workRounds",
          placeholder: "审核阶段",
          options: AuditPhaseStatus,
          clearable: true,
          styleWidth: "150",
        },
        {
          type: "select",
          prop: "type",
          placeholder: "审核操作",
          options: auditOption,
          clearable: true,
          styleWidth: "150",
        },
        {
          type: "select",
          prop: "tiemData",
          options: optionsTimeType,
          placeholder: "请选择视频时长(分钟)",
          clearable: true,
          multiple: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
        {
          type: "select",
          prop: "videoSiftType",
          placeholder: "视频样式",
          options: optVideoStyle,
          styleWidth: "120",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        workRounds: "",
        type: "",
        tiemData: [],
        dateTime: [],
        videoSiftType: "",
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
          prop: "videoTitle",
          label: "视频信息",
          width: "100",
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
          prop: "createUserName",
          label: "作者",
        },
        {
          prop: "publishTime",
          label: "发布时间",
          width: "150",
          sortable: true,
        },
        {
          label: "审核阶段",
          type: "filter",
          filter: (row) => {
            const item = AuditPhaseStatus.find((v) => v.id === row.workRounds);
            return item?.name;
          },
        },
        {
          label: "审核操作",
          type: "filter",
          filter: (row) => {
            const item = auditOption.find((v) => v.id === row.type);
            return item?.name;
          },
        },
        {
          prop: "refuseReason",
          label: "审核意见",
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
          label: "提交时间",
          width: "150",
          sortable: true,
        },
        {
          label: "操作",
          type: "slot",
          slotName: "content",
          width: "100",
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
    selectedTimeLength() {
      return videoLength(this.searchData.tiemData, optionsTimeType);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        ...createParams({
          ...this.searchData,
        }),
        videoLengthDTOList: this.selectedTimeLength,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      getMyVidTabData(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = data.data.total;
        }
      });
    },
    getBtnList(row) {
      const btnList = [];
      btnList.push({
        name: "日志",
        class: "comBtn link",
        callback: ({ row: data }) => {
          this.row = {
            ...row,
            callback: () => {
              this.logsVisible = false;
            },
          };
          this.logsVisible = true;
        },
      });

      return btnList;
    },
  },
};
</script>
