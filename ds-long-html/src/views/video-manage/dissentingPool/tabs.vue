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
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isSelection="true"
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
      <template #classifyIdWeb="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(adminTag, row.classifyIdWeb).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(adminTag, row.classifyIdWeb)"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
    <el-dialog
      title="分配"
      :visible.sync="dissentingPoolVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <allocation v-if="dissentingPoolVisible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import allocation from "@/views/video-manage/dissentingPool/allocation.vue";
import { mapGetters } from "vuex";
import pagination from "@/components/bas-pagination/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import dissentingPool from "@/views/video-manage/videoList/components/dissentingPool.vue";
import { substancePreVideoPage } from "@/api/video-manage/index";
import {
  videoLength,
  formatDurationToTime,
  optionsTimeType,
  optionsResolution,
  createParams,
  showTag,
  resetSearchData,
  optVideoStyle,
} from "@/util/util";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    dissentingPool,
    allocation,
  },
  props: {
    webPageMenu: {
      type: String,
      default: "BK_VIDEO_LIST",
    },
  },
  data() {
    return {
      channelData: [],
      optClass: [],
      selectionData: [],
      visible: false,
      checkVisible: false,
      dissentingPoolVisible: false,
      row: {},
      loading: false,
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
          styleWidth: "150",
          type: "select",
          prop: "classifyIdWeb",
          options: [],
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          placeholder: "请选择后台标签",
          clearable: true,
          multiple: true,
        },
        {
          styleWidth: "175",
          type: "select",
          prop: "tiemData",
          options: optionsTimeType,
          placeholder: "请选择视频时长(分钟)",
          clearable: true,
          multiple: true,
        },
        {
          type: "select",
          prop: "videoResolutionList",
          placeholder: "分辨率",
          options: optionsResolution,
          styleWidth: "130",
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
        createUserName: "",
        classifyId: "",
        tiemData: [],
        videoResolutionList: [],
        sourceOpt: [],
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
          auth: () => this.permissions.vm_vl_search,
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
          auth: () => this.permissions.vm_vl_reset,
        },
        {
          label: "分配",
          type: "primary",
          disabled: () => this.selectionData.length === 0,
          callback: () => {
            const idsArr = this.selectionData.map((item) => item.preId);
            this.dissentingPoolVisible = true;
            this.row = {
              idsArr,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.dissentingPoolVisible = false;
              },
            };
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
          type: "html",
          html: (row) => {
            return `<span class='clamp1'>${row.createUserName || ""}</span>`;
          },
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "后台标签",
          type: "slot",
          slotName: "classifyIdWeb",
          width: "220",
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
          prop: "resolution",
          label: "分辨率",
        },
        {
          label: "原因",
          prop: "disputeReason",
        },
        {
          label: "编辑员",
          prop: "editorUsername",
        },
        {
          label: "操作",
          type: "html",
          width: "100",
          html: () => {
            const allocation = `<span class='link comBtn' data-tagName="allocation">分配</span>`;
            let str = "";
            return (str += allocation);
          },
          callback: (row, index, e) => {
            this.row = {
              ...row,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.dissentingPoolVisible = false;
              },
            };
            this.dissentingPoolVisible = true;
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
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      permissions: "permissions",
      adminTag: "adminTag",
    }),
    selectedTimeLength() {
      return videoLength(this.searchData.tiemData, optionsTimeType);
    },
    compOpt() {
      return (arr, str) => {
        const conditon = (str || "").split(",") || [];
        return showTag(arr, conditon);
      };
    },
  },

  mounted() {
    this.getClassify();
    this.getList();
  },

  methods: {
    getList() {
      const data = createParams({
        ...this.searchData,
      });
      const params = {
        ...data,
        disputeStatus: true,
        videoLengthDTOList: this.selectedTimeLength,
        webPageMenu: this.webPageMenu,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      substancePreVideoPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          data.data.records.forEach((v) => (v.visible = false));
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
        if (v.prop === "classifyIdWeb") {
          v.options = this.adminTag;
        }
      });
      this.getList();
    },
  },
};
</script>
