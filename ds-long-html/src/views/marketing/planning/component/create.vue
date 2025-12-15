<template>
  <div class="mt20">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <span slot="label"><span class="must">*</span>活动海报:</span>
        <upload
          bucketType="PRE_VIDEO"
          @onChange="handleChange"
          :W2HRate="16 / 9"
          :maxFileSize="5"
          :limit="1"
          title="上传"
          :fileList="fileList"
          :isW2HRateTip="true"
        />
      </el-form-item>

      <el-form-item label="活动标题:" prop="activityTilte">
        <el-input
          style="width: 70%"
          v-model="form.activityTilte"
          placeholder="请输入活动标题"
        ></el-input>
      </el-form-item>

      <el-form-item label="活动描述:" prop="activityDescription">
        <el-input
          style="width: 70%"
          v-model="form.activityDescription"
          placeholder="请输入活动描述"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
        ></el-input>
      </el-form-item>

      <el-form-item label="链接类型:" prop="urlType">
        <el-select
          v-model="form.urlType"
          clearable
          placeholder="请选择链接类型"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="活动链接:" prop="activityUrl">
        <el-input
          style="width: 50%"
          v-model="form.activityUrl"
          placeholder="请输入活动链接"
        ></el-input>
        <linkTip
          title="活动链接有效性检查"
          width="300"
          class="ml10 fs18"
          v-if="form.activityUrl"
          :content="`请打开下面地址检查 '${form.activityUrl}' 是否有效`"
          checkURL="https://tool.dnspod.cn/"
        />
      </el-form-item>

      <el-form-item label="活动日期:" prop="dateTime">
        <el-date-picker
          v-model="form.dateTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button
          type="primary"
          @click="sureBtn('form')"
          :disabled="isSubmitting"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { joined, recompose } from "@/api/marketing/planning";
import upload from "@/components/upload/index.vue";
import { optionComStatus, optionJumpType } from "@/util/util";
import linkTip from "@/components/link-tip/index.vue";

export default {
  components: {
    upload,
    linkTip,
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      options: optionJumpType,
      optionComStatus: optionComStatus,
      dialogVisible: false,
      classification: 1, //判断是新增还是编辑
      isSubmitting: false, // 标记当前是否正在提交表单
      form: {
        id: "",
        title: "新增活动",
        posterBucketName: "PUBLIC", //存储海报的桶 1
        posterFileName: "", //海报图片名称 1
        activityTilte: "", //活动标题 1
        activityDescription: "", //活动描述 1
        activityUrl: "", //活动链接 1
        activityStartTime: "", //活动开始时间1
        activityEndTime: "", //活动结束时间1
        status: "ON", //启用状态 1
        urlType: "", //链接类型
        dateTime: [],
      },
      dateant: [], //活动日期
      imageUrl: "", //上传之后的图片地址
      fileList: [], //图片上传之后显示数据
      videotoken: {}, //图片上传token传参获取
      rules: {
        activityTilte: [
          { required: true, message: "请输入活动标题", trigger: "blur" },
        ],
        activityDescription: [
          { required: true, message: "请输入活动描述", trigger: "blur" },
        ],
        urlType: [
          {
            required: true,
            message: "请选择链接类型",
            trigger: "change",
          },
        ],
        activityUrl: [
          { required: true, message: "请输入活动链接", trigger: "blur" },
          {
            required: true,
            max: 500,
            message: "最大字符长度500",
            trigger: "blur",
          },
        ],
        activityUrl: [
          { required: true, message: "请输入活动链接", trigger: "blur" },
          {
            required: true,
            max: 500,
            message: "最大字符长度500",
            trigger: "blur",
          },
        ],
        dateTime: [
          {
            type: "array",
            required: true,
            message: "请选择活动日期",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.classification = 2;
      this.copyreader();
    } else {
      this.classification = 1;
    }
  },

  methods: {
    copyreader() {
      this.fileList = [{ url: this.row.posterFileUrl }];
      this.imageUrl = this.row.posterFileUrl;
      this.form.dateTime = [
        this.row.activityStartTime,
        this.row.activityEndTime,
      ];
      this.form.title = "编辑活动";
      this.form.status = this.row.status;
      this.form.posterFileName = this.row.posterFileName;
      this.form.activityTilte = this.row.activityTilte;
      this.form.activityDescription = this.row.activityDescription;
      this.form.activityUrl = this.row.activityUrl;
      this.form.urlType = this.row.urlType;
      this.form.id = this.row.id;
    },
    handleChange(data) {
      if (data.length) {
        this.form.posterFileName = data[0].key;
      } else {
        this.form.posterFileName = "";
      }
    },

    sureBtn(formName) {
      if (this.isSubmitting) {
        return;
      }
      if (!this.form.posterFileName) {
        this.$message.error("请上传活动海报");
        return;
      }
      this.form.activityStartTime = this.form.dateTime[0];
      this.form.activityEndTime = this.form.dateTime[1];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isSubmitting = true;
          setTimeout(() => {
            this.isSubmitting = false;
          }, 2000);
          if (this.classification == 1) {
            joined(this.form).then(() => {
              this.$emit("liastnevtuo");
              this.$message.success("新增成功");
              this.row.callback(true);
            });
          } else if (this.classification == 2) {
            recompose(this.form).then(() => {
              this.$emit("liastnevtuo");
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
