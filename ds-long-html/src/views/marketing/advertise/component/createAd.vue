<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="广告标题" prop="advertTitle">
      <el-input
        placeholder="请输入标题"
        v-model="ruleForm.advertTitle"
        clearable
      >
      </el-input>
    </el-form-item>

    <el-form-item label="广告位名称" prop="locationId">
      <el-select
        v-model="ruleForm.locationId"
        @change="changeAdPos"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in optionAdPos"
          :key="item.id"
          :label="item.advertLocationName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <div v-if="isShowAdvertContent(ruleForm)">
      <div style="position: relative">
        <span class="poroverStyle">
          <el-popover
            placement="top"
            trigger="hover"
            content="用于APP展示广告文案语"
          >
            <span slot="reference" class="el-icon-question question"></span>
          </el-popover>
        </span>
        <el-form-item label="广告文案" prop="advertContent">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="ruleForm.advertContent"
            minlength="1"
            rows="3"
            maxlength="50"
            show-word-limit
          ></el-input>
          <span
            class="emojiBox"
            @click="
              () => {
                emojiVisible = true;
              }
            "
            >😣</span
          >
        </el-form-item>
      </div>
    </div>
    <el-form-item
      label="广告样式"
      prop="videoLayout"
      v-if="showVideoLayout(ruleForm)"
    >
      <el-radio-group
        v-model="ruleForm.videoLayout"
        @change="changeVideoLayout"
      >
        <el-radio
          v-for="item in optVideoRatio"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
      <!-- <div class="must" v-if="showVerScreen(ruleForm)">
        *当前为竖屏广告，为保证用户体验，仅会在短视频（竖版）内容出呈现。
      </div> -->
    </el-form-item>

    <el-form-item label="浮窗类型" v-if="isShowScreenType(ruleForm)">
      <el-radio-group v-model="ruleForm.screenType">
        <el-radio
          v-for="item in optionAdScreen"
          :label="item.id"
          :key="item.id"
          @change="changeAdScreen"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item
      label="内容"
      prop="advertFormat"
      v-if="isShowAdvertFormat(ruleForm)"
    >
      <el-radio-group
        v-model="ruleForm.advertFormat"
        @change="changeAdvertFormat"
      >
        <el-radio
          v-for="item in optionAdvertFormat"
          :disabled="advertFormatDisabled(ruleForm.locationId)"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item
      label="图片样式"
      prop="advertImageSize"
      v-if="comAdvertImageSize(ruleForm)"
    >
      <el-radio-group
        v-model="ruleForm.advertImageSize"
        @change="changeAdvertImageSize"
      >
        <el-radio
          v-for="item in optAdvertImageSize"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <div v-if="isUploadVideoImage(ruleForm)">
      <el-form-item v-if="ruleForm.advertFormat === 'VIDEO'">
        <span slot="label"><span class="must">*</span>视频上传</span>
        <upload
          v-if="is_normal_upload(ruleForm)"
          bucketType="AD"
          accept="video/*"
          @onChange="handleChangeVideo"
          :W2HRate="16 / 9"
          :maxFileSize="100"
          :limit="1"
          title="上传视频"
          :fileList="ruleForm.videoFileList"
          :isW2HRateTip="true"
          :isShowVideo="true"
        />
        <upload
          v-if="isUseVideoTimeRange(ruleForm)"
          bucketType="AD"
          accept="video/*"
          @onChange="handleChangeVideo"
          :W2HRate="0"
          :maxFileSize="videoTimeRange_maxFileSize"
          :widthHeightLimit="widthHeightLimit"
          :videoTimeRange="videoTimeRange"
          :limit="1"
          title="上传视频"
          :fileList="ruleForm.videoFileList"
          :isW2HRateTip="false"
          :isShowVideo="true"
        />
        <div v-if="is_VIDEO_INSERT_AD(ruleForm)" style="margin-top: -5px">
          {{
            isWidthThanHeight(ruleForm)
              ? "请上传宽度大于高度"
              : "请上传高度大于宽度"
          }}
          ，大小100MB内，时长在1秒-180秒内的视频文件
        </div>
        <div v-if="is_SHORT_VIDEO_FLOW(ruleForm)" style="margin-top: -5px">
          请上传1秒-300秒内的视频文件
        </div>
        <div class="mt10" v-if="isVideoCover(ruleForm)">
          <upload
            bucketType="AD"
            @onChange="handleChangeCover"
            :W2HRate="16 / 9"
            :maxFileSize="20"
            :limit="1"
            title="封面图片"
            :fileList="ruleForm.coverFileList"
            :isW2HRateTip="true"
          />
        </div>
      </el-form-item>

      <el-form-item v-if="ruleForm.advertFormat === 'PICTURE'">
        <span slot="label"
          ><span class="must">*</span
          >{{ isShowScreenType(ruleForm) ? "ICON上传" : "图片上传" }}</span
        >
        <div v-if="is_VIDEO_STOP_AD(ruleForm)">
          <upload
            bucketType="AD"
            :W2HRate="0"
            :maxFileSize="5"
            @onChange="handleChangeImg"
            :widthHeightLimit="widthHeightLimit"
            :limit="1"
            :fileList="ruleForm.imgFileList"
            :isW2HRateTip="false"
          />
          <span>
            {{
              isWidthThanHeight(ruleForm)
                ? "请上传宽度大于高度"
                : "请上传高度大于宽度"
            }}
            ，大小5MB内的图片</span
          >
        </div>
        <div v-else>
          <upload
            bucketType="AD"
            :W2HRate="W2HRateImg"
            :W2HRateOrigin="W2HRateOrigin"
            :maxFileSize="20"
            @onChange="handleChangeImg"
            :limit="1"
            :fileList="ruleForm.imgFileList"
            :isW2HRateTip="false"
          />
          <span>
            请上传<span v-if="W2HRateOrigin.width"
              >宽高比为 {{ W2HRateOrigin.width }} :
              {{ W2HRateOrigin.height }}，</span
            >大小20MB以内，格式为：png，jpg，jpeg，bmp，svg，webp，gif的文件
          </span>
        </div>
      </el-form-item>
    </div>

    <el-form-item prop="sortWeight">
      <span slot="label">
        <el-popover
          placement="top"
          trigger="hover"
          :content="computLableContent()"
        >
          <span slot="reference" class="el-icon-question question"></span>
        </el-popover>
        {{ computLable() ? " 排序权重" : "权重" }}
      </span>
      <el-input-number
        v-if="computLable()"
        placeholder="请输入权重"
        :min="1"
        :max="999"
        :step="1"
        step-strictly
        v-model="ruleForm.sortWeight"
      />
      <div class="sliderStyle" v-else>
        <el-slider
          v-model="ruleForm.sortWeight"
          show-input
          :min="1"
          :max="999"
          :step="1"
        ></el-slider>
      </div>
    </el-form-item>
    <el-form-item
      label="广告出现进度（%）"
      prop="showProgressRatio"
      v-if="isShowShowProgressRatio(ruleForm)"
    >
      <el-input-number
        placeholder="请输入进度"
        :min="computMinNum(ruleForm)"
        :max="100"
        :step="1"
        step-strictly
        v-model="ruleForm.showProgressRatio"
      />
    </el-form-item>
    <el-form-item label="跳转类型" prop="jumpType">
      <el-select v-model="ruleForm.jumpType" @change="changeJumpType">
        <el-option
          v-for="item in optJumpType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          :disabled="filterJumpType(ruleForm, item.id)"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="跳转地址" v-if="showjumpAdress(ruleForm.jumpType)">
      <el-input
        style="width: 50%"
        placeholder="请输入跳转地址"
        v-model="ruleForm.jumpAdress"
        resize="none"
      >
      </el-input>
      <linkTip
        title="活动链接有效性检查"
        width="300"
        class="ml10 fs18"
        v-if="ruleForm.jumpAdress"
        :content="`请打开下面地址检查 '${ruleForm.jumpAdress}' 是否有效`"
        checkURL="https://tool.dnspod.cn/"
      />
    </el-form-item>
    <el-form-item label="跳转地址" v-if="showPath(ruleForm.jumpType)">
      <div
        style="display: flex; align-items: center; justify-content: flex-start"
      >
        <div
          class="boxStart"
          v-if="selectRow.coverFileUrl || selectRow.gameIconUrl"
        >
          <img
            :src="selectRow.coverFileUrl || selectRow.gameIconUrl"
            width="50"
            height="40"
          />
          <div
            class="del"
            @click="
              () => {
                this.selectRow = {};
                ruleForm.jumpAdress = '';
              }
            "
          >
            删除
          </div>
        </div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addJumpType"
        ></el-button>
      </div>
    </el-form-item>

    <el-form-item label="可见人群" prop="limitCrowd">
      <el-radio-group v-model="ruleForm.limitCrowd">
        <el-radio
          v-for="item in optCrowdType"
          :label="item.id"
          :key="item.id"
          :disabled="computLimitCrowd(ruleForm.jumpType)"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item label="展示时间" prop="dateTime">
      <el-date-picker
        v-model="ruleForm.dateTime"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="广告状态" prop="status">
      <el-radio-group v-model="ruleForm.status">
        <el-radio
          v-for="item in optionComStatus"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="倒计时展示"
      prop="showExpireTime"
      v-if="isShowShowExpireTime(ruleForm.locationId)"
    >
      <el-radio-group v-model="ruleForm.showExpireTime">
        <el-radio
          v-for="item in optShowExpireTime"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">关闭</el-button>
    </el-form-item>
    <el-dialog
      title="视频跳转"
      :visible.sync="videoVisible"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
    >
      <linkVideo v-if="videoVisible" :row="rowParams" />
    </el-dialog>
    <el-dialog
      title="游戏跳转"
      :visible.sync="gameVisible"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
    >
      <linkGame v-if="gameVisible" :row="rowParams" />
    </el-dialog>
    <el-dialog
      title="广告文案表情"
      :visible.sync="emojiVisible"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
    >
      <emoji :emojiCallback="emojiCallback" />
    </el-dialog>
  </el-form>
