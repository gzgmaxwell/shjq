<template>
  <div>
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
      :tablePage="tablePage"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
  </div>
</template>
<script>
import {
  formatDurationToTime,
  optionsTimeType,
  videoLength,
  optVideoStyle,
  resetSearchData,
} from "@/util/util";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { getWgsVidTabData } from "@/api/video-manage/audit-record.js";
export default {
  components: {
    tableSearch,
    search,
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
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "input",
          prop: "createUsername",
          placeholder: "请输入作者",
          clearable: true,
        },
        {
          type: "input",
          prop: "updateUsername",
          placeholder: "请输入下架用户",
          clearable: true,
          labelWidth: "120",
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
        createUsername: "",
        updateUsername: "",
        tiemData: [],
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
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],

      tableLabel: [
        {
          prop: "videoIntroduce",
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
          prop: "createUsername",
          label: "作者",
        },
        {
          prop: "updateUsername",
          label: "下架用户",
        },

        {
          prop: "publishTime",
          label: "发布时间",
          sortable: true,
        },
        {
          prop: "updateTime",
          label: "下架时间",
          sortable: true,
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
        ...this.searchData,
        videoLengthDTOList: this.selectedTimeLength,
        current: this.tablePage.current,
        size: this.tablePage.size,
        orderType: 2,
      };
      this.loading = true;
      getWgsVidTabData(params).then((res) => {
        const { data } = res;

        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            return v;
          });
          this.tablePage.total = data.data.total;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #0285bd;
  padding: 5px 10px;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>
