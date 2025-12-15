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

    <el-form-item label="广告位名称" prop="locationIds">
      <el-select
        v-model="ruleForm.locationIds"
        multiple
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
    <el-form-item label="内容" prop="advertFormat">
      <el-radio-group v-model="ruleForm.advertFormat">
        <el-radio
          v-for="item in optionAdvertFormat"
          disabled
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <span slot="label"><span class="must">*</span>图片上传</span>
      <div>
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

    <el-form-item prop="sortWeight">
      <span slot="label">
        <el-popover
          placement="top"
          trigger="hover"
          content="该权重越大出现几率越高"
        >
          <span slot="reference" class="el-icon-question question"></span>
        </el-popover>
        权重
      </span>
      <div class="sliderStyle">
        <el-slider
          v-model="ruleForm.sortWeight"
          show-input
          :min="1"
          :max="999"
          :step="1"
        ></el-slider>
      </div>
    </el-form-item>

    <el-form-item label="跳转类型" prop="jumpType">
      <el-select v-model="ruleForm.jumpType" :disabled="isDisabledJumpType">
        <el-option
          v-for="item in optJumpType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
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
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">关闭</el-button>
    </el-form-item>
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
      title="视频跳转"
      :visible.sync="videoVisible"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
    >
      <linkVideo v-if="videoVisible" :row="rowParams" />
    </el-dialog>
  </el-form>
</template>
<script>
import {
  seat,
  advert_saveBatch,
  advertisingspace,
} from "@/api/content/advertising";
import upload from "@/components/upload/index.vue";
import linkVideo from "./linkVideo.vue";
import linkGame from "./linkGame.vue";
import {
  EnumAdType,
  optionAdvertFormat,
  EnumAdvertFormat,
  optionComStatus,
  EnumJumpType,
  optJumpType,
  optCrowdType,
  EnumCrowdType,
  Enum_AD_SCREEN,
  EnumComStatus,
} from "@/util/util";
import linkTip from "@/components/link-tip/index.vue";

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
  },
  data() {
    return {
      isDisabledJumpType: false,
      W2HRateImg: 16 / 9,
      W2HRateOrigin: { width: 16, height: 9 },
      selectRow: {},
      videoVisible: false,
      gameVisible: false,
      ruleForm: {
        adType: EnumAdType.BANNER,
        advertTitle: "",
        locationIds: [],
        status: EnumComStatus.ON,
        jumpType: EnumJumpType.LINK,
        jumpAdress: "",
        advertFormat: EnumAdvertFormat.PICTURE,
        imgFileList: [],
        adFileName: "",
        adBucketName: "",
        dateTime: [],
        sortWeight: 0,
        limitCrowd: "",
      },
      optionAdPos: [],
      optionAdvertFormat: optionAdvertFormat,
      optionComStatus: optionComStatus,
      optJumpType: optJumpType,
      optCrowdType: optCrowdType,
      rules: {
        sortWeight: [{ required: true, message: "权重", trigger: "blur" }],
        advertFormat: [
          {
            required: true,
            message: "请选择广告格式",
            trigger: "change",
          },
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
        locationIds: [
          { required: true, message: "请选择广告位名称", trigger: "change" },
        ],
        status: [
          {
            required: true,
            message: "广告状态",
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
    filterJumpType() {
      return (data) => {
        if (data === Enum_AD_SCREEN.full_screen) {
          return false;
        } else {
          return true;
        }
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
    showPath() {
      return (data) => {
        const arr = [EnumJumpType.VIDEO, EnumJumpType.GAME];
        if (arr.includes(data)) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.adLocation();
  },

  methods: {
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
    changeJumpType(val) {
      this.selectRow = {};
      this.ruleForm.jumpAdress = "";
      this.ruleForm.limitCrowd = "";
      if (val === EnumJumpType.BIND_MOBILE_WELFARE) {
        this.ruleForm.limitCrowd = EnumCrowdType.NOT_BIND_MOBILE_USER;
      }
    },
    adLocation() {
      advertisingspace({
        location: "VIDEO_FLOW",
        locationType: "NAVIGATION",
        current: 1,
        size: 999,
      }).then((res) => {
        this.optionAdPos = res.data.data.records || [];
      });
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
    submitForm(formName) {
      if (!this.ruleForm.locationIds.length) {
        return this.$message.warning("请选择广告位名称");
      }
      if (!this.ruleForm.adFileName) {
        return this.$message.warning("请选择图片上传");
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

    commit() {
      const params = {
        ...this.ruleForm,
      };
      if (this.ruleForm.dateTime && this.ruleForm.dateTime.length) {
        params.startTime = this.ruleForm.dateTime[0];
        params.endTime = this.ruleForm.dateTime[1];
      }
      // if (
      //   this.ruleForm.jumpType === EnumJumpType.GAME ||
      //   this.ruleForm.jumpType === EnumJumpType.VIDEO
      // ) {
      //   if (!this.ruleForm.jumpAdress) {
      //     return this.$message.warning("请添加跳转地址");
      //   }
      // }
      advert_saveBatch(params).then(() => {
        this.$message.success("批量新增成功");
        this.row.callback(true);
      });
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
