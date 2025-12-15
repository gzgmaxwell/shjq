<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="广告位名称:" prop="advertLocationName">
      <el-input
        placeholder="请输入广告位名称"
        v-model="ruleForm.advertLocationName"
        clearable
      />
    </el-form-item>

    <el-form-item label="所属页面:" prop="locationType">
      <el-radio-group
        v-model="ruleForm.locationType"
        @change="changeLocationType"
      >
        <el-radio
          v-for="item in optionLocationType"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item
      label=""
      prop="navigationId"
      v-if="ruleForm.locationType === EnumLocationType.NAVIGATION"
    >
      <el-select v-model="ruleForm.navigationId" placeholder="请选择" clearable>
        <el-option
          v-for="item in classifyOptions"
          :key="item.id"
          :value="item.id"
          :label="item.classifyName"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      label=""
      prop="fixLocation"
      v-if="ruleForm.locationType === 'FIXED'"
    >
      <el-select
        v-model="ruleForm.fixLocation"
        placeholder="请选择"
        @change="fixLocationChange"
        clearable
      >
        <el-option
          v-for="(item, index) in assets"
          :key="index"
          :label="item.value"
          :value="item.code"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="显示时间" prop="seconds" v-if="shouldShowDuration">
      <el-input-number
        v-model="ruleForm.duration"
        :min="3"
        :max="5"
        placeholder="3~5秒"
      ></el-input-number
    ></el-form-item>

    <el-form-item label="广告类型:" prop="location">
      <el-radio-group
        v-model="ruleForm.location"
        :disabled="compLocation(ruleForm)"
        @change="changeAdType"
      >
        <el-radio
          v-for="item in filteredOptionAdType"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item
      label="视频权重:"
      prop="videoWeight"
      v-if="cmpVideoWeight(ruleForm)"
    >
      <el-input-number
        placeholder="请输入视频权重"
        :min="0"
        :max="1"
        :step="0.1"
        :disabled="disabledVideoWeight(ruleForm)"
        v-model="ruleForm.videoWeight"
      />
    </el-form-item>

    <el-form-item
      label="图片权重:"
      prop="imgWeight"
      v-if="showImgWeight(ruleForm)"
    >
      <el-input-number
        placeholder="请输入图片权重"
        :min="0"
        :max="1"
        :step="0.1"
        v-model="ruleForm.imgWeight"
        :disabled="disabledImgWeight(ruleForm)"
      />
    </el-form-item>

    <el-form-item label="VIP可跳过" v-if="showAdVipSkipStatus(ruleForm)">
      <el-switch
        v-model="ruleForm.adVipSkipStatus"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="
          (val) => {
            ruleForm.adVipSkipTime = val === EnumAdVipSkipStatus.on ? 5 : 0;
          }
        "
        :active-value="EnumAdVipSkipStatus.on"
        :inactive-value="EnumAdVipSkipStatus.off"
      >
      </el-switch>
    </el-form-item>

    <el-form-item
      label="VIP可跳过（秒）:"
      v-if="ruleForm.adVipSkipStatus === EnumAdVipSkipStatus.on"
    >
      <el-input-number
        :min="1"
        :max="30"
        :precision="0"
        :step="1"
        v-model="ruleForm.adVipSkipTime"
      />
    </el-form-item>

    <el-form-item
      label="复显时间"
      v-if="shouldAdvertTime(ruleForm.fixLocation)"
    >
      <el-input-number
        v-model="ruleForm.advertTime"
        :min="1"
        :max="999999999999"
        :step="1"
        :precision="0"
      />
      <span class="ml10">秒</span>
    </el-form-item>

    <el-form-item
      label="关闭次数"
      prop="closeCount"
      v-if="showCloseCount(ruleForm)"
    >
      <el-input-number
        placeholder="关闭次数"
        :min="1"
        :max="9999"
        :step="1"
        step-strictly
        v-model="ruleForm.closeCount"
      />
    </el-form-item>

    <el-form-item v-if="showShowZone(ruleForm)">
      <span slot="label"> <span class="must">*</span>显示区域 </span>
      <div class="zoneWrap">
        <div
          class="showZoneWrap"
          :class="{ isActive: item.isActive }"
          v-for="item in optShowZone"
          @click="choiceShowZone(item)"
        >
          <img
            src="@/assets/img/showZone.png"
            alt=""
            width="40"
            height="40"
            :class="item.id"
          />
        </div>
      </div>
    </el-form-item>

    <el-form-item label="广告状态:">
      <el-radio-group v-model="ruleForm.status">
        <el-radio
          v-for="item in optionComStatus"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="frequency" v-if="isShowVideoRate(ruleForm)">
      <span slot="label">
        <el-popover
          placement="top"
          trigger="hover"
          content="设置频率表示app刷到多少个视频则出现一条广告"
        >
          <span slot="reference" class="el-icon-question question"></span>
        </el-popover>
        展示频率配置
      </span>
      <el-input-number
        placeholder="请输入展示频率"
        :min="5"
        :max="30"
        :step="1"
        step-strictly
        v-model="ruleForm.frequency"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import {
  advertLocationGetFixedType,
  savebuild,
  updateedit,
} from "@/api/content/advertising";

