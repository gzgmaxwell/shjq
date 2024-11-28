<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="游戏海报:" prop="gamePosterFileName">
        <div>
          <upload
            bucketType="GAME_CNETER"
            @onChange="handleChangeCover"
            :W2HRate="16 / 9"
            :maxFileSize="20"
            :limit="1"
            title="封面图片"
            :fileList="fileList"
            :isW2HRateTip="true"
          />
        </div>
      </el-form-item>
      <el-form-item label="游戏图标:" prop="gameIconFileName">
        <div>
          <upload
            bucketType="GAME_CNETER"
            @onChange="handleChange"
            :W2HRate="1 / 1"
            :maxFileSize="20"
            :limit="1"
            title="封面图片"
            :fileList="iconlist"
            :isW2HRateTip="true"
            :W2HRateOrigin="{
              width: 1,
              height: 1,
            }"
          />
        </div>
      </el-form-item>
      <el-form-item label="游戏名称:" prop="gameName">
        <el-input
          v-model="ruleForm.gameName"
          placeholder="请输入游戏名称"
          maxlength="12"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="游戏描述:" prop="gameDiscription">
        <el-input
          type="textarea"
          resize="none"
          :rows="3"
          v-model="ruleForm.gameDiscription"
          placeholder="请输入游戏描述"
          maxlength="40"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="推广类型:" prop="urlType">
        <el-select v-model="ruleForm.urlType" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="屏幕方向:" prop="screenDirection">
        <el-select
          v-model="ruleForm.screenDirection"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in optionsScreenDirection"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转链接:" prop="gameUrl">
        <el-input
          style="width: 50%"
          v-model="ruleForm.gameUrl"
          placeholder="请输入跳转链接"
          clearable
        ></el-input>
        <linkTip
          title="活动链接有效性检查"
          width="300"
          class="ml10 fs18"
          v-if="ruleForm.gameUrl"
          :content="`请打开下面地址检查 '${ruleForm.gameUrl}' 是否有效`"
          checkURL="https://tool.dnspod.cn/"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="ruleForm.sort"
          placeholder="请输入排序"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="游戏状态:" prop="status" v-if="row.id">
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
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { affixion, amend } from "@/api/marketing/planning";
import upload from "@/components/upload/index.vue";
import {
  optionJumpType,
  optionsScreenDirection,
  optionComStatus,
} from "@/util/util";
import linkTip from "@/components/link-tip/index.vue";

export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    upload,
    linkTip,
  },
  data() {
    return {
      options: optionJumpType,
      optionsScreenDirection: optionsScreenDirection,
      optionComStatus: optionComStatus,
      ruleForm: {
        id: "",
        gamePosterBucketName: "PUBLIC", //存储游戏海报的桶
        gamePosterFileName: "", //上传游戏海报图片名称
        gameIconBucketName: "PUBLIC", //存储游戏图标的桶
        gameIconFileName: "", // 上传游戏图标名称
        gameName: "", //游戏名称 1
        gameDiscription: "", //游戏描述 1
        gameUrl: "", //跳转链接 1
        sort: "",
        status: "ON", //游戏上架或下架
        urlType: "", //链接类型
        screenDirection: 0,
      },
      fileList: [],
      iconlist: [],
      rules: {
        gamePosterFileName: [
          { required: true, message: "请上传游戏海报", trigger: "blur" },
        ],
        gameIconFileName: [
          { required: true, message: "请上传游戏图标", trigger: "blur" },
        ],
        gameName: [
          { required: true, message: "请输入游戏名称", trigger: "blur" },
        ],
        gameDiscription: [
          { required: true, message: "请输入游戏描述", trigger: "blur" },
        ],
        gameUrl: [
          { required: true, message: "请输入跳转链接", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入排序", trigger: "blur" },
          {
            pattern: /^[0-9]+$/,
            message: "请输入整数",
            trigger: "blur",
          },
        ],
        urlType: [
          { required: true, message: "请选择推广类型", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getRow();
    }
  },
  methods: {
    handleChangeCover(data) {
      if (data.length) {
        this.ruleForm.gamePosterFileName = data[0].key;
      } else {
        this.ruleForm.gamePosterFileName = "";
      }
    },
    handleChange(data) {
      if (data.length) {
        this.ruleForm.gameIconFileName = data[0].key;
      } else {
        this.ruleForm.gameIconFileName = "";
      }
    },
    getRow() {
      this.ruleForm = JSON.parse(JSON.stringify(this.row));
      this.ruleForm.id = this.row.id;
      this.ruleForm.gamePosterFileName = this.row.gamePosterFileName;
      this.ruleForm.gameIconFileName = this.row.gameIconFileName;
      this.ruleForm.gameName = this.row.gameName;
      this.ruleForm.gameDiscription = this.row.gameDiscription;
      this.ruleForm.urlType = this.row.urlType;
      this.ruleForm.screenDirection = this.row.screenDirection;
      this.ruleForm.gameUrl = this.row.gameUrl;
      this.ruleForm.sort = this.row.sort;
      this.ruleForm.status = this.row.status;
      if (this.row.gamePosterUrl) {
        this.fileList = [{ url: this.row.gamePosterUrl }];
      } else {
        this.fileList = [];
      }
      if (this.row.gameIconUrl) {
        this.iconlist = [{ url: this.row.gameIconUrl }];
      } else {
        this.iconlist = [];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.gamePosterFileName) {
            return this.$message.error("请上传游戏海报");
          }
          if (!this.ruleForm.gameIconFileName) {
            return this.$message.error("请上传游戏图标");
          }
          if (!this.ruleForm.id) {
            affixion(this.ruleForm).then((res) => {
              if (res.data.code == "200") {
                this.$message.success("新增成功");
                this.row.callback(true);
              }
            });
          } else {
            amend(this.ruleForm).then(() => {
              this.$message.success("编辑成功");
              this.row.callback(true);
            });
          }
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
