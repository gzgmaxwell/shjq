<template>
  <el-dialog
    :title="row.id ? '编辑' : '新增'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :before-close="handleClose"
    width="50%"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="作品名称" prop="name">
        <el-input
          class="textarea-input"
          placeholder="请输入作品名称"
          :disabled="check"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="authorId">
        <el-select
          v-model="form.authorId"
          remote
          filterable
          clearable
          :disabled="check"
          reserve-keyword
          placeholder="请输入作者"
          :remote-method="remoteMethod"
        >
          <el-option
            v-if="optionAuthor.length"
            v-for="(result, i) in optionAuthor"
            :key="i"
            :value="result.id"
            :label="result.nickName"
            :disabled="result.status !== 'ENABLE'"
          >
            <span style="float: left">{{ result.nickName }}</span>
            <span style="float: right" class="must">{{
              compLabel(result)
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三方作者" prop="name" v-if="author">
        <el-input
          class="textarea-input"
          disabled
          placeholder="请输入作品名称"
          v-model="row.thirdAuthorName"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <span slot="label"><span class="must">*</span>封面</span>
        <upload
          v-if="!check"
          bucketType="INK_LORE"
          ref="uploadRef"
          accept="image/png,image/jpg,image/jpeg,image/bmp,image/svg,image/webp,image/gif"
          :maxFileSize="10"
          :W2HRate="3 / 4"
          :W2HRateOrigin="W2HRateOrigin"
          @onChange="handleChange"
          :limit="1"
          :fileList="fileList"
          :isW2HRateTip="false"
          :isDetailsShow="check"
        />
        <img
          v-if="check"
          :src="row.coverImageUrl"
          style="max-width: 126px; max-height: 126px"
        />
        <div style="margin-top: -15px; font-size: 12px" v-if="!check">
          请上传宽高比{{ W2HRateOrigin.width }}:{{ W2HRateOrigin.height }}，
          格式为：png，jpg，jpeg，bmp，svg，webp，gif的文件
        </div>
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <el-input
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入简介"
          show-word-limit
          maxlength="800"
          type="textarea"
          v-model="form.intro"
          :disabled="check"
        ></el-input>
      </el-form-item>
      <el-form-item label="APP标签标签" prop="classifyIds">
        <el-select
          v-model="form.classifyIds"
          placeholder="请选择APP标签"
          clearable
          multiple
          :disabled="check"
        >
          <el-option
            v-for="item in classifyOptions"
            :key="item.id"
            :value="item.id"
            :label="item.classifyName"
          >
            <span style="float: left">{{ item.classifyName }}</span>
            <span style="float: right" class="link mr20">{{
              compLabelTag(item)
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status" :disabled="check">
          <el-radio
            v-for="item in optCartoonStatus"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="篇幅" prop="space">
        <el-radio-group v-model="form.space" :disabled="check">
          <el-radio
            v-for="item in optCartoonSpace"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="submitBtn('sub')" v-if="submit"
          >提交</el-button
        >
        <el-button type="primary" @click="submitBtn('save')" v-if="!check"
          >确定</el-button
        >
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { classifyDefault } from "@/api/admin/index";
import { dsUserList } from "@/api/userList";
import upload from "@/components/upload/index.vue";
import {
  AuthorStatus,
  ENUM_USER_STATUS,
  optCartoonStatus,
  optCartoonSpace,
  EnumCartoonStatus,
  EnumCartoonSpace,
} from "@/util/util";
import { mapGetters } from "vuex";

export default {
  components: {
    upload,
  },
  data() {
    return {
      visible: false,
      author: false,
      submit: false,
      check: false,
      callback: null,
      row: {},
      type: "",
      optCartoonStatus: optCartoonStatus,
      optCartoonSpace: optCartoonSpace,
      classifyDefaultArray: [],
      optionAuthor: [],
      fileList: [],
      W2HRateOrigin: { width: 3, height: 4 },
      form: {
        name: "",
        authorId: "",
        intro: "",
        classifyIds: [],
        status: EnumCartoonStatus.start,
        space: EnumCartoonSpace.short,
        coverImageFile: "",
        coverImageBucket: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入作品名称", trigger: "blur" },
          {
            min: 1,
            max: 80,
            message: "作品名称不能超过80个字符",
            trigger: "blur",
          },
        ],
        authorId: [
          {
            required: true,
            message: "请选择作者",
            trigger: "change",
          },
        ],
        intro: [
          { required: true, message: "请输入简介", trigger: "blur" },
          {
            min: 1,
            max: 800,
            message: "简介不能超过800个字符",
            trigger: "blur",
          },
        ],

        classifyIds: [
          {
            required: true,
            message: "请选择APP标签",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
        space: [
          {
            required: true,
            message: "请选择篇幅",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      userInfo: "userInfo",
      adminTag: "adminTag",
    }),
    compLabel() {
      return (val) => {
        const item = AuthorStatus.filter(
          (item) => item.id !== ENUM_USER_STATUS.enable
        ).find((v) => v.id === val.status);
        return item?.name;
      };
    },
    compLabelTag() {
      return (val) => {
        const item = this.classifyOptions.find((v) => v.id === val.id);
        return item.classifyStatus === "1" ? "" : "隐藏";
      };
    },
  },
  methods: {
    async init() {
      this.remoteMethod();
      let { data: res } = await classifyDefault();
      this.classifyDefaultArray = res?.data || [];
      this.form.classifyIds = this.classifyDefaultArray.map((item) => item.id);
      if (this.row.id) {
        this.getInfo();
      }
    },
    async remoteMethod(query) {
      const params = {
        current: 1,
        size: 100,
        nickName: query,
      };
      let { data: res } = await dsUserList(params);
      if (query) {
        this.optionAuthor = res.data.records.filter((item) => {
          return item.nickName.indexOf(query) > -1;
        });
      } else {
        this.optionAuthor = res.data.records;
      }
      if (this.optionAuthor.length && this.row.authorId && !query) {
        const isTrue = this.optionAuthor.some(
          (v) => v.id === this.row.authorId
        );
        if (!isTrue) {
          const v = {
            id: this.row.authorId,
            nickName: this.row.authorNickName,
          };
          this.optionAuthor.push(v);
        }
      }
    },
    getInfo() {
      this.form.name = this.row.name;
      this.form.authorId = this.row.authorId;
      this.form.intro = this.row.intro;
      if (this.row.classifyIds && this.row.classifyIds.length) {
        this.form.classifyIds = this.row.classifyIds;
      }
      this.form.status = this.row.status;
      this.form.space = this.row.space;
      this.form.coverImageFile = this.row.coverImageFile;
      this.form.coverImageBucket = this.row.coverImageBucket;
      this.fileList = [
        {
          url: this.row.coverImageUrl,
          key: this.row.coverImageFile,
          bucketName: this.row.coverImageBucket,
        },
      ];
    },

    submitBtn(btnType) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.form.coverImageFile) {
            return this.$message.warning("请上传封面图");
          }
          this.commit(btnType);
        }
      });
    },
    async commit(btnType) {
      const params = {
        ...this.form,
        id: this.row?.id,
        type: this.type,
      };
      this.row.callback({
        form: params,
        handleClose: this.handleClose,
        btnType,
      });
    },

    handleChange(data) {
      if (data.length) {
        this.form.coverImageFile = data[0].key;
        this.form.coverImageBucket = data[0].bucketName;
      } else {
        this.fileList = [];
        this.form.coverImageFile = "";
      }
    },

    handleClose() {
      this.visible = false;
      this.fileList = [];
      this.author = false;
      this.submit = false;
      this.check = false;
      this.resetForm();
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>
