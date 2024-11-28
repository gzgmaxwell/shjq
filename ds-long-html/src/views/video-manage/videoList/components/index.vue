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
      :visible.sync="visible"
      width="50%"
      title="编辑"
      :close-on-click-modal="false"
    >
      <commVideoEdit
        v-if="visible"
        ref="commVideoEdit"
        :row="row"
        :webPageMenu="webPageMenu"
      />
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
        :webPageMenu="webPageMenu"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dissentingPoolVisible"
      width="20%"
      :close-on-click-modal="false"
    >
      <dissentingPool v-if="dissentingPoolVisible" :row="row" />
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
    <el-dialog
      title="批量修改作者"
      :close-on-click-modal="false"
      :visible.sync="authorsVisible"
      width="20%"
    >
      <comAuthorsEdit v-if="authorsVisible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import { getAllVideoGatherChannelList, sourceList } from "@/api/content/index";
import { classifyDefault, batchDeletePreVideo } from "@/api/admin/index";
import { mapGetters } from "vuex";
import pagination from "@/components/bas-pagination/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import commVideoEdit from "@/views/common/commVideo/commVideoEdit.vue";
import commVideoCheck from "@/views/common/commVideo/commVideoCheck.vue";
import comAuthorsEdit from "@/views/common/commVideo/comAuthorsEdit.vue";
import dissentingPool from "@/views/video-manage/videoList/components/dissentingPool.vue";
import chapterSimple from "@/components/chapterSimple/index.vue";
import {
  substancePreVideoPage,
  substancePreDel,
  batchUpdateByVideoIds,
} from "@/api/video-manage/index";

import { chapterSave, chapterDetails } from "@/api/content/management";

