<template>
  <div>
    <div class="mb10">
      <el-button
        type="primary"
        @click="getWork(false)"
        v-if="!onlineStatus && permissions.vm_vc_start_work"
        >开始工作</el-button
      >
      <el-button type="primary" @click="getWork(false)" v-if="onlineStatus"
        >停止分配</el-button
      >
      <el-button type="primary" @click="getList()" v-if="onlineStatus"
        >刷新页面</el-button
      >
      <el-button
        @click="this.maskBack"
        type="primary"
        v-if="selectionData.length && permissions.vm_vc_mask_back"
      >
        任务回退
      </el-button>
    </div>
    <search
      v-if="onlineStatus"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      v-if="onlineStatus"
      :loading="loading"
      :tableData="tableData"
      :tableEvents="tableEvents"
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
      title="驳回原因"
      :visible.sync="visible"
      width="400px"
      :close-on-click-modal="false"
    >
      <commReject v-if="visible" :row="row" webPageMenu="violationCheck" />
    </el-dialog>
    <el-dialog
      title="查看"
      :visible.sync="checkVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <commVideoCheck
        v-if="checkVisible"
        :row="row"
        webPageMenu="violationCheck"
      />
    </el-dialog>
    <el-dialog
      title="编辑"
      :visible.sync="editVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <commVideoEdit
        v-if="editVisible"
        :row="row"
        webPageMenu="violationCheck"
      />
    </el-dialog>
    <el-dialog
      title="添加节点"
      :close-on-click-modal="false"
      :visible.sync="visibleChapter"
      width="960px"
      height="400px"
    >
      <chapterSimple v-if="visibleChapter" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import commVideoCheck from "@/views/common/commVideo/commVideoCheck.vue";
import commVideoEdit from "@/views/common/commVideo/commVideoEdit.vue";
import {
  work,
  Back,
  getData,
  substancepreEdit,
} from "@/api/video-manage/await-examine.js";
import { chapterSave, chapterDetails } from "@/api/content/management";
import { getAllVideoGatherChannelList, sourceList } from "@/api/content/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import waterMark from "@/components/water-mark";
import commReject from "@/views/common/commVideo/commReject.vue";
import chapterSimple from "@/components/chapterSimple/index.vue";

import {
  videoLength,
  optionsTimeType,
  formatDurationToTime,
  optionsChannelSource,
  debounceCallBack,
  optionsResolution,
  channelEnum,
  showTag,
  resetSearchData,
  ENUM_AuditOpra,
  optVideoStyle,
  videoViolation,
  filterNullSearchData,
  optPaidVideo,
} from "@/util/util";
import { mapGetters } from "vuex";
import {
  examineSecondReview,
  batchUpdateByVideoIds,
} from "@/api/video-manage/index.js";

