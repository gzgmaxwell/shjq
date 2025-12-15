<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="130px"
    class="demo-ruleForm"
  >
    <el-form-item label="视频平台">
      <el-radio-group
        v-model="ruleForm.registerBusPlatformId"
        :disabled="row.id ? true : false"
      >
        <el-radio v-for="item in optLong" :label="item.id" :key="item.id">{{
          item.name
        }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 平台 -->
    <el-form-item label="平台">
      <el-radio-group v-model="ruleForm.platform">
        <el-radio label="ANDROID">Android</el-radio>
        <el-radio label="IOS">IOS</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="是否上线">
      <el-radio-group v-model="ruleForm.online">
        <el-radio :label="true">正式上线</el-radio>
        <el-radio :label="false">预上线</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 是否强制更新 -->
    <el-form-item label="是否强制更新" prop="forceUpdate">
      <el-radio-group v-model="ruleForm.forceUpdate">
        <el-radio
          v-for="item in optionsVersionUpdate"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <!-- 强制同步给租户 -->
    <el-form-item
      label="强制同步给租户"
      v-if="permissions.sys_version_synchronousTenant"
    >
      <el-radio-group v-model="ruleForm.copyTenant">
        <el-radio
          v-for="item in optAutoPackag"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <!-- 官方版本号 -->
    <el-form-item label="官方版本号" prop="versionOfficial">
      <el-input
        style="width: 65%"
        v-model="ruleForm.versionOfficial"
        placeholder="请输入官方版本号"
        clearable
        :disabled="ruleForm.platform === deviceENUM.ANDROID"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <span slot="label">
        <span class="must">*</span>
        更新内容
      </span>
      <wangEditor
        :row="paramsRow"
        :strLenConfig="strLenConfig"
        :height="180"
        :menus="[
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'link',
          'foreColor',
          'backColor',
          'undo',
          'redo',
        ]"
      />
    </el-form-item>
    <!-- 推送时间 -->
    <el-form-item label="推送时间" prop="pushTime">
      <el-date-picker
        style="width: 65%"
        v-model="ruleForm.pushTime"
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
      ></el-date-picker>
    </el-form-item>
    <!-- 全量包  -->
    <el-form-item
      label="全量包"
      prop="apkFileName"
      v-if="ruleForm.platform === deviceENUM.ANDROID"
    >
      <div class="fileHead" v-if="fileList && fileList.length > 0">
        <div>档案</div>
        <div>包名</div>
        <div>专属用户ID</div>
        <div>{{ $t("enableThisVersion") }}</div>
        <div>{{ $t("downloadWebsite") }}</div>
        <div>{{ $t("abandoned") }}</div>
      </div>
      <div class="fileContainer" v-if="fileList && fileList.length > 0">
        <div v-for="(file, index) in fileList" :key="index">
          <div class="fileRow">
            <span class="rowIndex">{{ index + 1 }}</span>
            <div class="nameRow">
              <span>{{ file.name }}</span>
              <span class="package">{{ file.package }}</span>
            </div>
            <div class="action" v-if="!file.loading">
              <span class="file-switch-area">
                <el-input
                  v-model="file.channelUserId"
                  @input="$forceUpdate()"
                  class="numberInput"
                  placeholder="用户ID"
                />
              </span>
              <!-- 啟用此版本 -->
              <span class="file-switch-area">
                <el-switch
                  v-model="file.enable"
                  @change="onChangeEnable($event, file)"
                ></el-switch>
              </span>
              <!-- 下载网址 -->
              <span class="file-switch-area">
                <el-switch
                  v-model="file.openUrl"
                  @change="onChangOpenUrl($event, file, fileList)"
                ></el-switch>
              </span>
              <!-- 废弃 -->
              <span class="file-switch-area">
                <el-switch
                  v-model="file.abandon"
                  @change="onChangeAbandon($event, file)"
                ></el-switch>
              </span>
            </div>
            <span
              v-if="!file.loading"
              class="remove"
              @click="handleRemoveFileList(index)"
              >X</span
            >
          </div>
          <el-progress
            v-if="file.loading"
            :stroke-width="5"
            :percentage="file.progress"
          />
        </div>
      </div>
      <el-upload
        :file-list="fileList"
        action="/"
        :accept="accept"
        :http-request="icontiate"
        list-type="text"
        :before-upload="beforeAvatarUpload"
        multiple
        :show-file-list="false"
      >
        <el-button slot="trigger" size="small" type="primary">上传</el-button>
      </el-upload>
    </el-form-item>
    <!-- 超级簽 -->
    <el-form-item label="超级签" v-else>
      <div class="superHead" v-if="tagList && tagList.length > 0">
        <div style="padding-left: 12px">下载地址</div>
        <div>识别码</div>
        <div>专属用户ID</div>
        <div>{{ $t("enableThisVersion") }}</div>
        <div>{{ $t("downloadWebsite") }}</div>
        <div>{{ $t("abandoned") }}</div>
      </div>
      <ul class="superContainer" v-if="tagList && tagList.length > 0">
        <li
          class="super-tag-list"
          v-for="(data, index) in tagList"
          :key="index"
        >
          <span class="rowIndex">{{ index + 1 }}</span>
          <el-input v-model="data.storeUrl" style="width: 390px"></el-input>
          <el-input
            v-model="data.channelCode"
            @input="$forceUpdate()"
            style="width: 120px; margin: 0px 4px"
            placeholder="识别码"
          ></el-input>

          <div class="action">
            <span class="file-switch-area">
              <el-input
                v-model="data.channelUserId"
                style="width: 120px"
                placeholder="用户ID"
              />
            </span>
            <!-- 啟用此版本 -->
            <span class="file-switch-area">
              <el-switch
                v-model="data.enable"
                @change="onChangeEnable($event, data)"
              ></el-switch>
            </span>
            <!-- 下载网址 -->
            <span class="file-switch-area">
              <el-switch
                v-model="data.openUrl"
                @change="onChangOpenUrl($event, data, tagList)"
              ></el-switch>
            </span>
            <!-- 废弃 -->
            <span class="file-switch-area">
              <el-switch
                v-model="data.abandon"
                @change="onChangeAbandon($event, data)"
              ></el-switch>
            </span>
          </div>
          <span class="remove" @click="handleRemoveTagList(index)">X</span>
        </li>
      </ul>
      <div style="overflow-y: hidden">
        <el-upload
          :file-list="fileList"
          action="/"
          :accept="accept"
          :http-request="(file) => httpRequest(file)"
          list-type="text"
          :before-upload="beforeAvatarUpload"
          multiple
          :show-file-list="false"
        >
          <el-button slot="trigger" size="small" type="primary">上传</el-button>
        </el-upload>
        <div
          class="fileContainer"
          v-if="fileList && fileList.length > 0"
          style="overflow-y: hidden"
        >
          <div v-for="(file, index) in fileList" :key="index">
            <el-progress
              v-if="file.loading"
              :stroke-width="5"
              :percentage="file.progress"
            />
          </div>
        </div>
      </div>
    </el-form-item>

    <el-form-item style="margin-left: 28%">
      <el-button @click="row.callback && row.callback()">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { AwsUpdatePicture } from "@/util/upload";