</template>
<script>
import { addition, seat, modification } from "@/api/content/advertising";
import upload from "@/components/upload/index.vue";
import linkVideo from "./linkVideo.vue";
import linkGame from "./linkGame.vue";
import {
  optionAdType,
  EnumAdType,
  optionAdvertFormat,
  optAdvertImageSize,
  EnumAdvertImageSize,
  EnumAdvertFormat,
  optionComStatus,
  optShowExpireTime,
  EnumComTrueAndFalse,
  EnumJumpType,
  optionAdScreen,
  Enum_AD_SCREEN,
  optJumpType,
  optCrowdType,
  EnumCrowdType,
  EnumComStatus,
  EnumLocationType,
  optCallbackImme,
  optVideoRatio,
  EnumVideoRatio,
} from "@/util/util";
import linkTip from "@/components/link-tip/index.vue";
import emoji from "@/components/emoji/index.vue";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  components: {
    upload,
    linkTip,
    linkVideo,
    linkGame,
    emoji,
  },
  data() {
    return {
      emojiVisible: false,
      videoVisible: false,
      gameVisible: false,
      rowParams: {},
      selectRow: {},
      widthHeightLimit: {
        width: 10,
        height: 5,
        tip: "请上传宽大于高的文件",
      },
      videoTimeRange: {
        min: 1,
        max: 180,
      },
      videoTimeRange_maxFileSize: 100,
      W2HRateImg: 16 / 9,
      W2HRateOrigin: { width: 16, height: 9 },
      ruleForm: {
        screenType: Enum_AD_SCREEN.full_screen,
        adType: EnumAdType.BANNER,
        advertTitle: "",
        locationId: "",
        status: EnumComStatus.ON,
        jumpType: EnumJumpType.LINK,
        jumpAdress: "",
        advertFormat: EnumAdvertFormat.PICTURE,
        advertImageSize: EnumAdvertImageSize.SIZE_16_9,
        imgFileList: [],
        coverFileList: [],
        videoFileList: [],
        coverFileName: "",
        coverBucketName: "",
        videoName: "",
        videoBucketName: "",
        adFileName: "",
        adBucketName: "",
        dateTime: [],
        sortWeight: 0,
        advertContent: "",
        limitCrowd: "",
        videoLayout: EnumVideoRatio.H,
        showProgressRatio: 1,
        videoLength: undefined,
        showExpireTime: EnumComTrueAndFalse.FASLE,
      },
      optionAdPos: [],
      optionAdScreen: optionAdScreen,
      optionAdType: optionAdType,
      optionAdvertFormat: optionAdvertFormat,
      optionComStatus: optionComStatus,
      optShowExpireTime: optShowExpireTime,
      optJumpType: optJumpType,
      optCrowdType: optCrowdType,
      optAdvertImageSize: optAdvertImageSize,
      optCallbackImme: optCallbackImme,
      optVideoRatio: optVideoRatio,
      rules: {
        sortWeight: [{ required: true, message: "权重", trigger: "blur" }],
        advertFormat: [
          {
            required: true,
            message: "请选择广告格式",
            trigger: "change",
          },
        ],
        advertImageSize: [
          {
            required: true,
            message: "请选择图片样式",
            trigger: "change",
          },
        ],
        showProgressRatio: [
          { required: true, message: "广告出现进度", trigger: "blur" },
        ],
        advertTitle: [
          { required: true, message: "广告标题不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        dateTime: [{ required: true, message: "选择日期", trigger: "change" }],
        advertContent: [
          { required: true, message: "广告文案不能为空", trigger: "blur" },
        ],
        locationId: [
          { required: true, message: "请选择广告位名称", trigger: "change" },
        ],
        videoLayout: [
          { required: true, message: "请选择广告样式", trigger: "change" },
        ],
        status: [
          {
            required: true,
            message: "广告状态",
            trigger: "change",
          },
        ],
        showExpireTime: [
          {
            required: true,
            message: "倒计时展示",
            trigger: "change",
          },
        ],
        jumptype: [
          {
            required: true,
            message: "跳转类型",
            trigger: "change",
          },
        ],
        limitCrowd: [
          {
            required: true,
            message: "选择人群范围",
            trigger: "blur",
          },
        ],
        jumpAdress: [
          { required: true, message: "跳转地址", trigger: "blur" },
          {
            min: 2,
            max: 500,
            message: "长度在 2 到 500 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    advertFormatDisabled() {
      return (data) => {
        const isDisabledVideo = [
          EnumAdType.APP_LAUNCH_PAGE,
          EnumAdType.VIDEO_DETAIL_AUTHOR_DESC,
          EnumAdType.EVENT_PAGE_VIDEO,
          EnumAdType.EVENT_PAGE_COLLECT,
          EnumAdType.VIDEO_INSERT_AD,
          EnumAdType.INDEX_PAGE_POP_UPS,
          EnumAdType.CHANNEL_PAGE_POP_UPS,
          EnumAdType.GAME_PAGE_POP_UPS,
          EnumAdType.MINE_PAGE_POP_UPS,
          EnumAdType.MSG_PAGE_POP_UPS,
          EnumAdType.WEAK_NETWORK_AD,
          EnumAdType.INDEX_PAGE_FLOAT_UPS,
          EnumAdType.GAME_PAGE_FLOAT_UPS,
          EnumAdType.CHANNEL_PAGE_FLOAT_UPS,
          EnumAdType.MSG_PAGE_FLOAT_UPS,
          EnumAdType.MINE_PAGE_FLOAT_UPS,
        ];
        const isNoDisabled = [
          EnumAdType.VIDEO_DETAIL_PAGE,
          EnumAdType.SHORT_VIDEO_FLOW,
        ];
        if (!this.optionAdPos.length) {
          return false;
        }
        const item = this.optionAdPos.find((v) => v.id === data);
        if (!data) return;

        if (isNoDisabled.includes(item?.fixLocation)) {
          return false;
        }

        if (isDisabledVideo.includes(item?.fixLocation)) {
          return true;
        }

        if (item?.location === EnumAdType.VIDEO_FLOW) {
          return true;
        }

        return false;
      };
    },
    filterJumpType() {
      return (ruleForm, jumpType) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (item?.fixLocation === EnumAdType.APP_LAUNCH_PAGE) {
          const arr = [EnumJumpType.NO_JUMP, EnumJumpType.LINK];
          if (!arr.includes(jumpType)) {
            return true;
          }
        }
        if (item?.fixLocation === EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW) {
          if (ruleForm.screenType === Enum_AD_SCREEN.half_screen) {
            const allowed = [EnumJumpType.NO_JUMP, EnumJumpType.ROUTER];
            if (!allowed.includes(jumpType)) {
              return true;
            }
          }
        }
        return false;
      };
    },
    showPath() {
      return (data) => {
        const arr = [EnumJumpType.VIDEO, EnumJumpType.GAME];
        if (arr.includes(data)) {
          return true;
        }
        return false;
      };
    },
    showjumpAdress() {
      return (data) => {
        const arr = [EnumJumpType.LINK, EnumJumpType.ROUTER];
        if (arr.includes(data)) {
          return true;
        }
        return false;
      };
    },
    isShowShowExpireTime() {
      return (locationId) => {
        const isShow = [
          EnumAdType.INDEX_PAGE_POP_UPS,
          EnumAdType.CHANNEL_PAGE_POP_UPS,
          EnumAdType.MSG_PAGE_POP_UPS,
          EnumAdType.GAME_PAGE_POP_UPS,
          EnumAdType.MINE_PAGE_POP_UPS,
          EnumAdType.INDEX_PAGE_FLOAT_UPS,
          EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW,
          EnumAdType.GAME_PAGE_FLOAT_UPS,
          EnumAdType.CHANNEL_PAGE_FLOAT_UPS,
          EnumAdType.MSG_PAGE_FLOAT_UPS,
          EnumAdType.MINE_PAGE_FLOAT_UPS,
        ];
        const item = this.optionAdPos.find((v) => v.id === locationId);
        if (isShow.includes(item?.fixLocation)) {
          return true;
        }
        return false;
      };
    },
    computLable() {
      return () => {
        const item = this.optionAdPos.find(
          (v) => v.id === this.ruleForm.locationId
        );
        const arr = [
          EnumAdType.INDEX_PAGE_POP_UPS,
          EnumAdType.CHANNEL_PAGE_POP_UPS,
          EnumAdType.GAME_PAGE_POP_UPS,
          EnumAdType.MINE_PAGE_POP_UPS,
          EnumAdType.MSG_PAGE_POP_UPS,
        ];

        if (arr.includes(item?.fixLocation)) {
          return true;
        } else {
          return false;
        }
      };
    },
    computLableContent() {
      return () => {
        const item = this.optionAdPos.find(
          (v) => v.id === this.ruleForm.locationId
        );
        const arr = [
          EnumAdType.INDEX_PAGE_POP_UPS,
          EnumAdType.CHANNEL_PAGE_POP_UPS,
          EnumAdType.GAME_PAGE_POP_UPS,
          EnumAdType.MINE_PAGE_POP_UPS,
          EnumAdType.MSG_PAGE_POP_UPS,
        ];
        if (arr.includes(item?.fixLocation)) {
          return "该权重越大，该广告越优先显示";
        } else if (item?.fixLocation === EnumAdType.PORTRAIT_BOTTOM_BANNER) {
          return "APP根据权重从大到小轮播展示";
        } else {
          return "该权重越大出现几率越高";
        }
      };
    },
    computLimitCrowd() {
      return (val) => {
        if (val === EnumJumpType.BIND_MOBILE_WELFARE) {
          return true;
        }
      };
    },
    comAdvertImageSize() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.fixLocation === EnumAdType.EVENT_PAGE_VIDEO ||
          item?.fixLocation === EnumAdType.EVENT_PAGE_COLLECT
        ) {
          return true;
        }
        if (item?.locationType === EnumLocationType.RANK) {
          return true;
        }
        return false;
      };
    },

    is_SHORT_VIDEO_FLOW() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (item?.fixLocation === EnumAdType.SHORT_VIDEO_FLOW) {
          return true;
        }
        return false;
      };
    },

    isUseVideoTimeRange() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.fixLocation === EnumAdType.VIDEO_INSERT_AD ||
          item?.fixLocation === EnumAdType.SHORT_VIDEO_FLOW
        ) {
          return true;
        }
        return false;
      };
    },
    is_VIDEO_INSERT_AD() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (item?.fixLocation === EnumAdType.VIDEO_INSERT_AD) {
          return true;
        }
        return false;
      };
    },

    is_normal_upload() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.fixLocation === EnumAdType.VIDEO_INSERT_AD ||
          item?.fixLocation === EnumAdType.SHORT_VIDEO_FLOW
        ) {
          return false;
        }
        return true;
      };
    },

    isVideoCover() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.fixLocation === EnumAdType.VIDEO_INSERT_AD ||
          item?.fixLocation === EnumAdType.SHORT_VIDEO_FLOW
        ) {
          return false;
        }
        return true;
      };
    },
    isShowShowProgressRatio() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        const isShowArr = [EnumAdType.VIDEO_INSERT_AD, EnumAdType.BULLET_AD];
        if (isShowArr.includes(item?.fixLocation)) {
          return true;
        }
        return false;
      };
    },
    computMinNum() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (EnumAdType.VIDEO_INSERT_AD === item?.fixLocation) {
          return 0;
        }
        return 1;
      };
    },
    is_VIDEO_STOP_AD() {
      return (ruleForm) => {
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (item?.fixLocation === EnumAdType.VIDEO_STOP_AD) {
          return true;
        }
        return false;
      };
    },
    showVideoLayout() {
      return (ruleForm) => {
        if (!this.optionAdPos.length) return false;
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.fixLocation === EnumAdType.VIDEO_INSERT_AD ||
          item?.fixLocation === EnumAdType.VIDEO_STOP_AD
        ) {
          return true;
        }
        return false;
      };
    },
    // showVerScreen() {
    //   return (ruleForm) => {
    //     const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
    //     if (
    //       (item?.fixLocation === EnumAdType.VIDEO_INSERT_AD ||
    //         item?.fixLocation === EnumAdType.VIDEO_STOP_AD) &&
    //       ruleForm.videoLayout === EnumVideoRatio.V
    //     ) {
    //       return true;
    //     }
    //     return false;
    //   };
    // },

    isWidthThanHeight() {
      return (ruleForm) => {
        return ruleForm.videoLayout === EnumVideoRatio.H;
      };
    },
    isUploadVideoImage() {
      return (ruleForm) => {
        if (!this.optionAdPos.length) return false;
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.fixLocation === EnumAdType.BULLET_AD ||
          item?.fixLocation === EnumAdType.PORTRAIT_BOTTOM_BANNER ||
          item?.fixLocation === EnumAdType.FIRST_PAGE
        ) {
          return false;
        }
        return true;
      };
    },
    isShowAdvertContent() {
      return (ruleForm) => {
        if (!this.optionAdPos.length) return false;
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.location === EnumAdType.BOTTOM_BANNER ||
          item?.fixLocation === EnumAdType.BULLET_AD ||
          item?.fixLocation === EnumAdType.SHORT_VIDEO_FLOW
        ) {
          return true;
        }
        return false;
      };
    },
    isShowScreenType() {
      return (ruleForm) => {
        if (!this.optionAdPos.length) return false;
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (item?.fixLocation === EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW) {
          return true;
        }
        return false;
      };
    },
    isShowAdvertFormat() {
      return (ruleForm) => {
        if (!this.optionAdPos.length) return false;
        const item = this.optionAdPos.find((v) => v.id === ruleForm.locationId);
        if (
          item?.fixLocation === EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW ||
          item?.fixLocation === EnumAdType.PORTRAIT_BOTTOM_BANNER ||
          item?.fixLocation === EnumAdType.FIRST_PAGE ||
          item?.fixLocation === EnumAdType.BULLET_AD
        ) {
          return false;
        }
        return true;
      };
    },
  },
  mounted() {
    this.adLocation();
  },

  methods: {
    emojiCallback(emoji) {
      const maxLength = 50;
      if (this.ruleForm.advertContent.length >= maxLength - 1) {
        this.$message.warning("广告文案不能超过50个字符");
        this.emojiVisible = false;
        return;
      }
      this.ruleForm.advertContent = this.ruleForm.advertContent + emoji;
      this.emojiVisible = false;
    },
    changeVideoLayout(val) {
      this.initLocationId();
      this.ruleForm.videoFileList = [];
      if (val === EnumVideoRatio.H) {
        this.widthHeightLimit.width = 10;
        this.widthHeightLimit.height = 5;
        this.widthHeightLimit.tip = "请上传宽大于高的文件";
      } else if (val === EnumVideoRatio.V) {
        this.widthHeightLimit.width = 5;
        this.widthHeightLimit.height = 10;
        this.widthHeightLimit.tip = "请上传高大于宽的文件";
      }
    },
    changeJumpType(val) {
      this.selectRow = {};
      this.ruleForm.jumpAdress = "";
      this.ruleForm.limitCrowd = "";
      if (val === EnumJumpType.BIND_MOBILE_WELFARE) {
        this.ruleForm.limitCrowd = EnumCrowdType.NOT_BIND_MOBILE_USER;
      }
    },
    addJumpType() {
      this.rowParams = {
        callback: (data) => {
          if (data) {
            if (data.from === "video") {
              this.selectRow = data;
              this.ruleForm.jumpAdress = data.id;
            }
            if (data.from === "game") {
              this.selectRow = data;
              this.ruleForm.jumpAdress = data.id;
            }
          }
          this.gameVisible = false;
          this.videoVisible = false;
        },
      };
      if (this.ruleForm.jumpType === EnumJumpType.VIDEO) {
        this.videoVisible = true;
      }
      if (this.ruleForm.jumpType === EnumJumpType.GAME) {
        this.gameVisible = true;
      }
    },
    changeAdScreen(val) {
      if (val === Enum_AD_SCREEN.half_screen) {
        this.ruleForm.jumpType = EnumJumpType.ROUTER;
      }
    },
    changeAdPos(val, isGetInfoFun) {
      if (!this.optionAdPos.length) return;
      const item = this.optionAdPos.find((v) => v.id === val);
      if (item && item.location && !isGetInfoFun) {
        if (item?.fixLocation === EnumAdType.VIDEO_INSERT_AD) {
          this.ruleForm.advertFormat = EnumAdvertFormat.VIDEO;
          this.ruleForm.showProgressRatio = 0;
        } else if (EnumAdType.BULLET_AD === item?.fixLocation) {
          this.ruleForm.showProgressRatio = 1;
        } else if (
          item?.fixLocation === EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW
        ) {
          this.ruleForm.advertFormat = EnumAdvertFormat.PICTURE;
          if (this.ruleForm.screenType === Enum_AD_SCREEN.half_screen) {
            this.ruleForm.jumpType = EnumJumpType.ROUTER;
          }
        } else if (item.location === EnumAdType.VIDEO_FLOW) {
          this.ruleForm.advertFormat = EnumAdvertFormat.PICTURE;
        } else if (item?.fixLocation === EnumAdType.APP_LAUNCH_PAGE) {
          this.ruleForm.jumpType = EnumJumpType.LINK;
        }
      }

      if (
        item?.fixLocation === EnumAdType.VIDEO_INSERT_AD ||
        item?.fixLocation === EnumAdType.VIDEO_STOP_AD
      ) {
        if (isGetInfoFun) {
          if (this.row.videoLayout === EnumVideoRatio.H) {
            this.widthHeightLimit.width = 10;
            this.widthHeightLimit.height = 5;
            this.widthHeightLimit.tip = "请上传宽大于高的文件";
          } else if (this.row.videoLayout === EnumVideoRatio.V) {
            this.widthHeightLimit.width = 5;
            this.widthHeightLimit.height = 10;
            this.widthHeightLimit.tip = "请上传高大于宽的文件";
          }
        } else {
          this.ruleForm.videoLayout = EnumVideoRatio.H;
          this.widthHeightLimit.width = 10;
          this.widthHeightLimit.height = 5;
          this.widthHeightLimit.tip = "请上传宽大于高的文件";
        }
      }

      if (
        item?.fixLocation === EnumAdType.EVENT_PAGE_VIDEO ||
        item?.fixLocation === EnumAdType.EVENT_PAGE_COLLECT
      ) {
        if (isGetInfoFun) {
          if (this.row.advertImageSize === EnumAdvertImageSize.SIZE_16_9) {
            this.widthHeightLimit.width = 10;
            this.widthHeightLimit.height = 5;
            this.widthHeightLimit.tip = "请上传宽大于高的文件";
          } else if (this.row.videoLayout === EnumAdvertImageSize.SIZE_3_4) {
            this.widthHeightLimit.width = 5;
            this.widthHeightLimit.height = 10;
            this.widthHeightLimit.tip = "请上传高大于宽的文件";
          }
        } else {
          this.ruleForm.advertImageSize = EnumAdvertImageSize.SIZE_16_9;
          this.widthHeightLimit.width = 10;
          this.widthHeightLimit.height = 5;
          this.widthHeightLimit.tip = "请上传宽大于高的文件";
        }
      }

      if (item?.fixLocation === EnumAdType.VIDEO_INSERT_AD) {
        this.videoTimeRange.min = 1;
        this.videoTimeRange.max = 180;
        this.videoTimeRange_maxFileSize = 100;
      }
      if (item?.fixLocation === EnumAdType.SHORT_VIDEO_FLOW) {
        this.videoTimeRange.min = 1;
        this.videoTimeRange.max = 300;
        this.widthHeightLimit.width = 0;
        this.widthHeightLimit.height = 0;
        this.videoTimeRange_maxFileSize = 10000;
      }
      this.handleW2HRateImg(item);
      if (!isGetInfoFun) {
        this.changeAdvertFormat();
        this.initLocationId();
      }
    },
    changeAdvertImageSize(val) {
      const item = this.optionAdPos.find(
        (v) => v.id === this.ruleForm.locationId
      );
      this.handleW2HRateImg(item);
      this.ruleForm.imgFileList = [];
      this.ruleForm.adFileName = "";
      this.ruleForm.adBucketName = "";
      if (val === EnumAdvertImageSize.SIZE_16_9) {
        this.widthHeightLimit.width = 10;
        this.widthHeightLimit.height = 5;
        this.widthHeightLimit.tip = "请上传宽大于高的文件";
      } else if (val === EnumAdvertImageSize.SIZE_3_4) {
        this.widthHeightLimit.width = 5;
        this.widthHeightLimit.height = 10;
        this.widthHeightLimit.tip = "请上传高大于宽的文件";
      }
    },
    handleW2HRateImg(item) {
      const { fixLocation } = item;
      const condtionArr = [
        EnumAdType.EVENT_PAGE_VIDEO,
        EnumAdType.EVENT_PAGE_COLLECT,
      ];
      const isRateOneToOne = [
        EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW,
        EnumAdType.INDEX_PAGE_FLOAT_UPS,
        EnumAdType.GAME_PAGE_FLOAT_UPS,
        EnumAdType.CHANNEL_PAGE_FLOAT_UPS,
        EnumAdType.MSG_PAGE_FLOAT_UPS,
        EnumAdType.MINE_PAGE_FLOAT_UPS,
      ];
      const isW2HRateImgZero = [
        EnumAdType.SHORT_VIDEO_FLOW,
        EnumAdType.INDEX_PAGE_POP_UPS,
        EnumAdType.CHANNEL_PAGE_POP_UPS,
        EnumAdType.GAME_PAGE_POP_UPS,
        EnumAdType.MINE_PAGE_POP_UPS,
        EnumAdType.MSG_PAGE_POP_UPS,
      ];
      const isW2HRateImgThreeToOne = [EnumAdType.WEAK_NETWORK_AD];
      let width;
      let height;
      if (fixLocation === EnumAdType.APP_LAUNCH_PAGE) {
        width = this.W2HRateOrigin.width = 9;
        height = this.W2HRateOrigin.height = 20;
        this.W2HRateImg = width / height;
      } else if (isW2HRateImgZero.includes(fixLocation)) {
        this.W2HRateOrigin.width = 0;
        this.W2HRateOrigin.height = 0;
        this.W2HRateImg = 0;
      } else if (isRateOneToOne.includes(fixLocation)) {
        width = this.W2HRateOrigin.width = 1;
        height = this.W2HRateOrigin.height = 1;
        this.W2HRateImg = width / height;
      } else if (isW2HRateImgThreeToOne.includes(fixLocation)) {
        width = this.W2HRateOrigin.width = 3;
        height = this.W2HRateOrigin.height = 1;
        this.W2HRateImg = width / height;
      } else if (fixLocation === EnumAdType.VIDEO_DETAIL_AUTHOR_DESC) {
        width = this.W2HRateOrigin.width = 10;
        height = this.W2HRateOrigin.height = 2;
        this.W2HRateImg = width / height;
      } else if (
        condtionArr.includes(fixLocation) ||
        item?.locationType === EnumLocationType.RANK
      ) {
        const item = optAdvertImageSize.find(
          (v) => v.id === this.ruleForm.advertImageSize
        );
        width = this.W2HRateOrigin.width = item?.width;
        height = this.W2HRateOrigin.height = item?.height;
        this.W2HRateImg = width / height;
      } else {
        width = this.W2HRateOrigin.width = 16;
        height = this.W2HRateOrigin.height = 9;
        this.W2HRateImg = width / height;
      }
    },
    changeAdvertFormat() {
      if (this.ruleForm.advertFormat === EnumAdvertFormat.VIDEO) {
        this.ruleForm.imgFileList = [];
        this.ruleForm.adFileName = "";
        this.ruleForm.adBucketName = "";
      } else if (this.ruleForm.advertFormat === EnumAdvertFormat.PICTURE) {
        this.ruleForm.videoFileList = [];
        this.ruleForm.videoName = "";
        this.ruleForm.videoBucketName = "";
        this.ruleForm.coverFileList = [];
        this.ruleForm.coverFileName = "";
        this.ruleForm.coverBucketName = "";
      }
    },
    adLocation() {
      seat().then((res) => {
        this.optionAdPos = res.data.data || [];
        if (this.row.id) {
          this.getInfo();
        }
      });
    },

    handleChangeVideo(data) {
      if (data.length) {
        this.ruleForm.videoName = data[0].key;
        this.ruleForm.videoBucketName = data[0].bucketName;
        if (data[0].duration) {
          this.ruleForm.videoLength = data[0].duration * 1000;
        }
      } else {
        this.ruleForm.videoName = "";
        this.ruleForm.videoBucketName = "";
        this.ruleForm.videoFileList = [];
        this.ruleForm.videoLength = undefined;
      }
    },
    handleChangeCover(data) {
      if (data.length) {
        this.ruleForm.coverFileName = data[0].key;
        this.ruleForm.coverBucketName = data[0].bucketName;
      } else {
        this.ruleForm.coverFileName = "";
        this.ruleForm.coverBucketName = "";
      }
    },

    handleChangeImg(data) {
      if (data.length) {
        this.ruleForm.adFileName = data[0].key;
        this.ruleForm.adBucketName = data[0].bucketName;
      } else {
        this.ruleForm.adFileName = "";
        this.ruleForm.adBucketName = "";
      }
    },
    getInfo() {
      this.ruleForm.sortWeight = this.row.sortWeight;
      this.ruleForm.advertFormat = this.row.advertFormat;
      this.ruleForm.advertTitle = this.row.advertTitle;
      this.ruleForm.jumpAdress = this.row.jumpAdress;
      this.ruleForm.locationId = this.row.locationId;
      this.ruleForm.jumpType = this.row.jumpType;
      this.ruleForm.status = this.row.status;
      this.ruleForm.screenType = this.row.screenType;
      this.ruleForm.advertContent = this.row.advertContent;
      this.ruleForm.videoName = this.row.videoName;
      this.ruleForm.videoBucketName = this.row.videoBucketName;
      this.ruleForm.coverFileName = this.row.coverFileName;
      this.ruleForm.coverBucketName = this.row.coverBucketName;
      this.ruleForm.adFileName = this.row.adFileName;
      this.ruleForm.adBucketName = this.row.adBucketName;
      this.ruleForm.limitCrowd = this.row.limitCrowd;
      this.ruleForm.advertImageSize = this.row.advertImageSize;
      this.ruleForm.dateTime = [this.row.startTime, this.row.endTime];
      this.ruleForm.videoLayout = this.row.videoLayout;
      this.ruleForm.showProgressRatio = this.row.showProgressRatio;
      this.ruleForm.videoLength = this.row.videoLength;
      this.ruleForm.showExpireTime =
        this.row.showExpireTime || EnumComTrueAndFalse.FASLE;
      if (this.row.coverFileUrl) {
        setTimeout(() => {
          this.ruleForm.coverFileList = [
            {
              url: this.row.coverFileUrl,
              key: this.row.coverFileName,
              bucketName: this.row.coverBucketName,
            },
          ];
        });
      }
      if (this.row.adFileUrl) {
        setTimeout(() => {
          this.ruleForm.imgFileList = [
            {
              url: this.row.adFileUrl,
              key: this.row.adFileName,
              bucketName: this.row.adBucketName,
            },
          ];
        });
      }
      if (this.row.videoFileUrl) {
        setTimeout(() => {
          this.ruleForm.videoFileList = [
            {
              url: this.row.videoFileUrl,
              key: this.row.videoName,
              bucketName: this.row.videoBucketName,
            },
          ];
        });
      }

      if (this.row.jumpObjectInfo) {
        this.selectRow = this.row.jumpObjectInfo;
      }

      this.changeAdPos(this.row.locationId, "isGetInfo");
    },
    submitForm(formName) {
      const item = this.optionAdPos.find(
        (v) => v.id === this.ruleForm.locationId
      );
      if (!this.ruleForm.locationId) {
        return this.$message.warning("请选择广告位名称");
      }
      const isNoVideoOrImageList = [
        EnumAdType.PORTRAIT_BOTTOM_BANNER,
        EnumAdType.FIRST_PAGE,
        EnumAdType.BULLET_AD,
      ];
      if (!isNoVideoOrImageList.includes(item?.fixLocation)) {
        if (
          this.ruleForm.advertFormat === EnumAdvertFormat.VIDEO &&
          !this.ruleForm.videoName
        ) {
          return this.$message.warning("请选择上传广告视频");
        }
        if (
          this.ruleForm.advertFormat === EnumAdvertFormat.PICTURE &&
          !this.ruleForm.adFileName
        ) {
          return this.$message.warning("请选择上传广告图片");
        }

        const isNoCheckCoverList = [
          EnumAdType.VIDEO_INSERT_AD,
          EnumAdType.SHORT_VIDEO_FLOW,
        ];
        if (
          this.ruleForm.advertFormat === EnumAdvertFormat.VIDEO &&
          !this.ruleForm.coverFileName &&
          !isNoCheckCoverList.includes(item?.fixLocation)
        ) {
          return this.$message.warning("请选择上传视频封面图片");
        }
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
    initLocationId() {
      this.ruleForm.imgFileList = [];
      this.ruleForm.adFileName = "";
      this.ruleForm.adBucketName = "";
      this.ruleForm.videoFileList = [];
      this.ruleForm.videoName = "";
      this.ruleForm.videoBucketName = "";
      this.ruleForm.coverFileList = [];
      this.ruleForm.coverFileName = "";
      this.ruleForm.coverBucketName = "";
    },

    commit() {
      const params = {
        ...this.ruleForm,
        id: this.row.id,
      };
      if (this.ruleForm.dateTime && this.ruleForm.dateTime.length) {
        params.startTime = this.ruleForm.dateTime[0];
        params.endTime = this.ruleForm.dateTime[1];
      }
      if (
        this.ruleForm.jumpType === EnumJumpType.GAME ||
        this.ruleForm.jumpType === EnumJumpType.VIDEO
      ) {
        if (!this.ruleForm.jumpAdress) {
          return this.$message.warning("请添加跳转地址");
        }
      }
      if (!this.row.id) {
        addition(params).then(() => {
          this.$message.success("新增成功");
          this.row.callback(true);
        });
      } else {
        modification(params).then(() => {
          this.$message.success("编辑成功");
          this.row.callback(true);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.boxStart {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    .del {
      display: block;
    }
  }
  .del {
    display: none;
    left: 0;
    top: 0;
    width: 30px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    background: red;
    color: #fff;
    font-size: 10px;
    position: absolute;
    z-index: 99;
    cursor: pointer;
  }
}
.poroverStyle {
  position: absolute;
  top: 7px;
  left: 53px;
  font-size: 16px;
}
.weightPoroverStyle {
  position: absolute;
  top: 7px;
  left: 80px;
  font-size: 16px;
}
.emojiBox {
  position: absolute;
  right: 3px;
  top: 0px;
  cursor: pointer;
}
.sliderStyle {
  ::v-deep.el-slider {
    display: flex;
  }
  ::v-deep.el-slider__input {
    margin-right: 25px;
  }
  ::v-deep.el-slider__runway.show-input {
    margin-right: 0;
    width: 20%;
  }
}
</style>
