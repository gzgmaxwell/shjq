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
      :tableEvents="tableEvents"
      :isIndex="true"
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
      <!-- 1.31需求隐藏 -->
      <!-- <template #topic="{ row }">
        <div>
          <el-tooltip
            :content="
              row.labelDtoList
                ? row.labelDtoList.map((item) => item.labelName).join(' ')
                : ''
            "
            placement="top"
          >
            <div class="clamp3">
              <template v-for="(item, index) in row.labelDtoList">
                <el-tag :key="index" style="margin: 2px">{{
                  item.labelName
                }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template> -->
    </tableSearch>
    <!-- <el-dialog
      title="查看"
      :visible.sync="checkVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <commVideoCheck
        v-if="checkVisible"
        :row="row"
        :webPageMenu="webPageMenu"
      />
    </el-dialog> -->
  </div>
</template>
<script>
// import commVideoCheck from "@/views/common/commVideo/commVideoCheck.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import {
  showTag,
  createParams,
  menuEnum,
  formatDurationToTime,
  optionsTimeType,
  videoLength,
  optionsChannelSource,
  optVideoStyle,
  resetSearchData,
  videoViolation,
  filterNullSearchData,
  optPaidVideo,
} from "@/util/util";
import { getReferralPoolsList, deleteReferralPools } from "@/api/admin/index";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
    // commVideoCheck,
  },
  data() {
    return {
      failure: false,
      selectionData: [],
      watchData: [],
      loading: false,
      that: this,
      rejectVisible: false,
      checkVisible: false,
      visible: false,
      editVisible: false,
      pageInfo: {
        isOutHandle: true,
        reason: "下架原因",
      },
      row: {},
      webPageMenu: menuEnum.referralPpool,
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
        {
          type: "input",
          prop: "createUserName",
          placeholder: "请输入作者",
          clearable: true,
          styleWidth: "150",
        },
        {
          styleWidth: "170",
          type: "select",
          prop: "level",
          placeholder: "全部推荐等级",
          options: [],
          labelValue: {
            label: "levelName",
            value: "level",
          },
          clearable: true,
        },
        {
          styleWidth: "170",
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
          type: "select",
          prop: "videoSiftType",
          placeholder: "视频样式",
          options: optVideoStyle,
          styleWidth: "120",
          clearable: true,
        },
        {
          type: "select",
          prop: "paidVideo",
          placeholder: "是否收费",
          options: optPaidVideo,
          styleWidth: "120",
          clearable: true,
        },
        {
          label: "权重分值",
          type: "input",
          prop: "weightScoreLowerLimit",
          placeholder: "起始分值0",
          clearable: true,
        },
        {
          type: "input",
          prop: "weightScoreUpperLimit",
          placeholder: "结束分值20000",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        level: "",
        classifyId: "",
        videoSiftType: "",
        weightScoreLowerLimit: "",
        weightScoreUpperLimit: "",
        paidVideo: "",
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
          label: "移除推荐池",
          type: "danger",
          disabled: () => this.selectionData.length === 0,
          callback: this.batchDelete,
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
          prop: "createTime",
          label: "移入时间",
        },
        {
          prop: "postTime",
          label: "上架时间",
        },
        // {
        //   prop: "watchLevel",
        //   label: "观看权限",
        //   type: "filter",
        //   filter: (row) => {
        //     const arr = this.watchData || [];
        //     const item = arr.find((v) => v.id === row.watchLevel) || {};
        //     return item?.name;
        //   },
        // },
        {
          label: "推荐等级",
          type: "filter",
          filter: (row) => {
            const arr = this.levelData;
            const item = arr.find((v) => v.level === row.level);
            return item?.levelName;
          },
        },
        {
          label: "视频来源",
          type: "filter",
          filter: (row) => {
            const item = optionsChannelSource.find((v) => v.id === row.channel);
            return item?.name;
          },
        },
        {
          prop: "userOverallScoring",
          label: "用户评分",
        },
        {
          label: "权重分值",
          prop: "weightScore",
        },
        {
          prop: "videoCardVisibility",
          width: "85",
          label: "观影卡可看",
          type: "filter",
          filter: (row) => {
            const data = videoViolation.find(
              (v) => v.id === row.videoCardVisibility
            );
            return data?.name;
          },
        },
        {
          width: "85",
          label: "是否收费",
          type: "filter",
          filter: (row) => {
            const data = optPaidVideo.find((v) => v.id === row.paidVideo);
            return data?.name;
          },
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
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
        // {
        //   label: "操作",
        //   type: "html",
        //   width: "100",
        //   html: (row) => {
        //     const search = `<span class='link comBtn' data-tagName="search">查看</span>`;
        //     return search;
        //   },
        //   callback: (row, index, e) => {
        //     this.checkVisible = true;
        //     this.row = {
        //       ...row,
        //       callback: () => {
        //         this.checkVisible = false;
        //       },
        //     };
        //   },
        // },
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
      levelData: "levelData",
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
    this.getList();
    this.categoryList();
    this.recommendList();
  },

  methods: {
    categoryList() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
      });
    },
    recommendList() {
      this.searchForm.forEach((v) => {
        if (v.type === "select" && v.prop === "level") {
          v.options = this.levelData;
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
      getReferralPoolsList(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverFileUrl;
            v.topicVoList = v?.labelDtoList;
            v.partList = [];
            return v;
          });
          this.tablePage.total = data.data.total;
        }
      });
    },
    batchDelete() {
      let num = this.selectionData.length;
      this.$confirm(`确认将 ${num} 个视频移出推荐池？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = this.selectionData.map((item) => item.onlineId);
          const id = data;
          deleteReferralPools(id).then((res) => {
            if (res.data.code == 200) {
              if (this.tableData.length && this.tablePage.current > 1) {
                this.tablePage.current--;
              }
              this.$message.success("移除成功");
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
