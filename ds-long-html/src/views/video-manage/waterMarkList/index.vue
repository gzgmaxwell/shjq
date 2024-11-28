<template>
  <basic-container>
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
      title="水印"
      :visible.sync="visible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <waterMark v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog
      title="上传水印"
      :visible.sync="uploadVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <upload v-if="uploadVisible" :row="row" />
    </el-dialog>
    <el-dialog
      title="批量修改作者"
      :close-on-click-modal="false"
      :visible.sync="authorsVisible"
      width="20%"
    >
      <comAuthorsEdit v-if="authorsVisible" :row="row" />
    </el-dialog>
    <el-dialog
      title="切片优先级"
      :close-on-click-modal="false"
      :visible.sync="priorityVisible"
      width="25%"
    >
      <slicePriority v-if="priorityVisible" :row="priorityData" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { getData } from "@/api/video-manage/await-examine.js";
import {
  examineFirstReview,
  batchUpdateByVideoIds,
} from "@/api/video-manage/index.js";
import { getAllVideoGatherChannelList, sourceList } from "@/api/content/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import comAuthorsEdit from "@/views/common/commVideo/comAuthorsEdit.vue";
import waterMark from "@/components/water-mark";
import waterMarkApp from "@/components/water-mark-app";
import slicePriority from "./slicePriority.vue";
import {
  videoLength,
  optionsTimeType,
  formatDurationToTime,
  ENUM_WMT,
  optionsChannelSource,
  enum_work_order,
  optWorkOrder,
  debounceCallBack,
  optionsResolution,
  showTag,
  resetSearchData,
  ENUM_AuditOpra,
  channelEnum,
  optVideoStyle,
  optSliceLevel,
  videoViolation,
  filterNullSearchData,
  enum_paidVideo,
  optPaidVideo,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
import upload from "./upload.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    waterMark,
    upload,
    waterMarkApp,
    comAuthorsEdit,
    slicePriority,
  },

  data() {
    return {
      optionsTimeType: optionsTimeType,
      pageInfo: {
        isOutHandle: true,
        reason: "未通过原因",
      },
      selectionData: [],
      visible: false,
      uploadVisible: false,
      authorsVisible: false,
      priorityVisible: false,
      row: {},
      priorityData: {},
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
          placeholder: "视频来源",
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
          prop: "videoResolutionList",
          placeholder: "分辨率",
          options: optionsResolution,
          styleWidth: "130",
          clearable: true,
          multiple: true,
        },
        {
          type: "select",
          prop: "videoConvertStatus",
          options: optWorkOrder,
          placeholder: "处理状态",
          clearable: true,
        },
        {
          type: "input",
          prop: "thirdUserName",
          placeholder: "三方作者",
          clearable: true,
        },
        {
          type: "cascader",
          prop: "sourceOpt",
          placeholder: "渠道来源",
          clearable: true,
          props: {
            lazy: true,
            lazyLoad(node, resolve) {
              const { level } = node;
              if (level == 0) {
                getAllVideoGatherChannelList().then((res) => {
                  const { data } = res;
                  const nodes = data.data.map((v) => {
                    return {
                      label: v.channelName,
                      value: v.channelName,
                      id: v.id,
                    };
                  });
                  resolve(nodes);
                });
              } else {
                sourceList(node.data.id).then((res) => {
                  const data = res.data?.data || [];
                  const nodes = data.map((v) => {
                    return {
                      label: v.channelSource,
                      value: v.channelSource,
                      leaf: level >= 1,
                    };
                  });
                  resolve(nodes);
                });
              }
            },
          },
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
        channel: "",
        classifyId: "",
        type: "",
        videoResolutionList: [],
        tiemData: [],
        sourceOpt: [],
        videoConvertStatus: "",
        thirdUserName: "",
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
          auth: () => this.permissions.vm_wml_search,
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
          auth: () => this.permissions.vm_wml_reset,
        },
        {
          label: "上传水印",
          type: "primary",
          callback: () => {
            this.uploadVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  return (this.uploadVisible = false);
                }
                this.uploadVisible = false;
              },
            };
          },
          auth: () => this.permissions.vm_wml_upload_wm,
        },
        {
          label: "修改作者",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) {
              return true;
            }
            return this.selectionData.some(
              (v) => v.channel !== channelEnum.THIRD
            );
          },
          callback: () => {
            this.authorsVisible = true;
            this.row = {
              selectionData: this.selectionData,
              callback: (data) => {
                if (data) {
                  batchUpdateByVideoIds({
                    // onlineIds: [],
                    preIds: this.selectionData.map((v) => v.preId),
                    userId: data.createUserId,
                  }).then(() => {
                    this.$message.success("批量修改作者成功");
                    this.authorsVisible = false;
                    this.getList();
                  });
                } else {
                  this.authorsVisible = false;
                }
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
            return `<span class='clamp1'>${row?.createUserName}</span>`;
          },
        },
        {
          label: "三方作者",
          prop: "thirdUserName",
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
        {
          label: "后台标签",
          type: "slot",
          slotName: "classifyIdWeb",
          width: "220",
        },
        // {
        //   label: "话题",
        //   prop: "classifyName",
        //   type: "filter",
        //   filter: (row) => {
        //     const arr = (row.topicVoList || []).map((v) => v.topicName) || [];
        //     return arr.join(",");
        //   },
        // },
        {
          label: "上传时间",
          prop: "createTime",
        },
        {
          label: "编辑员",
          prop: "username",
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
          label: "渠道来源",
          type: "filter",
          filter: (row) => {
            return `${row.channelName ? row.channelName : ""}/${
              row.channelSource ? row.channelSource : ""
            }`;
          },
        },
        {
          label: "切片优先级",
          type: "filter",
          width: "100",
          filter: (row) => {
            const item = optSliceLevel.find((v) => v.id === row.convertSort);
            return item?.name;
          },
        },
        {
          label: "处理状态",
          prop: "videoConvertStatusDb",
          type: "filter",
          filter: (row) => {
            const item = optWorkOrder.find(
              (v) => v.id === row.videoConvertStatusDb
            );
            if (item) {
              return item?.name;
            }
            return;
          },
        },
        {
          label: "处理进度",
          type: "filter",
          filter: (row) => {
            return `${row.videoConvertSchedule}%`;
          },
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          fixed: "right",
          html: (row) => {
            const btnWaterMark = `<span data-tagName="btnWaterMark" class="link comBtn">水印处理</span>`;
            const btnPriority = `<span data-tagName="btnPriority" class="link comBtn">优先级</span>`;
            const btnReject = `<span data-tagName="btnReject" class="danger comBtn">驳回</span>`;
            let str = "";
            if (
              row.videoConvertStatusDb ===
                enum_work_order.VIDEO_CONVERT_PREPARING ||
              row.videoConvertStatusDb === enum_work_order.VIDEO_CONVERT_FAIL
            ) {
              if (this.permissions.vm_wml_wm_handle)
                str += btnWaterMark + btnPriority;
            }

            if (
              row.videoConvertStatusDb === enum_work_order.VIDEO_CONVERT_FAIL
            ) {
              str += btnReject;
            }
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "btnWaterMark") {
              this.visible = true;
              this.row = {
                ...row,
                src: row.videoOriginalUrl,
                waterMarkType: ENUM_WMT.addWaterMark,
                callback: (data, sureBtn) => {
                  const on = [];
                  data.map((v) => {
                    if (v.waterMarkType === ENUM_WMT.addWaterMark) {
                      const item = {
                        realityHeight: v.realityHeight,
                        realityLeft: v.realityLeft,
                        realityTop: v.realityTop,
                        realityWidth: v.realityWidth,
                        opacity: v.opacity,
                        startTime: v.startTime,
                        endTime: v.endTime,
                        waterMarkPicUrl: v.src,
                      };
                      on.push(item);
                    }
                  });
                  const off = [];
                  data.map((v) => {
                    if (v.waterMarkType === ENUM_WMT.delWaterMark) {
                      const item = {
                        realityHeight: v.realityHeight,
                        realityLeft: v.realityLeft,
                        realityTop: v.realityTop,
                        realityWidth: v.realityWidth,
                        opacity: v.opacity,
                        startTime: v.startTime,
                        endTime: v.endTime,
                      };
                      off.push(item);
                    }
                  });

                  const waterMarkJsonInfo = {};
                  if (on.length && sureBtn) {
                    waterMarkJsonInfo.on = on;
                  }
                  if (off.length && sureBtn) {
                    waterMarkJsonInfo.off = off;
                  }
                  const params = {
                    id: row.id,
                    preId: row.preId,
                    type: "99",
                    workRounds: 1,
                    createUserId: row.createUserId,
                    waterMarkJsonInfo: JSON.stringify(waterMarkJsonInfo),
                  };

                  const submit = (params) => {
                    return examineFirstReview(params).then(() => {
                      this.visible = false;
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.$message.success("处理成功");
                      this.getList();
                      return Promise.resolve();
                    });
                  };
                  debounceCallBack(submit, 500)(params);
                },
              };
            }
            if (tagname === "btnReject") {
              const params = {
                id: row.id,
                preId: row.preId,
                type: ENUM_AuditOpra.reject,
                workRounds: 1,
                createUserId: row.createUserId,
                refuseReason: "水印处理失败",
                refuseCode: "CONVERT_WATERMARK_FAIL",
              };
              this.$confirm("水印处理失败，是否驳回?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  examineFirstReview(params).then(() => {
                    this.visible = false;
                    this.$message.success("驳回成功");
                    this.getList();
                  });
                })
                .catch(() => {});
            }
            if (tagname === "btnPriority") {
              this.priorityVisible = true;
              this.priorityData = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.priorityVisible = false;
                },
              };
            }
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
    this.getList();
    this.getClassify();
  },

  methods: {
    getClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
        if (v.prop === "classifyIdWeb") {
          v.options = this.adminTag;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        videoLengthDTOList: this.selectedTimeLength,
        workRounds: 1,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.sourceOpt && this.searchData.sourceOpt.length) {
        params.channelName = this.searchData.sourceOpt[0];
        params.channelSource = this.searchData.sourceOpt[1];
      }
      this.loading = true;
      getData(params)
        .then((res) => {
          this.loading = false;
          const { data } = res;
          const list = data.data.records || [];
          list.forEach((v) => ((v.on = []), (v.off = []), (v.visible = false)));
          this.tableData = list;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