import {
  optionAdType,
  EnumAdType,
  optionComStatus,
  EnumComStatus,
  optionLocationType,
  EnumLocationType,
  debounceCallBack,
  EnumAdVipSkipStatus,
  optShowZone,
  EnumShowZone,
} from "@/util/util";

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
  data() {
    return {
      EnumAdType: EnumAdType,
      EnumAdVipSkipStatus: EnumAdVipSkipStatus,
      EnumLocationType: EnumLocationType,
      ruleForm: {
        id: "",
        advertLocationName: "",
        locationType: EnumLocationType.NAVIGATION,
        navigationId: "",
        fixLocation: "",
        location: EnumAdType.VIDEO_FLOW,
        videoWeight: 0,
        imgWeight: 1,
        advertTime: 1,
        status: EnumComStatus.ON,
        duration: "",
        adVipSkipStatus: EnumAdVipSkipStatus.off,
        adVipSkipTime: undefined,
        frequency: 5,
        closeCount: 1,
        displayArea: optShowZone.find((v) => v.isActive)?.id,
      },
      options: [],
      optionAdType: optionAdType,
      optionComStatus: optionComStatus,
      optionLocationType: optionLocationType,
      optShowZone: optShowZone,
      assets: [],
      rules: {
        advertLocationName: [
          { required: true, message: "请输入广告位名称", trigger: "blur" },
        ],
        locationType: [{ required: true, message: "请选择", trigger: "blur" }],
        navigationId: [
          { required: true, message: "请选择所属页面", trigger: "blur" },
        ],
        fixLocation: [
          { required: true, message: "请选择所属页面", trigger: "blur" },
        ],
        location: [{ required: true, message: "请选择", trigger: "blur" }],
        videoWeight: [{ required: true, message: "请输入", trigger: "blur" }],
        imgWeight: [{ required: true, message: "请输入", trigger: "blur" }],
        advertTime: [{ required: true, message: "请输入", trigger: "blur" }],
        duration: [
          { required: true, message: "请输入3~5秒", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        frequency: [{ required: true, message: "请输入", trigger: "blur" }],
        closeCount: [{ required: true, message: "关闭次数", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
    }),
    compLocation() {
      return (ruleForm) => {
        if (
          ruleForm.locationType === EnumLocationType.FIXED ||
          ruleForm.locationType === EnumLocationType.NAVIGATION ||
          ruleForm.locationType === EnumLocationType.RANK
        ) {
          return true;
        }
        return false;
      };
    },
    filteredOptionAdType() {
      const selectedOptions = [EnumAdType.BANNER, EnumAdType.VIDEO_FLOW];
      if (this.ruleForm.locationType === EnumLocationType.FIXED) {
        return this.optionAdType;
      } else {
        return this.optionAdType.filter((item) =>
          selectedOptions.includes(item.id)
        );
      }
    },
    shouldShowDuration() {
      const selectedItem = this.assets.find(
        (item) => item.code === this.ruleForm.fixLocation
      );
      return selectedItem && selectedItem.hasDuration;
    },
    shouldAdvertTime() {
      return (fixLocation) =>
        fixLocation === EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW;
    },
    cmpVideoWeight() {
      return (ruleForm) => {
        const isHideArr = [
          EnumAdType.EVENT_PAGE, //  动态列表
          EnumAdType.APP_LAUNCH_PAGE, //APP启动页,
          EnumAdType.TALK_PAGE, //话题详情
          EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW, //  底角浮窗
          EnumAdType.VIDEO_DETAIL_AUTHOR_DESC, //  作者简介
          EnumAdType.PORTRAIT_BOTTOM_BANNER, //  底部横幅
          EnumAdType.EVENT_PAGE_VIDEO, //  动态列表-视频
          EnumAdType.EVENT_PAGE_COLLECT, //  动态列表-合集
          EnumAdType.VIDEO_STOP_AD, //  动态列表-合集
          EnumAdType.FIRST_PAGE, //  一级页面
          EnumAdType.BULLET_AD, //  动态列表-合集
          EnumAdType.SHORT_VIDEO_FLOW, // 短视频播放器信息流
          EnumAdType.INDEX_PAGE_POP_UPS, // 首页弹窗
          EnumAdType.CHANNEL_PAGE_POP_UPS, // 频道弹窗
          EnumAdType.GAME_PAGE_POP_UPS, // 游戏弹窗
          EnumAdType.MINE_PAGE_POP_UPS, // 我的弹窗
          EnumAdType.MSG_PAGE_POP_UPS, // 消息弹窗
          EnumAdType.WEAK_NETWORK_AD, // 弱网广告
          EnumAdType.INDEX_PAGE_FLOAT_UPS, // 首页浮窗
          EnumAdType.GAME_PAGE_FLOAT_UPS, // 游戏浮窗
          EnumAdType.CHANNEL_PAGE_FLOAT_UPS, // 频道浮窗
          EnumAdType.MSG_PAGE_FLOAT_UPS, // 消息浮窗
          EnumAdType.MINE_PAGE_FLOAT_UPS, // 我的浮窗
        ];
        if (ruleForm.locationType === EnumLocationType.FIXED) {
          if (isHideArr.includes(ruleForm.fixLocation)) {
            return false;
          }
          return true;
        }
        if (ruleForm.locationType === EnumLocationType.NAVIGATION) {
          return false;
        }
        if (ruleForm.location === EnumAdType.VIDEO_FLOW) {
          return false;
        }
        return true;
      };
    },
    disabledVideoWeight() {
      return (ruleForm) => {
        if (ruleForm.fixLocation === EnumAdType.VIDEO_INSERT_AD) return true;
        return false;
      };
    },
    showImgWeight() {
      return (ruleForm) => {
        const isHideArrImg = [
          EnumAdType.FIRST_PAGE,
          EnumAdType.VIDEO_INSERT_AD,
          EnumAdType.BULLET_AD,
          EnumAdType.SHORT_VIDEO_FLOW,
        ];
        if (isHideArrImg.includes(ruleForm.fixLocation)) {
          return false;
        }
        return ruleForm.location !== EnumAdType.BOTTOM_BANNER;
      };
    },
    disabledImgWeight() {
      return (ruleForm) => {
        if (ruleForm.fixLocation === EnumAdType.VIDEO_DETAIL_PAGE) {
          return false;
        }
        const isDisabled = [
          EnumAdType.EVENT_PAGE, // 动态列表
          EnumAdType.APP_LAUNCH_PAGE, //APP启动页,
          EnumAdType.TALK_PAGE, // 话题详情
          EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW, // 底角浮窗
          EnumAdType.VIDEO_DETAIL_AUTHOR_DESC, //  作者简介
          EnumAdType.PORTRAIT_BOTTOM_BANNER, //  底部横幅
          EnumAdType.EVENT_PAGE_VIDEO, //  动态列表-视频
          EnumAdType.EVENT_PAGE_COLLECT, //  动态列表-合集
          EnumAdType.VIDEO_STOP_AD, //  动态列表-合集
          EnumAdType.INDEX_PAGE_POP_UPS, // 首页弹窗
          EnumAdType.CHANNEL_PAGE_POP_UPS, // 频道弹窗
          EnumAdType.GAME_PAGE_POP_UPS, // 游戏弹窗
          EnumAdType.MINE_PAGE_POP_UPS, // 我的弹窗
          EnumAdType.MSG_PAGE_POP_UPS, // 消息弹窗
          EnumAdType.WEAK_NETWORK_AD, // 弱网广告
          EnumAdType.INDEX_PAGE_FLOAT_UPS, // 首页浮窗
          EnumAdType.GAME_PAGE_FLOAT_UPS, // 游戏浮窗
          EnumAdType.CHANNEL_PAGE_FLOAT_UPS, // 频道浮窗
          EnumAdType.MSG_PAGE_FLOAT_UPS, // 消息浮窗
          EnumAdType.MINE_PAGE_FLOAT_UPS, // 我的浮窗
        ];
        if (ruleForm.locationType === EnumLocationType.FIXED) {
          return isDisabled.includes(ruleForm.fixLocation);
        }
        if (ruleForm.location === EnumAdType.VIDEO_FLOW) {
          return true;
        }
        return false;
      };
    },

    showAdVipSkipStatus() {
      return (ruleForm) => {
        if (ruleForm.fixLocation === EnumAdType.VIDEO_INSERT_AD) return true;
        this.ruleForm.adVipSkipStatus = EnumAdVipSkipStatus.off;
        return false;
      };
    },
    isShowVideoRate() {
      return (ruleForm) => {
        if (ruleForm.fixLocation === EnumAdType.SHORT_VIDEO_FLOW) {
          return true;
        }
        return false;
      };
    },
    showCloseCount() {
      return (ruleForm) => {
        const arr = [
          EnumAdType.INDEX_PAGE_POP_UPS,
          EnumAdType.VIDEO_STOP_AD,
          EnumAdType.VIDEO_INSERT_AD,
          EnumAdType.VIDEO_DETAIL_AUTHOR_DESC,
          EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW,
          EnumAdType.FIRST_PAGE,
          EnumAdType.CHANNEL_PAGE_POP_UPS,
          EnumAdType.MINE_PAGE_POP_UPS,
          EnumAdType.GAME_PAGE_POP_UPS,
          EnumAdType.MSG_PAGE_POP_UPS,
          EnumAdType.INDEX_PAGE_FLOAT_UPS,
          EnumAdType.APP_LAUNCH_PAGE,
          EnumAdType.GAME_PAGE_FLOAT_UPS,
          EnumAdType.CHANNEL_PAGE_FLOAT_UPS,
          EnumAdType.MSG_PAGE_FLOAT_UPS,
          EnumAdType.MINE_PAGE_FLOAT_UPS,
        ];
        if (arr.includes(ruleForm.fixLocation)) {
          return true;
        }
        return false;
      };
    },

    showShowZone() {
      return (ruleForm) => {
        const arr = [
          EnumAdType.INDEX_PAGE_FLOAT_UPS, // 首页浮窗
          EnumAdType.GAME_PAGE_FLOAT_UPS, // 游戏浮窗
          EnumAdType.CHANNEL_PAGE_FLOAT_UPS, // 频道浮窗
          EnumAdType.MSG_PAGE_FLOAT_UPS, // 消息浮窗
          EnumAdType.MINE_PAGE_FLOAT_UPS, // 我的浮窗
        ];
        if (arr.includes(ruleForm.fixLocation)) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.fixation();
  },

  methods: {
    changeLocationType(val) {
      this.ruleForm.fixLocation = "";
      this.ruleForm.navigationId = "";
      this.ruleForm.videoWeight = 0;
      this.ruleForm.imgWeight = 0;
      this.ruleForm.status = EnumComStatus.ON;
      if (
        val === EnumLocationType.NAVIGATION ||
        val === EnumLocationType.RANK
      ) {
        this.ruleForm.location = EnumAdType.VIDEO_FLOW;
        this.ruleForm.imgWeight = 1;
      } else {
        this.ruleForm.location = EnumAdType.BANNER;
      }
    },
    changeAdType(val) {
      if (val === EnumAdType.VIDEO_FLOW) {
        this.ruleForm.imgWeight = 1;
      } else {
        this.ruleForm.imgWeight = 0;
      }
    },
    fixLocationChange(val) {
      this.optShowZone.forEach((v) => {
        if (v.id === EnumShowZone.UPPER_LEFT) {
          v.isActive = true;
        } else {
          v.isActive = false;
        }
      });
      const isInfoFlow = [
        EnumAdType.EVENT_PAGE,
        EnumAdType.VIDEO_DETAIL_PAGE,
        EnumAdType.TALK_PAGE,
        EnumAdType.EVENT_PAGE_VIDEO,
        EnumAdType.EVENT_PAGE_COLLECT,
        EnumAdType.VIDEO_INSERT_AD,
        EnumAdType.VIDEO_STOP_AD,
        EnumAdType.BULLET_AD,
        EnumAdType.SHORT_VIDEO_FLOW,
      ];

      const is_POP_UPS = [
        EnumAdType.INDEX_PAGE_POP_UPS, // 首页弹窗
        EnumAdType.CHANNEL_PAGE_POP_UPS, // 频道弹窗
        EnumAdType.GAME_PAGE_POP_UPS, // 游戏弹窗
        EnumAdType.MINE_PAGE_POP_UPS, // 我的弹窗
        EnumAdType.MSG_PAGE_POP_UPS, // 消息弹窗
      ];

      const is_FLOATING_WINDOW = [
        EnumAdType.INDEX_PAGE_FLOAT_UPS, // 首页浮窗
        EnumAdType.GAME_PAGE_FLOAT_UPS, // 游戏浮窗
        EnumAdType.CHANNEL_PAGE_FLOAT_UPS, // 频道浮窗
        EnumAdType.MSG_PAGE_FLOAT_UPS, // 消息浮窗
        EnumAdType.MINE_PAGE_FLOAT_UPS, // 我的浮窗
      ];

      if (isInfoFlow.includes(val)) {
        this.ruleForm.location = EnumAdType.VIDEO_FLOW;
      } else if (val === EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW) {
        this.ruleForm.location = EnumAdType.FLOATING_WINDOW;
      } else if (is_POP_UPS.includes(val)) {
        this.ruleForm.location = EnumAdType.POP_UPS;
      } else if (is_FLOATING_WINDOW.includes(val)) {
        this.ruleForm.location = EnumAdType.FLOATING_WINDOW;
      } else if (
        val === EnumAdType.PORTRAIT_BOTTOM_BANNER ||
        val === EnumAdType.FIRST_PAGE
      ) {
        this.ruleForm.location = EnumAdType.BOTTOM_BANNER;
      } else {
        this.ruleForm.location = EnumAdType.BANNER;
      }

      const isImgWeight = [
        EnumAdType.EVENT_PAGE, //  动态列表
        EnumAdType.VIDEO_DETAIL_PAGE, //  视频详情
        EnumAdType.APP_LAUNCH_PAGE, //APP启动页,
        EnumAdType.TALK_PAGE, //话题详情
        EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW, //  底角浮窗
        EnumAdType.VIDEO_DETAIL_AUTHOR_DESC, //  作者简介
        EnumAdType.EVENT_PAGE_VIDEO,
        EnumAdType.EVENT_PAGE_COLLECT,
        EnumAdType.PORTRAIT_BOTTOM_BANNER,
        EnumAdType.FIRST_PAGE,
        EnumAdType.VIDEO_STOP_AD,
        EnumAdType.INDEX_PAGE_POP_UPS, // 首页弹窗
        EnumAdType.CHANNEL_PAGE_POP_UPS, // 频道弹窗
        EnumAdType.GAME_PAGE_POP_UPS, // 游戏弹窗
        EnumAdType.MINE_PAGE_POP_UPS, // 我的弹窗
        EnumAdType.MSG_PAGE_POP_UPS, // 消息弹窗
        EnumAdType.WEAK_NETWORK_AD, // 弱网广告
        EnumAdType.INDEX_PAGE_FLOAT_UPS, // 首页浮窗
        EnumAdType.GAME_PAGE_FLOAT_UPS, // 游戏浮窗
        EnumAdType.CHANNEL_PAGE_FLOAT_UPS, // 频道浮窗
        EnumAdType.MSG_PAGE_FLOAT_UPS, // 消息浮窗
        EnumAdType.MINE_PAGE_FLOAT_UPS, // 我的浮窗
      ];

      if (isImgWeight.includes(val)) {
        this.ruleForm.videoWeight = 0;
        this.ruleForm.imgWeight = 1;
      } else if (val === EnumAdType.VIDEO_INSERT_AD) {
        this.ruleForm.videoWeight = 1;
        this.ruleForm.imgWeight = 0;
      } else {
        this.ruleForm.imgWeight = 0;
        this.ruleForm.videoWeight = 0;
      }
    },
    fixation() {
      advertLocationGetFixedType().then((res) => {
        this.assets = res.data.data;
        if (this.row.id) {
          this.getInfo();
        }
      });
    },
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.advertLocationName = this.row.advertLocationName;
      this.ruleForm.locationType = this.row.locationType;
      this.ruleForm.navigationId = this.row.navigationId;
      this.ruleForm.fixLocation = this.row?.fixLocation;
      this.ruleForm.location = this.row.location;
      this.ruleForm.videoWeight = this.row.videoWeight;
      this.ruleForm.imgWeight = this.row.imgWeight;
      this.ruleForm.status = this.row.status;
      this.ruleForm.duration = this.row.duration;
      this.ruleForm.advertTime = this.row.advertTime;
      this.ruleForm.adVipSkipStatus = this.row.adVipSkipStatus;
      this.ruleForm.adVipSkipTime = this.row.adVipSkipTime;
      this.ruleForm.frequency = this.row.frequency;
      this.ruleForm.closeCount = this.row.closeCount || 1;
      this.ruleForm.displayArea = this.row.displayArea;
      this.optShowZone.forEach((v) => {
        if (this.row.displayArea) {
          if (v.id === this.row.displayArea) {
            v.isActive = true;
          } else {
            v.isActive = false;
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },

    choiceShowZone(item) {
      this.optShowZone.forEach((v) => {
        if (v.id === item.id) {
          v.isActive = true;
        } else {
          v.isActive = false;
        }
      });
      this.ruleForm.displayArea = item.id;
    },
    commit() {
      const excludeList = [
        EnumAdType.PORTRAIT_BOTTOM_BANNER,
        EnumAdType.BULLET_AD,
        EnumAdType.SHORT_VIDEO_FLOW,
      ];
      if (!excludeList.includes(this.ruleForm.fixLocation)) {
        const sum =
          Number(this.ruleForm.videoWeight) + Number(this.ruleForm.imgWeight);
        if (sum !== 1) {
          return this.$message.warning("图片权重和视频权重之和等于1");
        }
      }
      const params = {
        ...this.ruleForm,
      };
      if (!this.ruleForm.id) {
        const debounceAPI = () => {
          return savebuild(params).then(() => {
            this.$message.success("新增成功");
            this.row.callback(true);
            return Promise.resolve();
          });
        };
        debounceCallBack(debounceAPI)();
      } else {
        updateedit(params).then(() => {
          this.$message.success("编辑成功");
          this.row.callback(true);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped="scoped">
.zoneWrap {
  display: flex;
  justify-content: flex-start;
  .isActive {
    border: 1px solid #565eaa !important;
  }
  .showZoneWrap {
    width: 110px;
    height: 160px;
    margin-right: 10px;
    border: 1px solid #e7e7e7;
    background: #e7e7e7;
    position: relative;
    cursor: pointer;

    img {
      position: absolute;
    }
    .UPPER_LEFT {
      left: 0;
      top: 0;
    }
    .UPPER_RIGHT {
      right: 0;
      top: 0;
    }
    .BOTTOM_LEFT {
      left: 0;
      bottom: 0;
    }
    .BOTTOM_RIGHT {
      right: 0;
      bottom: 0;
    }
  }
}
</style>