import { getBucketInfo } from "@/api/video-manage/video-audit";
// import AWS from "aws-sdk";
var AWS = require("aws-sdk/global");
var S3 = require("aws-sdk/clients/s3");

import { verificationTime } from "@/util/validate.js";
import AppInfoParser from "app-info-parser";
import { addObj, putObj } from "@/api/admin/version";
import wangEditor from "@/components/wangEditor/index.vue";
import {
  debounceCallBack,
  optionsVersionType,
  optionsVersionUpdate,
  ENUM_VERSIONUPDATE_STATUS,
  optLong,
  EnumVideoTime,
  EnumVERSIONTYPE,
  optAutoPackag,
  EnumAutoPackag,
} from "@/util/util";
import { mapGetters } from "vuex";

const deviceENUM = { ANDROID: "ANDROID", IOS: "IOS" };
export default {
  components: {
    wangEditor,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      optLong: optLong,
      strLenConfig: 1000,
      deviceENUM,
      accept: ".apk,.ipa",
      maxFileSize: 1000000,
      instanceAWS: null,
      bucketInfo: null,
      bucketEnum: null,
      optionsVersionType: optionsVersionType,
      optionsVersionUpdate: optionsVersionUpdate,
      optAutoPackag: optAutoPackag,
      fileList: [],
      tagList: [],
      strLen: 0,
      paramsRow: {
        onChange: (event) => {
          const html = event.txt.html();
          this.ruleForm.updateContent = html;
          this.strLen = event.txt.text().length;
        },
        htmlContent: "",
      },
      percentage: 0,
      ruleForm: {
        registerBusPlatformId: EnumVideoTime.long,
        version: "",
        versionOfficial: "",
        online: false,
        platform: deviceENUM.ANDROID,
        forceUpdate: ENUM_VERSIONUPDATE_STATUS.yes,
        copyTenant: EnumAutoPackag.no,
        pushTime: "",
        updateContent: "",
      },
      rules: {
        forceUpdate: [
          {
            required: true,
            message: "请选择是否强制更新",
            trigger: "blur",
          },
        ],
        updateContent: [
          {
            required: true,
            message: "请输入更新内容",
            trigger: "blur",
          },
        ],
        pushTime: [
          {
            required: true,
            message: "请选择推送时间",
          },
          { validator: verificationTime, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
  },
  mounted() {
    this.getS3Info();
    if (this.row.id) {
      this.getRow();
      this.rules.pushTime = [
        {
          required: true,
          message: "请选择推送时间",
          trigger: "blur",
        },
      ];
    } else {
      this.rules.pushTime = [
        {
          required: true,
          message: "请选择推送时间",
        },
        { validator: verificationTime, trigger: "blur" },
      ];
    }
  },
  methods: {
    onChangeEnable(event, data) {
      if (data.openUrl) {
        if (this.ruleForm.platform === deviceENUM.ANDROID) {
          this.$message.warning(
            "下载网址开启时，无法关闭该包名启用此版本app。"
          );
        } else {
          this.$message.warning(
            "下载网址开启时，无法关闭该超级簽启用此版本app。"
          );
        }
        data.enable = true;
        return;
      }
      data.enable = event;
      data.abandon = false;
      this.$forceUpdate();
    },
    onChangOpenUrl(event, data, list) {
      data.enable = true;
      data.openUrl = event;
      data.abandon = false;
      this.$forceUpdate();
    },
    onChangeAbandon(event, data) {
      data.abandon = event;
      if (event) {
        data.enable = false;
        data.openUrl = false;
      }
      this.$forceUpdate();
    },
    getS3Info() {
      getBucketInfo("FILE").then((res) => {
        const { data } = res;
        this.bucketInfo = data.data;
        this.bucketEnum = data.data.bucketEnum;
        const {
          accessKey: accessKeyId,
          secretKey: secretAccessKey,
          sessionToken,
          region,
        } = data.data;
        let cred = new AWS.Credentials(
          accessKeyId,
          secretAccessKey,
          sessionToken
        );

        // this.instanceAWS = new AWS.S3({
        this.instanceAWS = new S3({
          region: region,
          credentials: cred,
        });
      });
    },
    handleRemoveFileList(idx) {
      this.fileList = this.fileList.filter((d, i) => i !== idx);
    },
    handleRemoveTagList(idx) {
      this.tagList = this.tagList.filter((d, i) => i !== idx);
    },
    // 上传图片前定义格式
    beforeAvatarUpload(file) {
      const isMB = file.size / 1024 / 1024;
      if (isMB > this.maxFileSize) {
        this.$message.warning(`上传文件不能超过${this.maxFileSize}MB`);
        return false;
      }
      if (this.accept.includes(".apk,.ipa")) {
        const packageArray = ["apk", "ipa"];
        const fileExtension = file.name.substr(file.name.lastIndexOf(".") + 1);
        if (!packageArray.includes(fileExtension)) {
          this.$message.warning(`只能上传 ${packageArray} 格式文件`);
          return false;
        }
      }

      return file;
    },
    icontiate(file) {
      const that = this;
      const tempFile = file.file;
      tempFile.loading = true;
      tempFile.enable = false;
      tempFile.openUrl = false;
      tempFile.abandon = false;

      const parser = new AppInfoParser(file.file);
      parser
        .parse()
        .then((res) => {
          //打印获取所需apk文件信息
          tempFile.package = res.package;
          if (res.versionName) {
            this.ruleForm.versionOfficial = res.versionName;
          } else {
            this.ruleForm.versionOfficial = res.CFBundleShortVersionString;
          }
        })
        .catch((err) => {});

      this.fileList.push(file.file);

      AwsUpdatePicture(tempFile, this.bucketInfo, this.instanceAWS, (event) => {
        let progress = Math.round((event.loaded / event.total) * 100);
        tempFile.progress = progress;
        that.$forceUpdate();
      }).then((res) => {
        tempFile.loading = false;
        tempFile.apkFileName = res.service.config.params.Key;
        tempFile.apkBucketName = that.bucketEnum;
        that.$forceUpdate();
      });
    },
    httpRequest(file) {
      const that = this;
      const tempFile = file.file;
      tempFile.loading = true;
      tempFile.enable = false;
      tempFile.openUrl = false;
      tempFile.abandon = false;
      const parser = new AppInfoParser(file.file);
      parser
        .parse()
        .then((res) => {
          //打印获取所需apk文件信息
          tempFile.package = res.package;
          if (res.versionName) {
            this.ruleForm.versionOfficial = res.versionName;
          } else {
            this.ruleForm.versionOfficial = res.CFBundleShortVersionString;
          }
        })
        .catch((err) => {});

      this.fileList.push(file.file);

      AwsUpdatePicture(tempFile, this.bucketInfo, this.instanceAWS, (event) => {
        let progress = Math.round((event.loaded / event.total) * 100);
        tempFile.progress = progress;
        that.$forceUpdate();
      }).then((res) => {
        tempFile.loading = false;
        this.tagList.push({
          storeUrl: "",
          openUrl: false,
          enable: false,
          abandon: false,
          apkFileName: res.service.config.params.Key,
          apkBucketName: that.bucketEnum,
        });
        that.$forceUpdate();
      });
    },
    getRow() {
      this.ruleForm = {
        registerBusPlatformId: this.row.registerBusPlatformId,
        version: this.row.version,
        versionOfficial: this.row.versionOfficial,
        platform: this.row.platform,
        pushTime: this.row.pushTime,
        forceUpdate: this.row.forceUpdate,
        copyTenant: this.row.copyTenant,
        updateContent: this.row.updateContent,
        id: this.row.id,
        online: this.row.online,
      };
      if (this.row.platform === deviceENUM.ANDROID) {
        this.fileList =
          this.row.fieldDataDTOList.map((d) => ({
            ...d,
            name: d.apkFileName,
            package: d.packageName,
            progress: 100,
          })) || [];
      } else {
        this.tagList =
          this.row.fieldDataDTOList.map((d) => ({
            ...d,
          })) || [];
      }

      if (this.row.updateContent) {
        this.paramsRow.htmlContent = this.row.updateContent;
      }
    },
    comSubmit(apiFunc) {
      const params = {
        registerBusPlatformId: this.ruleForm.registerBusPlatformId,
        version: "",
        versionOfficial: this.ruleForm.versionOfficial,
        platform: this.ruleForm.platform,
        forceUpdate: this.ruleForm.forceUpdate,
        copyTenant: this.ruleForm.copyTenant,
        pushTime: this.ruleForm.pushTime,
        updateContent: this.ruleForm.updateContent,
        id: this.ruleForm.id,
        online: this.ruleForm.online,
      };
      if (this.ruleForm.platform === deviceENUM.ANDROID) {
        params.fieldDataDTOList = this.fileList.map((d) => ({
          abandon: d.abandon,
          apkBucketName: d.apkBucketName,
          apkFileName: d.apkFileName,
          enable: d.enable,
          openUrl: d.openUrl,
          packageName: d.package,
          channelUserId: d.channelUserId,
          id: d.id,
        }));
      } else {
        params.fieldDataDTOList = this.tagList;
      }
      return apiFunc(params).then(() => {
        const successMsg = this.row.id ? "编辑成功" : "新增成功";
        this.$message.success(successMsg);
        this.row.callback(true);
        return Promise.resolve();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.strLen > this.strLenConfig) {
          return this.$message.warning(
            `更新内容最大长度为${this.strLenConfig}`
          );
        }
        if (valid) {
          if (this.ruleForm.platform === deviceENUM.IOS) {
            if (this.tagList.length === 0) {
              return this.$message.warning("请新增超级簽");
            }

            if (this.tagList.find((d) => !d.storeUrl)) {
              return this.$message.warning("请输入超级簽内容");
            }

            let isFindDuplicate = false;

            this.tagList.forEach((d) => {
              const findDuplicateOpen = this.tagList.filter(
                (item) => item.channelUserId === d.channelUserId && item.openUrl
              );
              if (findDuplicateOpen.length > 1) {
                if (d.channelUserId) {
                  this.$message.warning(
                    "同一专属用户ID只能开启一个下载网址，用户ID:" +
                      d.channelUserId
                  );
                } else {
                  this.$message.warning("官方只能开启一个下载网址");
                }
                isFindDuplicate = true;
              }
            });
            if (isFindDuplicate) {
              return;
            }
          }

          if (this.ruleForm.platform === deviceENUM.ANDROID) {
            if (this.fileList.length === 0) {
              return this.$message.warning("请上传全量包");
            }

            if (this.fileList.find((d) => d.progress !== 100)) {
              return this.$message.warning("请等待档案上传完");
            }

            let isFindDuplicate = false;

            this.fileList.forEach((d) => {
              const findDuplicateOpen = this.fileList.filter(
                (item) => item.channelUserId === d.channelUserId && item.openUrl
              );
              if (findDuplicateOpen.length > 1) {
                if (d.channelUserId) {
                  this.$message.warning(
                    "同一专属用户ID只能开启一个下载网址，用户ID:" +
                      d.channelUserId
                  );
                } else {
                  this.$message.warning("官方只能开启一个下载网址");
                }
                isFindDuplicate = true;
              }
            });
            if (isFindDuplicate) {
              return;
            }
          }

          if (!this.row.id) {
            debounceCallBack(() => this.comSubmit(addObj))();
          } else {
            debounceCallBack(() => this.comSubmit(putObj))();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-progress {
  margin: 0;
  padding: 0;
}

.super-tag-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-input {
    width: 50%;
  }
  .rowIndex {
    padding: 0px 4px;
  }
  margin-bottom: 10px;
}

.file-switch-area {
  margin: 0px 4px;
}

.fileRow {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  .rowIndex {
    padding: 0px 4px;
  }

  .nameRow {
    line-height: 22px;
    border: 1px solid black;
    padding: 0px 4px;
    margin: 4px 0px;
    width: 516px;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .package {
    margin-left: auto;
    min-width: 140px;
    padding-left: 4px;
  }
}

.action {
  margin: 0px 4px;
  display: flex;
  justify-content: space-between;
  width: 412px;
}

.remove {
  color: gray;
  cursor: pointer;
  margin-left: auto;
  margin-right: 10px;

  &:hover {
    color: black;
  }
}

.superContainer {
  margin: 0;
  padding: 0;
  max-height: 180px;
  overflow: auto;
}

.fileContainer {
  max-height: 180px;
  overflow: auto;
}

.fileHead,
.superHead {
  display: grid;
  grid-template-columns: 409px 131px 176px 93px 97px 83px 82px;
}

.numberInput {
  width: 120px;
}

::v-deep .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
  padding-right: 30px;
}
</style>
