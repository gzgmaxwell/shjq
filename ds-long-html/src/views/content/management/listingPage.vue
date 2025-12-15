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
      :tableEvents="tableEvents"
      :isIndex="false"
      :isSelection="true"
    >
      <template #content="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList.slice(0, 2)"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
        <el-dropdown v-if="row.btnList.length > 2">
          <span class="el-dropdown-link ml5 link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="item.callback({ row, index })"
              v-for="item in row.btnList.slice(2)"
              :class="item.class"
              :key="item.name"
              >{{ item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
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
      <template #resolution="{ row }">
        <div>
          <el-tooltip
            :content="(row.resolutionList || []).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template v-for="(item, index) in row.resolutionList">
                <el-tag :key="index" style="margin: 2px">{{ item }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
    <el-dialog
      title="下架原因"
      :visible.sync="rejectVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <commReject
        v-if="rejectVisible"
        :row="row"
        :pageInfo="{ isOutHandle: true, reason: '下架原因' }"
      />
    </el-dialog>
    <el-dialog
      title="添加节点"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="960px"
      height="400px"
    >
      <chapterSimple v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog
      title="编辑"
      width="50%"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
    >
      <commVideoEdit
        v-if="editVisible"
        :row="row"
        :webPageMenu="pageFrom"
        :API_URL="true"
      />
    </el-dialog>
    <el-dialog
      title="分辨率"
      :visible.sync="resolutionVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <resoluProgress v-if="resolutionVisible" :row="row" />
    </el-dialog>
    <el-dialog
      title="标签管理"
      :visible.sync="tagVisible"
      width="35%"
      :close-on-click-modal="false"
    >
      <tagEdit v-if="tagVisible" :row="row" />
    </el-dialog>
    <!--  4.4.9去除评分   <el-dialog
      title="评分"
      :visible.sync="scoreVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <comMakeScore v-if="scoreVisible" :row="row" />
    </el-dialog> -->
    <el-dialog
      title="免费时长"
      :visible.sync="freeVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <freeTime v-if="freeVisible" :row="row" />
    </el-dialog>
    <!--  4.4.8需求隐藏   <el-dialog
      title="观看权限"
      :visible.sync="watchVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <watchAuth v-if="watchVisible" :row="row" />
    </el-dialog> -->
    <el-dialog
      title="修改价格"
      :visible.sync="priceVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <editPrice v-if="priceVisible" :row="row" />
    </el-dialog>
  </div>
</template>
<script>
import commVideoEdit from "@/views/common/commVideo/commVideoEdit.vue";
import commReject from "@/views/common/commVideo/commReject.vue";
// import comMakeScore from "@/views/common/commVideo/comMakeScore.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import chapter from "@/components/chapter/index.vue";
import chapterSimple from "@/components/chapterSimple/index.vue";
import resoluProgress from "./component/resoluProgress.vue";
import tagEdit from "@/views/content/management/component/tagEdit.vue";
import freeTime from "./component/freeTime.vue";
// import watchAuth from "./component/watchAuth.vue";
import {
  showTag,
  resetSearchData,
  ENUM_VIDEO_STATUS,
  videoUnmountStatus,
  menuEnum,
  formatDurationToTime,
  optionsTimeType,
  videoLength,
  channelEnum,
  optionsChannelSource,
  optionWatchPermission,
  debounceCallBack,
  enum_resolution,
  filterNullSearchData,
  ENUM_WATCH_PERMISSION,
  optionsResolution,
  optVideoStyle,
  videoViolation,
  enum_paidVideo,
  optPaidVideo,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
import {
  videotab,
  downfrom,
  failureBatch,
  deleteBatch,
  freeWatchTimeBatch,
  fundamental,
  chapterSave,
  chapterDetails,
} from "@/api/content/management";
import { getAllVideoGatherChannelList, sourceList } from "@/api/content/index";
import { updateBatchPrice } from "@/api/admin/index";
import { batchUpdateByVideoIds } from "@/api/video-manage/index";
import editPrice from "@/views/common/editPrice/index.vue";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  props: {
    failure: {
      type: Boolean,
      default: false,
      required: true,
    },
    webPageMenu: {
      type: String,
      required: false,
      default: () => {
        return "";
      },
    },
  },
  components: {
    tableSearch,
    search,
    commReject,
    commVideoEdit,
    chapter,
    chapterSimple,
    resoluProgress,
    tagEdit,
    editPrice,
    freeTime,
    // watchAuth,
  },
  data() {
    return {
      isShowTooltip: false,
      shouldShowEllipsis: false,
      tagVisible: false,
      freeVisible: false,
      // watchVisible: false,
      selectionData: [],
      watchData: [],
      loading: false,
      rejectVisible: false,
      visible: false,
      editVisible: false,
      resolutionVisible: false,
      priceVisible: false,
      row: {},
      pageFrom: menuEnum.cmsVideoManage,
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
          type: "select",
          prop: "channel",
          styleWidth: "150",
          options: optionsChannelSource,
          placeholder: "视频来源",
          clearable: true,
          show: () => this.isManagement(),
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
          // show: () => this.isManagement(),
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

        /*    4.4.9去除评分     {
          label: "评分范围",
          type: "input",
          prop: "minScore",
          placeholder: "起始分数1.0",
          clearable: true,
        },
        {
          type: "input",
          prop: "maxScore",
          placeholder: "结束分数10.0",
          clearable: true,
        }, */
        {
          styleWidth: "180",
          type: "select",
          prop: "watchLevel",
          options: [],
          placeholder: "观看权限",
          clearable: true,
        },
        {
          type: "select",
          prop: "resolutionList",
          placeholder: "分辨率",
          options: optionsResolution,
          styleWidth: "130",
          clearable: true,
          multiple: true,
        },
        {
          type: "input",
          prop: "thirdUserName",
          placeholder: "三方作者",
          clearable: true,
          show: () => this.isManagement(),
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
          type: "datetimerange",
          label: this.failure ? "上传时间" : "",
          styleWidth: "150",
          prop: "dateTime",
          show: () => this.failure,
        },
        {
          type: "datetimerange",
          label: !this.failure ? "上架时间" : "",
          prop: "listingDateTime",
          show: () => !this.failure,
        },
        {
          type: "cascader",
          prop: "sourceOpt",
          styleWidth: "150",
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
          show: () => this.isManagement(),
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
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        channel: "",
        watchLevel: "",
        classifyId: "",
        classifyIdWeb: "",
        // minScore: "",
        // maxScore: "",
        thirdUserName: "",
        weightScoreLowerLimit: "",
        weightScoreUpperLimit: "",
        paidVideo: "",
        dateTime: [
          moment(new Date().setDate(new Date().getDate() - 7)).format(
            "YYYY-MM-DD"
          ) + " 00:00:00",
          moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
        ],
        tiemData: [],
        listingDateTime: [
          moment(new Date().setDate(new Date().getDate() - 7)).format(
            "YYYY-MM-DD"
          ) + " 00:00:00",
          moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
        ],
        sourceOpt: [],
        resolutionList: [],
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
            this.searchData.listingDateTime = [
              moment(new Date().setDate(new Date().getDate() - 7)).format(
                "YYYY-MM-DD"
              ) + " 00:00:00",
              moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
            ];
            this.searchData.dateTime = [
              moment(new Date().setDate(new Date().getDate() - 7)).format(
                "YYYY-MM-DD"
              ) + " 00:00:00",
              moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
            ];
            this.searchData.failure = ENUM_VIDEO_STATUS.normal;
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          label: this.failure ? "批量上架" : "批量下架",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            if (this.failure && !this.isManagement()) {
              return this.selectionData.some(
                (v) => !v.createUserId || !v.classifyId
              );
            }
            return false;
          },
          callback: this.batchRemoval,
          auth: () => {
            if (this.isManagement()) {
              return this.failure
                ? this.permissions.sys_content_online_on
                : this.permissions.sys_content_online_off;
            }
            return this.failure
              ? this.permissions.sys_content_rentvideo_on
              : this.permissions.sys_content_rentvideo_off;
          },
        },
        {
          label: "批量删除",
          type: "danger",
          disabled: () => this.selectionData.length === 0,
          callback: this.batchDelete,
          auth: () => {
            if (this.isManagement()) {
              return this.failure && this.permissions.sys_content_online_del;
            }
            return this.failure && this.permissions.sys_content_rentvideo_del;
          },
        },
        {
          label: "标签管理",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            if (!this.isManagement()) return false;
            return this.selectionData.some((item) => {
              return item.channel === channelEnum.APP;
            });
          },
          callback: () => {
            const idsArr = this.selectionData.map((item) => item.id);
            this.tagVisible = true;
            this.row = {
              idsArr,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.tagVisible = false;
              },
            };
          },
        },
        {
          label: "免费时长",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            if (this.isManagement()) {
              // 紧b端视频，且为收费和会员视频可点击
              const isB = this.selectionData.every(
                (v) =>
                  v.channel === channelEnum.BK ||
                  v.channel === channelEnum.THIRD
              );
              const isCharge = this.selectionData.every(
                (v) =>
                  v.watchLevel === ENUM_WATCH_PERMISSION.charge ||
                  v.watchLevel === ENUM_WATCH_PERMISSION.svip
              );
              if (isB && isCharge) {
                return false;
              }
              return true;
            }
            if (!this.isManagement()) {
              // 应该仅会员、付费视频才可点击免费时长按钮
              const isCharge = this.selectionData.every(
                (v) =>
                  v.watchLevel === ENUM_WATCH_PERMISSION.charge ||
                  v.watchLevel === ENUM_WATCH_PERMISSION.svip
              );
              if (isCharge) {
                return false;
              }
              return true;
            }
          },
          callback: () => {
            this.freeVisible = true;
            this.row = {
              callback: (data) => {
                if (!data) {
                  return (this.freeVisible = false);
                }
                const params = {
                  freeViewRatio: data.freeViewRatio,
                  preIds: this.selectionData.map((v) => v.preId),
                };
                freeWatchTimeBatch(params).then((res) => {
                  this.freeVisible = false;
                  this.getList();
                });
              },
            };
          },
        },
        /*   4.4.8需求隐藏      {
          label: "观看权限",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            if (!this.isManagement()) return false;
            return this.selectionData.some(
              (v) => v.channel === channelEnum.APP
            );
          },
          callback: () => {
            this.watchVisible = true;
            this.row = {
              callback: (data) => {
                if (!data) {
                  return (this.watchVisible = false);
                }
                const params = {
                  price: data.price,
                  substanceIds: this.selectionData.map((v) => v.id),
                  watchLevel: data.watchLevel,
                };
                freeWatchTimeBatch(params).then((res) => {
                  this.watchVisible = false;
                  this.getList();
                });
              },
            };
          },
        }, */
        {
          label: "修改作者",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) return true;
            if (!this.isManagement()) return false;
            return this.selectionData.some(
              (v) => v.channel === channelEnum.APP
            );
          },
          callback: () => {
            this.$modalPatchAuthors({
              callback: ({ form, handleClose }) => {
                batchUpdateByVideoIds({
                  onlineIds: this.selectionData.map((v) => v.id),
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
        {
          label: "修改价格",
          type: "primary",
          disabled: () => {
            if (!this.selectionData.length) {
              return true;
            }
            return this.selectionData.some(
              (v) => v.paidVideo !== enum_paidVideo.yes
            );
          },
          callback: () => {
            this.priceVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  updateBatchPrice({
                    videoIds: this.selectionData.map((v) => v.id),
                    price: data,
                  }).then(() => {
                    this.$message.success("批量修改价格成功");
                    this.priceVisible = false;
                    this.getList();
                  });
                }
                this.priceVisible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "videoTitle",
          label: "视频信息",
          type: "videoPlay",
          width: "100",
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
          label: "三方作者",
          prop: "thirdUserName",
          show: () => this.isManagement(),
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
          // show: () => this.isManagement(),
        },
        {
          label: "分辨率",
          type: "slot",
          slotName: "resolution",
          width: "180",
        },
        {
          label: "视频来源",
          width: "70",
          type: "filter",
          filter: (row) => {
            const item = optionsChannelSource.find((v) => v.id === row.channel);
            return item?.name;
          },
          show: () => this.isManagement(),
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
          label: "用户评分",
          width: "70",
          prop: "userOverallScoring",
        },
        {
          label: "权重分值",
          prop: "weightScore",
        },
        {
          prop: "watchLevel",
          width: "70",
          label: "观看权限",
          type: "html",
          html: (row) => {
            const data = optionWatchPermission.find(
              (v) => v.id === row.watchLevel
            );
            if (row.paidVideo === enum_paidVideo.yes) {
              return `<span>/</span>`;
            } else {
              return `<span>${data?.name || "/"}</span>`;
            }
          },
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
          prop: "createTime",
          width: "140",
          label: "上传时间",
          // show: () => this.isManagement(),
        },
        {
          prop: "postTime",
          width: "140",
          label: "上架时间",
          // show: () => this.isManagement(),
        },
        {
          prop: "failure",
          width: "70",
          label: "视频状态",
          type: "html",
          html: (row) => {
            const item = videoUnmountStatus.find((v) => v.id === row.failure);
            const className =
              row.failure == ENUM_VIDEO_STATUS.delist ? "must" : "";
            return `<span class="${className}">${item?.name}</span>`;
          },
          show: () => this.isManagement(),
        },
        {
          label: "渠道来源",
          type: "filter",
          filter: (row) => {
            return `${row.channelName ? row.channelName : ""}/${
              row.channelSource ? row.channelSource : ""
            }`;
          },
          show: () => this.isManagement(),
        },
        {
          label: "操作",
          type: "slot",
          fixed: "right",
          slotName: "content",
          width: "150",
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
      levelData: "levelData",
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
    isManagement() {
      return () => {
        if (!this.webPageMenu) {
          return true;
        } else {
          return false;
        }
      };
    },
  },
  mounted() {
    this.getList();
    this.categoryList();
    this.getWatchLevel();
    if (this.webPageMenu) {
      this.pageFrom = this.webPageMenu;
    }
  },

  methods: {
    categoryList() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
        if (v.prop === "classifyIdWeb") {
          v.options = this.adminTag;
        }
      });
    },
    getWatchLevel() {
      this.searchForm.forEach((v) => {
        if (v.type === "select" && v.prop === "watchLevel") {
          v.options = optionWatchPermission.map((v) => {
            return {
              name: v.name,
              id: v.id,
            };
          });
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData({
          ...this.searchData,
          videoLengthDTOList: this.selectedTimeLength,
        }),
        failure: this.failure,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (
        this.failure &&
        this.searchData.dateTime &&
        this.searchData.dateTime.length > 0
      ) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      if (
        !this.failure &&
        this.searchData.listingDateTime &&
        this.searchData.listingDateTime.length > 0
      ) {
        params.postStartTime = this.searchData.listingDateTime[0];
        params.postEndTime = this.searchData.listingDateTime[1];
      }
      if (this.searchData.sourceOpt && this.searchData.sourceOpt.length) {
        params.channelName = this.searchData.sourceOpt[0];
        params.channelSource = this.searchData.sourceOpt[1];
      }
      this.loading = true;
      videotab(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.page.records.map((v) => {
          v.visible = false;
          v.coverUrl = v?.coverFileUrl;
          v.topicVoList = v?.labelDtoList;
          v.partList = [];
          v.btnList = this.getBtnList(v);
          return v;
        });
        this.tablePage.total = data.data.page.total;
        if (this.failure) {
          this.$emit("getDelistTotal", data.data.page.total);
        } else {
          this.$emit("getListingTotal", data.data.page.total);
        }
      });
    },
    getBtnList(row) {
      const btnList = [];
      const btn_on =
        (this.isManagement() && this.permissions.sys_content_online_on) ||
        (!this.isManagement() && this.permissions.sys_content_rentvideo_on);
      if (this.failure && btn_on) {
        btnList.push({
          name: "上架",
          class: "comBtn link",
          callback: () => {
            if (
              (!this.isManagement() && !row.createUserId) ||
              !row.classifyId
            ) {
              this.$confirm("视频信息未编辑完整，请补充后在上架?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                this.editVisible = true;
                this.row = {
                  ...row,
                  callback: (data) => {
                    if (!data) {
                      this.editVisible = false;
                      return;
                    }

                    const debounceAPI = () => {
                      return fundamental(data).then(() => {
                        this.$message.success("保存成功");
                        this.editVisible = false;
                        this.getList();
                        Promise.resolve();
                      });
                    };
                    debounceCallBack(debounceAPI)();
                  },
                };
              });
            } else {
              const comSubmit = () => {
                return downfrom({
                  ...row,
                  failure: false,
                }).then(() => {
                  const newCurrent = pageHandle(
                    this.tablePage.current,
                    this.tablePage.size,
                    this.tablePage.total
                  );
                  this.tablePage.current = newCurrent;
                  this.getList();
                  this.$message.success("上架成功");
                  Promise.resolve();
                });
              };
              debounceCallBack(comSubmit)();
            }
          },
        });
      }

      const btn_off =
        (this.isManagement() && this.permissions.sys_content_online_off) ||
        (!this.isManagement() && this.permissions.sys_content_rentvideo_off);
      if (!this.failure && btn_off) {
        btnList.push({
          name: "下架",
          class: "comBtn danger",
          callback: () => {
            this.rejectVisible = true;
            this.row = {
              ...row,
              callback: ({ refuseReason }) => {
                downfrom({
                  ...row,
                  failure: true,
                  refuseReason: refuseReason,
                }).then(() => {
                  const newCurrent = pageHandle(
                    this.tablePage.current,
                    this.tablePage.size,
                    this.tablePage.total
                  );
                  this.tablePage.current = newCurrent;
                  this.getList();
                  this.rejectVisible = false;
                  this.$message.success("下架成功");
                });
              },
            };
          },
        });
      }

      const btn_details =
        (this.isManagement() && this.permissions.sys_content_online_details) ||
        (!this.isManagement() &&
          this.permissions.sys_content_rentvideo_details);
      if (btn_details) {
        btnList.push({
          name: "详情",
          class: "comBtn link",
          callback: () => {
            this.$router.push({
              path: "/content/management/details",
              query: {
                watchLevel: row.watchLevel,
                createUserStatus: row.createUserStatus,
                id: row.id,
                preId: row.preId,
                createUserId: row.createUserId,
                createUserName: row.createUserName,
                webPageMenu: this.webPageMenu,
                channel: row.channel,
              },
            });
          },
        });
      }

      if (
        row.videoConvertStatus !== enum_resolution.VIDEO_CONVERT_SUCCESS &&
        this.isManagement()
      ) {
        btnList.push({
          name: "分辨率",
          class: "comBtn link",
          callback: () => {
            this.row = {
              ...row,
              callback: () => {
                this.resolutionVisible = false;
                this.getList();
              },
            };
            this.resolutionVisible = true;
          },
        });
      }

      const btn_chapter =
        (this.isManagement() &&
          this.permissions.sys_content_online_chapter &&
          (row.channel == channelEnum.BK ||
            row.channel == channelEnum.THIRD)) ||
        (!this.isManagement() &&
          this.permissions.sys_content_rentvideo_chapter);
      if (btn_chapter) {
        btnList.push({
          name: "添加节点",
          class: "comBtn link",
          callback: () => {
            chapterDetails(row.preId).then((res) => {
              const chapterDetailViewDTOList = res.data?.data;
              this.row = {
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
                    this.visible = false;
                    this.getList();
                  });
                },
              };
              this.visible = true;
            });
          },
        });
      }

      const btn_edit =
        (this.isManagement() &&
          this.permissions.sys_content_online_edit &&
          row.channel !== channelEnum.APP) ||
        (!this.isManagement() && this.permissions.sys_content_rentvideo_edit);
      if (btn_edit) {
        btnList.push({
          name: "编辑",
          class: "comBtn link",
          callback: () => {
            this.editVisible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (!data) {
                  this.editVisible = false;
                  return;
                }

                const debounceAPI = () => {
                  return fundamental(data).then(() => {
                    this.$message.success("保存成功");
                    this.editVisible = false;
                    this.getList();
                    Promise.resolve();
                  });
                };
                debounceCallBack(debounceAPI)();
              },
            };
          },
        });
      }

      /*   4.4.9去除评分    const btn_score =
        (this.isManagement() && this.permissions.sys_content_online_score) ||
        (!this.isManagement() && this.permissions.sys_content_rentvideo_score);
      if (btn_score) {
        btnList.push({
          name: "评分",
          class: "comBtn link",
          callback: () => {
            this.row = {
              ...row,
              callback: (data) => {
                if (!data) {
                  return (this.scoreVisible = false);
                }
                substanceVideoScore({
                  onlineId: row.id,
                  videoScore: data.amountYuan,
                  preId: row.preId,
                }).then(() => {
                  this.scoreVisible = false;
                  this.getList();
                  this.$message.success("评分成功");
                });
              },
            };
            this.scoreVisible = true;
          },
        });
      } */
      return btnList;
    },
    batchRemoval() {
      let num = this.selectionData.length;
      const data = this.selectionData.map((item) => item.id);
      if (!this.failure) {
        this.rejectVisible = true;
        this.row = {
          num,
          callback: ({ refuseReason }) => {
            failureBatch({
              idList: data,
              failure: true,
              refuseReason: refuseReason,
            }).then(() => {
              if (this.tableData.length && this.tablePage.current > 1) {
                this.tablePage.current--;
              }
              this.getList();
              this.$message.success("下架成功");
              this.rejectVisible = false;
            });
          },
        };
      } else {
        let content = `确定要上架 ${num} 个视频？`;
        this.$confirm(content, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          failureBatch({
            idList: data,
            failure: false,
          }).then(() => {
            if (this.tableData.length && this.tablePage.current > 1) {
              this.tablePage.current--;
            }
            this.getList();
            this.$message.success("上架成功");
          });
        });
      }
    },
    batchDelete() {
      let num = this.selectionData.length;
      this.$confirm(`确定要删除 ${num} 个视频？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const data = this.selectionData.map((item) => item.id);
        const params = {
          idList: data,
        };
        deleteBatch(params).then(() => {
          if (this.tableData.length && this.tablePage.current > 1) {
            this.tablePage.current--;
          }
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
  },
};
</script>