import {
  videoLength,
  formatDurationToTime,
  checkOption,
  enum_status,
  optionsTimeType,
  optionsResolution,
  channelEnum,
  menuEnum,
  resetSearchData,
  showTag,
  optVideoStyle,
  optSliceLevel,
  videoViolation,
  filterNullSearchData,
  enum_paidVideo,
  optPaidVideo,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    commVideoEdit,
    commVideoCheck,
    dissentingPool,
    chapterSimple,
    comAuthorsEdit,
  },
  props: {
    webPageMenu: {
      type: String,
      default: "BK_VIDEO_LIST",
    },
    params: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
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
      visibleChapter: false,
      authorsVisible: false,
      row: {},
      rowChapter: {},
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
          styleWidth: "130",
          type: "select",
          prop: "type",
          options: [],
          placeholder: "请选择状态",
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
        {
          type: "select",
          prop: "paidVideo",
          placeholder: "是否收费",
          options: optPaidVideo,
          styleWidth: "120",
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
          show: () => this.webPageMenu === menuEnum.triateralVideoList,
        },
        {
          type: "input",
          prop: "thirdUserName",
          placeholder: "三方作者",
          clearable: true,
          show: () => this.webPageMenu === menuEnum.triateralVideoList,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        classifyId: "",
        type: "",
        thirdUserName: "",
        dateTime: [],
        tiemData: [],
        videoResolutionList: [],
        sourceOpt: [],
        classifyIdWeb: "",
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
          label: "移入异议池",
          type: "primary",
          disabled: () => {
            const arr = [
              enum_status.draft,
              enum_status.reject_by_info,
              enum_status.reject_by_watermark,
              enum_status.wait_submit,
            ];
            let isBk = false;
            this.selectionData.forEach((item) => {
              if (!arr.includes(item.type)) {
                isBk = true;
              }
            });
            return !this.selectionData.length || isBk;
          },
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
          auth: () => this.webPageMenu === menuEnum.triateralVideoList,
        },
        {
          label: "批量删除",
          type: "danger",
          disabled: () => {
            if (!this.selectionData.length) {
              return true;
            }
            return this.selectionData.some((v) => v.type !== enum_status.draft);
          },
          callback: () => {
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const data = this.selectionData.map((item) => item.preId);
                const params = {
                  ids: data,
                };
                batchDeletePreVideo(params).then(() => {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.$message.success("删除成功");
                  this.getList();
                });
              })
              .catch(() => {});
          },
          auth: () =>
            this.webPageMenu === menuEnum.triateralVideoList ||
            this.webPageMenu === menuEnum.supplyVideoList,
        },
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
          if (typeof this.params.callback === "function") {
            this.params.callback(val);
          }
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
          label: "三方作者",
          prop: "thirdUserName",
          show: () => {
            if (this.webPageMenu === menuEnum.triateralVideoList) {
              return true;
            }
            return false;
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
          label: "审核员",
          prop: "rejectUsername",
          // show: () => this.permissions.vm_vl_auditor
        },
        {
          label: "编辑员",
          prop: "editorUsername",
        },
        {
          prop: "resolution",
          label: "分辨率",
        },
        {
          label: "渠道来源",
          type: "filter",
          filter: (row) => {
            let channelName = row.channelName || "";
            let channelSource = row.channelSource || "";
            return channelSource
              ? `${channelName}/${channelSource}`
              : channelName || "/";
          },
          show: () => {
            if (this.webPageMenu === menuEnum.triateralVideoList) {
              return true;
            }
            return false;
          },
        },
        {
          label: "剪切时间",
          type: "html",
          html: (row) => {
            const adTime =
              row.adTime !== undefined && row.adTime !== null ? row.adTime : 0;
            return `<span class='clamp1'>${adTime}秒</span>`;
          },
        },
        {
          label: "切片优先级",
          width: "85",
          type: "filter",
          filter: (row) => {
            const item = optSliceLevel.find((v) => v.id === row.convertSort);
            return item?.name;
          },
        },
        {
          prop: "type",
          label: "状态",
          type: "html",
          html: (row) => {
            const item = checkOption.find((v) => v.id === row.type);
            let str = `<span>${item?.name}</span>`;
            if (row.refuseReason) {
              str += `<div class='danger'>${row?.refuseReason}</div>`;
            }
            return str;
          },
        },
        {
          label: "操作",
          type: "html",
          width: "220",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const check = `<span class='link comBtn' data-tagName="check">查看</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            const chapter = `<span class='link comBtn' data-tagName="chapter">添加节点</span>`;

            let str = "";
            if (row.channel === channelEnum.APP) {
              if (this.permissions.vm_vl_check) str += check;
              if (this.permissions.vm_vl_edit) {
                const conditonOne =
                  row.submitStatus &&
                  (row.type === enum_status.draft ||
                    row.type === enum_status.reject_by_watermark);
                const conditonTwo = enum_status.wait_submit === row.type;
                if (conditonOne || conditonTwo) {
                  str += edit;
                }
              }
              return str;
            }

            // 编辑显示
            const isEditArr = [
              enum_status.draft,
              enum_status.reject_by_info,
              enum_status.reject_by_watermark,
              enum_status.wait_submit,
            ];
            if (isEditArr.includes(row.type)) {
              if (this.permissions.vm_vl_edit && row.submitStatus) str += edit;
            }

            if (
              row.type === enum_status.draft ||
              row.type === enum_status.second_failure ||
              row.type === enum_status.first_failure ||
              row.type === enum_status.reject_by_info ||
              row.type === enum_status.reject_by_watermark ||
              row.type === enum_status.wait_submit
            ) {
              if (this.permissions.vm_vl_del) str += del;
            }
            // 查看显示
            if (this.permissions.vm_vl_check) str += check;
            // 章节
            str += chapter;
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname == "edit") {
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
              this.visible = true;
              chapterDetails(row.preId).then((res) => {
                const chapterDetailViewDTOList = res.data?.data;
                this.rowChapter = {
                  ...row,
                  partList:
                    chapterDetailViewDTOList?.chapterDetailViewDTOList || [],
                  status: chapterDetailViewDTOList?.status || "OFFLINE",
                  callback: (data) => {
                    if (!data) {
                      this.visible = false;
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
                      this.visible = false;
                      this.getList();
                    });
                  },
                };
              });
            } else if (tagname == "check") {
              this.row = {
                ...row,
                callback: () => {
                  this.checkVisible = false;
                },
              };
              this.checkVisible = true;
            } else if (tagname == "chapter") {
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
                      this.getList();
                    });
                  },
                };
              });
            } else if (tagname == "del") {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  substancePreDel(row.preId).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      return this.$message.success("删除成功");
                    }
                  });
                })
                .catch(() => {});
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
    this.getClassifyDefault();
    this.filterSearch();
    this.getClassify();
    this.getList();
  },

  methods: {
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "first") {
        const isEqual =
          JSON.stringify(this.$refs.commVideoEdit.initForm) ===
          JSON.stringify(this.$refs.commVideoEdit.form);

        if (isEqual) {
          return true;
        } else {
          return this.$confirm("当前的内容未保存，切换将放弃修改", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        }
      }
      if (oldActiveName === "second") {
        const isEqual =
          JSON.stringify(this.$refs.chapterSimple.initData) ===
          JSON.stringify(this.$refs.chapterSimple.data);

        if (isEqual) {
          return true;
        } else {
          return this.$confirm("当前的内容未保存，切换将放弃修改", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        }
      }
    },
    getClassifyDefault() {
      classifyDefault().then((res) => {
        this.optClass = res.data?.data || [];
      });
    },
    filterSearch() {
      this.searchForm.forEach((v) => {
        if (v.prop === "type") {
          const isIncludes = [
            enum_status.draft,
            enum_status.pending_first_review,
            enum_status.first_review,
            enum_status.pending_second_review,
            enum_status.first_review,
            enum_status.first_failure,
            enum_status.second_failure,
            enum_status.reject_by_info,
            enum_status.reject_by_watermark,
            enum_status.wait_submit,
          ];
          v.options = checkOption.filter((v) => isIncludes.includes(v.id));
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData({
          ...this.searchData,
        }),
        videoLengthDTOList: this.selectedTimeLength,
        webPageMenu: this.webPageMenu,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      if (this.searchData.sourceOpt && this.searchData.sourceOpt.length) {
        params.channelName = this.searchData.sourceOpt[0];
        params.channelSource = this.searchData.sourceOpt[1];
      }
      this.loading = true;
      substancePreVideoPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          data.data.records.forEach((v) => (v.visible = false));
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
          if (this.webPageMenu === menuEnum.supplyVideoList) {
            this.params.totalCallback({
              value: data.data.total,
              type: menuEnum.supplyVideoList,
            });
          }
          if (this.webPageMenu === menuEnum.triateralVideoList) {
            this.params.totalCallback({
              value: data.data.total,
              type: menuEnum.triateralVideoList,
            });
          }
          if (this.webPageMenu === menuEnum.consumerVideoList) {
            this.params.totalCallback({
              value: data.data.total,
              type: menuEnum.consumerVideoList,
            });
          }
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
