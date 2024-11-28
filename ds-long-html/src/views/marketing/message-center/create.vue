<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      :disabled="row.id != null"
    >
      <el-form-item label="消息描述: " prop="msgDescription">
        <el-input
          placeholder="请输入话题"
          v-model="ruleForm.msgDescription"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="标题: " prop="msgTitle">
        <el-input
          placeholder="请输入消息描述"
          v-model="ruleForm.msgTitle"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="内容: " prop="msgContent">
        <el-input
          placeholder="请输入内容"
          v-model="ruleForm.msgContent"
          clearable
          type="textarea"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="图片: ">
        <!-- :disabled="scope.type === 'view' ? true : false" -->
        <!-- <template slot="imageForm" slot-scope="scope"> -->
        <upload
          bucketType="AD"
          @onChange="handleChangeCover"
          :W2HRate="0"
          :maxFileSize="20"
          :limit="1"
          title="图片上传"
          :fileList="fileList"
        />
        <!-- </template> -->
      </el-form-item>

      <el-form-item label="目标用户:">
        <el-radio-group v-model="ruleForm.targetUser">
          <el-radio
            v-for="item in optionsUserType"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.targetUser == EnumUSERTYPE.part"
        prop="appUserIds"
      >
        <el-select
          v-model="ruleForm.appUserIds"
          placeholder="请选择部分用户"
          clearable
          filterable
          multiple
        >
          <el-option
            v-for="item in optUser"
            :key="item.userId"
            :label="item.username"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="后续动作:">
        <el-radio-group v-model="ruleForm.followUpAction" @change="changeData">
          <el-radio
            v-for="item in optionsActionType"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="followUpActionDetails"
        v-if="ruleForm.followUpAction == EnumACTIONTYPE.URL"
      >
        <el-input
          placeholder="请输入以Http/Https开头的URL地址"
          v-model="ruleForm.followUpActionDetails"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.followUpAction == EnumACTIONTYPE.PAGE">
        <el-input
          placeholder="请输入跳转路由"
          v-model="ruleForm.followUpActionDetails"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="消息状态:" v-if="row.id">
        <el-input v-model="ruleForm.status" clearable> </el-input>
      </el-form-item>
      <el-form-item label="是否推送:">
        <el-radio-group v-model="ruleForm.isSend">
          <el-radio :label="true">推送</el-radio>
          <el-radio :label="false">不推送</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="推送时间:">
        <el-radio-group v-model="ruleForm.sendWay">
          <el-radio
            v-for="item in optionsPushTimeType"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="推送时间:"
        prop="sendTime"
        v-if="ruleForm.sendWay == EnumPUSHTIMETYPE.TIME || row.id"
      >
        <el-date-picker
          v-model="ruleForm.sendTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          popper-class="hide-time"
          :picker-options="{
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            },
          }"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item style="text-align: right" v-if="!row.id">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  queryList,
  addObj,
  putObj,
  cancel,
  putObjView,
} from "@/api/marketing/message-center";
import upload from "@/components/upload/index";
import { querySmgUser } from "@/api/common";
import { verificationTime, checkUrl } from "@/util/validate.js";

import {
  debounceCallBack,
  optionsUserType,
  EnumUSERTYPE,
  optionsActionType,
  EnumACTIONTYPE,
  optionsPushTimeType,
  EnumPUSHTIMETYPE,
  optionsMessageType,
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
  components: {
    upload,
  },
  data() {
    return {
      optUser: [],
      fileList: [],
      optionsUserType: optionsUserType,
      optionsActionType: optionsActionType,
      EnumUSERTYPE: EnumUSERTYPE,
      EnumACTIONTYPE: EnumACTIONTYPE,
      optionsPushTimeType: optionsPushTimeType,
      EnumPUSHTIMETYPE: EnumPUSHTIMETYPE,
      ruleForm: {
        id: "",
        msgDescription: "",
        msgTitle: "",
        msgContent: "",
        targetUser: EnumUSERTYPE.all,
        appUserIds: "",
        followUpAction: EnumACTIONTYPE.APP,
        followUpActionDetails: "",
        isSend: true,
        sendWay: EnumPUSHTIMETYPE.NOW,
        sendTime: "",
      },
      rules: {
        msgDescription: [
          {
            required: true,
            message: "消息描述不能为空",
            trigger: "blur",
          },
        ],
        msgTitle: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur",
          },
        ],
        msgContent: [
          {
            required: true,
            message: "内容不能为空",
            trigger: "blur",
          },
        ],
        sendTime: [
          {
            required: true,
            message: "请选择推送时间",
          },
          { validator: verificationTime, trigger: "blur" },
        ],
        appUserIds: [
          {
            required: true,
            message: "至少选择一个用户",
            trigger: "change",
          },
        ],
        followUpActionDetails: [
          { required: true, message: "URL地址不能为空" },
          { validator: checkUrl, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.gitSmgUser();
    if (this.row.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      let status = optionsMessageType.find(
        (item) => item.id === this.row.status
      )?.name;
      this.ruleForm.id = this.row.id;
      this.ruleForm.msgDescription = this.row.msgDescription;
      this.ruleForm.msgTitle = this.row.msgTitle;
      this.ruleForm.msgContent = this.row.msgContent;
      this.ruleForm.targetUser = this.row.targetUser;
      this.ruleForm.appUserIds = this.row.sendUserName;
      this.ruleForm.followUpAction = this.row.followUpAction;
      this.ruleForm.followUpActionDetails = this.row.followUpActionDetails;
      this.ruleForm.isSend = this.row.isSend;
      this.ruleForm.sendWay = this.row.sendWay;
      this.ruleForm.sendTime = this.row.sendTime;
      this.ruleForm.status = status || "";
      this.fileList = [{ url: this.row.msgImg }];
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
      const params = {
        ...this.ruleForm,
      };
      if (!this.ruleForm.id) {
        const comSubmit = () => {
          return addObj(params).then((res) => {
            if (res.data.code == 200) {
              this.row.callback(true);
              this.$message.success("新增成功");
              return Promise.resolve();
            }
          });
        };
        debounceCallBack(comSubmit)();
      }
      // else {
      //   substanceTopicUpdate(params).then((res) => {
      //     if (res.data.code == 200) {
      //       this.row.callback(true);
      //       this.$message.success("编辑成功");
      //     }
      //   });
      // }
    },
    gitSmgUser() {
      querySmgUser({ current: 1, size: 10000 }).then((res) => {
        this.optUser = res.data.data.records;
      });
    },
    changeData(val) {
      console.log(this.ruleForm.followUpAction);

      if (this.ruleForm.followUpAction == EnumACTIONTYPE.URL) {
        this.ruleForm.followUpActionDetails = "";
      } else if (this.ruleForm.followUpAction == EnumACTIONTYPE.PAGE) {
        this.$refs.ruleForm.clearValidate();
        this.ruleForm.followUpActionDetails = "";
      }
    },
    handleChangeCover(data) {
      console.log(data);
      if (data.length) {
        this.imageUrl = data[0].key;
        this.ruleForm.msgImgBucket = data[0].bucketName;
        this.ruleForm.msgImgFilename = data[0].key;
      } else {
        this.ruleForm.msgImgBucket = "";
        this.ruleForm.msgImgFilename = "";
      }
    },
  },
};
</script>
