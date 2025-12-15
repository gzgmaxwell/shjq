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
    </tableSearch>
    <el-dialog
      title="分配"
      :visible.sync="distributionVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <distribution v-if="distributionVisible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import { assignUser } from "@/api/video-manage/await-examine";
import distribution from "@/views/video-manage/violationCheck/distribution.vue";
import { waitAssignPre } from "@/api/video-manage/await-examine.js";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  debounceCallBack,
  videoLength,
  optionsTimeType,
  formatDurationToTime,
  optionsChannelSource,
  optionsResolution,
  showTag,
  resetSearchData,
  optVideoStyle,
  videoViolation,
  filterNullSearchData,
  optPaidVideo,
} from "@/util/util";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    distribution,
  },
  data() {
    return {
      distributionVisible: false,
      optionsTimeType: optionsTimeType,
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
          type: "select",
          prop: "channel",
          options: optionsChannelSource,
          placeholder: "来源",
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
        classifyId: "",
        videoResolutionList: [],
        type: "",
        tiemData: [],
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
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      tableLabel: [
        {
          label: "视频来源",
          type: "filter",
          filter: (row) => {
            const item = optionsChannelSource.find((v) => v.id === row.channel);
            return item?.name;
          },
        },
        {
          prop: "",
          label: "视频封面",
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
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        // {
        //   label: "话题",
        //   type: "html",
        //   html: (row) => {
        //     const arr = row.topicVoList || [];
        //     return arr
        //       .map((item) => `<span class="tags">${item.topicName}</span></br>`)
        //       .join("");
        //   },
        // },
        {
          label: "提交时间",
          prop: "createTime",
        },
        {
          prop: "resolution",
          label: "分辨率",
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
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
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
    this.getClassify();
  },

  methods: {
    getClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        videoLengthDTOList: this.selectedTimeLength,
        workRounds: 2,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      waitAssignPre(params)
        .then((res) => {
          this.loading = false;
          const { data } = res;
          const list = data.data.records || [];
          list.forEach((v) => {
            v.visible = false;
            v.btnList = this.getBtnList();
          });
          this.tableData = list;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList() {
      const btnList = [
        {
          name: "分配",
          class: "comBtn link",
          callback: ({ row }) => {
            this.distributionVisible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (data && Object.keys(data).length) {
                  const { id, userId } = data;
                  const params = {
                    id,
                    userId,
                  };
                  const comSubmit = () => {
                    return assignUser(params).then((res) => {
                      if (res.data.code == 200) {
                        this.$message.success("分配成功");
                        this.getList();
                      }
                    });
                  };
                  debounceCallBack(comSubmit)();
                }
                this.distributionVisible = false;
              },
            };
          },
        },
      ];
      return btnList;
    },
  },
};
</script>
