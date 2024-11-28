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
      },
      options: [],
      optionAdType: optionAdType,
      optionComStatus: optionComStatus,
      optionLocationType: optionLocationType,
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
          EnumAdType.INDEX_PAGE_POP_UPS, // 首页弹窗
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
        const isShowArr = [
          EnumAdType.INDEX_PAGE_POP_UPS, // 首页弹窗
          EnumAdType.EVENT_PAGE, // 动态列表
          EnumAdType.APP_LAUNCH_PAGE, //APP启动页,
          EnumAdType.TALK_PAGE, // 话题详情
          EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW, // 底角浮窗
          EnumAdType.VIDEO_DETAIL_AUTHOR_DESC, //  作者简介
          EnumAdType.PORTRAIT_BOTTOM_BANNER, //  底部横幅
          EnumAdType.EVENT_PAGE_VIDEO, //  动态列表-视频
          EnumAdType.EVENT_PAGE_COLLECT, //  动态列表-合集
          EnumAdType.VIDEO_STOP_AD, //  动态列表-合集
        ];
        if (ruleForm.locationType === EnumLocationType.FIXED) {
          return isShowArr.includes(ruleForm.fixLocation);
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

      if (isInfoFlow.includes(val)) {
        this.ruleForm.location = EnumAdType.VIDEO_FLOW;
      } else if (val === EnumAdType.VIDEO_DETAIL_FLOATING_WINDOW) {
        this.ruleForm.location = EnumAdType.FLOATING_WINDOW;
      } else if (val === EnumAdType.INDEX_PAGE_POP_UPS) {
        this.ruleForm.location = EnumAdType.POP_UPS;
      } else if (
        val === EnumAdType.PORTRAIT_BOTTOM_BANNER ||
        val === EnumAdType.FIRST_PAGE
      ) {
        this.ruleForm.location = EnumAdType.BOTTOM_BANNER;
      } else {
        this.ruleForm.location = EnumAdType.BANNER;
      }

      const isImgWeight = [
        EnumAdType.INDEX_PAGE_POP_UPS, // 首页弹窗
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