export default {
  components: {
    tableSearch,
    search,
    waterMark,
    commReject,
    commVideoCheck,
    commVideoEdit,
    chapterSimple,
  },
  data() {
    return {
      optionsTimeType: optionsTimeType,
      visible: false,
      checkVisible: false,
      editVisible: false,
      visibleChapter: false,
      row: {},
      rowChapter: {},
      selectionData: [],
      loading: false,
      onlineStatus: false,
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
          type: "input",
          prop: "thirdUserName",
          placeholder: "三方作者",
          clearable: true,
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
        thirdUserName: "",
        videoResolutionList: [],
        tiemData: [],
        sourceOpt: [],
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
          auth: () => this.permissions.vm_vc_search,
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
          auth: () => this.permissions.vm_vc_reset,
        },
        {
          label: "修改作者",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) {
              return true;
            }
            return this.selectionData.some(
              (v) => v.channel === channelEnum.APP
            );
          },
          callback: () => {
            this.$modalPatchAuthors({
              callback: ({ form, handleClose }) => {
                batchUpdateByVideoIds({
                  preIds: this.selectionData.map((v) => v.preId),
                  userId: form.createUserId,
                })
                  .then(() => {
                    this.$message.success("批量修改作者成功");
                    handleClose();
                    this.getList();
                  })
                  .catch(() => {
                    this.loading = false;
                  });
              },
            });
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
        {
          label: "提交时间",
          prop: "createTime",
        },
        {
          label: "审核员",
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
          label: "操作",
          type: "html",
          width: "210",
          fixed: "right",
          html: (row) => {
            const pass = `<span data-tagName="pass" class="comBtn link">通过</span>`;
            const reject = `<span data-tagName="reject" class="comBtn danger">驳回</span>`;
            const check = `<span data-tagName="check" class="comBtn link">查看</span>`;
            const edit = `<span data-tagName="edit" class="comBtn link">编辑</span>`;
            const chapter = `<span class='link comBtn' data-tagName="chapter">添加节点</span>`;

            let str = "";
            if (this.permissions.vm_vc_pass) str += pass;
            if (this.permissions.vm_vc_reject) str += reject;
            if (this.permissions.vm_vc_check) str += check;
            if (row.channel !== channelEnum.APP) {
              str += edit;
              str += chapter;
            }
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "pass") {
              // this.scoreVisible = true;
              // this.row = {
              //   ...row,
              //   callback: (data) => {
              //     // if (!data) {
              //     //   this.scoreVisible = false;
              //     //   return;
              //     // }
              //     const params = {
              //       id: row.id,
              //       preId: row.preId,
              //       type: ENUM_AuditOpra.pass,
              //       workRounds: 2,
              //       createUserId: row.createUserId,
              //       twoScoring: data,
              //     };
              //     const debounceAPI = () => {
              //       return examineSecondReview(params).then((res) => {
              //         this.$message.success("操作成功");
              //         // this.scoreVisible = false;
              //         this.onlineStatus = res.data.data.onlineStatus;
              //         this.getList();
              //         Promise.resolve();
              //       });
              //     };
              //     debounceCallBack(debounceAPI)();
              //   },
              // };
              const params = {
                id: row.id,
                preId: row.preId,
                type: ENUM_AuditOpra.pass,
                workRounds: 2,
                createUserId: row.createUserId,
                // twoScoring: data,
              };
              const debounceAPI = () => {
                return examineSecondReview(params).then((res) => {
                  this.$message.success("操作成功");
                  // this.scoreVisible = false;
                  this.onlineStatus = res.data.data.onlineStatus;
                  this.getList();
                  Promise.resolve();
                });
              };
              debounceCallBack(debounceAPI)();
            } else if (tagname === "reject") {
              this.visible = true;
              this.row = {
                ...row,
                callback: ({
                  refuseReason,
                  content,
                  refuseCode,
                  refuseType,
                  refuseDesc,
                }) => {
                  const params = {
                    id: row.id,
                    preId: row.preId,
                    type: ENUM_AuditOpra.reject,
                    workRounds: 2,
                    createUserId: row.createUserId,
                    refuseReason: refuseReason,
                    unContent: content,
                    refuseCode: refuseCode,
                    refuseType: refuseType,
                    refuseDesc: refuseDesc,
                  };
                  examineSecondReview(params).then((res) => {
                    this.$notify.success("驳回成功");
                    this.onlineStatus = res.data.data.onlineStatus;
                    this.visible = false;
                    this.getList();
                  });
                },
              };
            } else if (tagname === "check") {
              this.checkVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  this.checkVisible = false;
                  if (data) {
                    this.getList();
                  }
                },
              };
            } else if (tagname === "edit") {
              this.editVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (!data) {
                    this.editVisible = false;
                    return;
                  }
                  substancepreEdit(data).then(() => {
                    this.editVisible = false;
                    this.getList();
                  });
                },
              };
              chapterDetails(row.preId).then((res) => {
                const chapterDetailViewDTOList = res.data?.data;
                this.rowChapter = {
                  ...row,
                  partList:
                    chapterDetailViewDTOList?.chapterDetailViewDTOList || [],
                  status: chapterDetailViewDTOList?.status || "OFFLINE",
                  callback: (data) => {
                    if (!data) {
                      this.editVisible = false;
                      return;
                    }
                    const chapterDetailList = [];
                    if (data && data.length) {
                      data.forEach((v) => {
                        const rate = 1000;
                        const item = {
                          chapterStartTime: v.startTime * rate,
                          chapterEndTime: v.endTime * rate,
                          chapterTitle: v.name,
                          imgBucketName: v.bucketName,
                          imgFileName: v.key,
                          iconFileName: v.iconFileName, // icon
                          iconBucketName: v.iconBucketName, // icon
                          iconId: v.iconId,
                        };
                        chapterDetailList.push(item);
                      });
                    }
                    const obj = {
                      chapterDetailList: chapterDetailList,
                      preId: row.preId,
                    };

                    chapterSave(obj).then(() => {
                      this.$message.success("保存成功");
                      this.editVisible = false;
                      this.getList();
                    });
                  },
                };
              });
            } else if (tagname === "chapter") {
              chapterDetails(row.preId).then((res) => {
                this.visibleChapter = true;
                const chapterDetailViewDTOList = res.data?.data;
                this.row = {
                  ...row,
                  partList:
                    chapterDetailViewDTOList?.chapterDetailViewDTOList || [],
                  status: chapterDetailViewDTOList?.status || "OFFLINE",
                  callback: (data) => {
                    if (!data) {
                      this.visibleChapter = false;
                      return;
                    }
                    const chapterDetailList = [];
                    if (data && data.length) {
                      data.forEach((v) => {
                        const rate = 1000;
                        const item = {
                          chapterStartTime: v.startTime * rate,
                          chapterEndTime: v.endTime * rate,
                          chapterTitle: v.name,
                          imgBucketName: v.bucketName,
                          imgFileName: v.key,
                          iconFileName: v.iconFileName, // icon
                          iconBucketName: v.iconBucketName, // icon
                          iconId: v.iconId,
                        };
                        chapterDetailList.push(item);
                      });
                    }
                    const obj = {
                      chapterDetailList: chapterDetailList,
                      preId: row.preId,
                    };

                    chapterSave(obj).then(() => {
                      this.$message.success("保存成功");
                      this.visibleChapter = false;
                      this.activeName = "first";
                      this.getList();
                    });
                  },
                };
              });
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
    this.getWork(true);
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
    getWork(onlyGet) {
      work({
        onlyGet: onlyGet,
      }).then((res) => {
        this.onlineStatus = res.data.data;
        if (!res.data.data) this.tableData = [];
        if (res.data.data) this.getList();
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
    maskBack() {
      if (!this.selectionData.length) {
        return this.$message.warning("请选择需要退回的任务！");
      }
      const params = this.selectionData.map((item) => {
        return item.id;
      });
      Back({ workOrderIds: params }).then(() => {
        this.getList();
      });
    },
  },
};
</script>
