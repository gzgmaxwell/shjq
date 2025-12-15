<template>
  <div>
    <el-form :model="form" ref="form" label-width="110px" class="demo-ruleForm">
      <el-form-item label="作品名称" required>
        <el-input
          class="textarea-input"
          placeholder="请输入作品名称"
          v-model="form.name"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="作者" required>
        <el-select
          v-model="form.authorId"
          remote
          filterable
          clearable
          reserve-keyword
          placeholder="请输入作者"
          :remote-method="remoteMethod"
          disabled
        >
          <template v-if="optionAuthor.length">
            <el-option
              v-for="(result, i) in optionAuthor"
              :key="i"
              :value="result.id"
              :label="result.nickName"
            >
              <span style="float: left">{{ result.nickName }}</span>
              <span style="float: right" class="must">{{
                compLabel(result)
              }}</span>
            </el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <span slot="label"><span class="must">*</span>封面</span>
        <el-image
          style="width: 150px; height: 150px"
          :src="form.coverImageUrl"
        ></el-image>
      </el-form-item>
      <el-form-item label="简介" required>
        <el-input
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入简介"
          show-word-limit
          maxlength="800"
          type="textarea"
          v-model="form.intro"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="APP标签标签" required>
        <el-select
          v-model="form.classifyIds"
          placeholder="请选择APP标签"
          clearable
          multiple
          disabled
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
      <el-form-item label="状态" required>
        <el-radio-group v-model="form.status" disabled>
          <el-radio
            v-for="item in optCartoonStatus"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="篇幅" required>
        <el-radio-group v-model="form.space" disabled>
          <el-radio
            v-for="item in optCartoonSpace"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item style="text-align: right">
        <el-button @click="row.callback && row.callback()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { classifyDefault } from "@/api/admin/index";
import { dsUserList } from "@/api/userList";
import {
  AuthorStatus,
  ENUM_USER_STATUS,
  optCartoonStatus,
  optCartoonSpace,
  EnumCartoonStatus,
  EnumCartoonSpace,
  EnumCartoonType,
} from "@/util/util";
import { mapGetters } from "vuex";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    type: {
      type: String,
      required: false,
      default: EnumCartoonType.comic,
    },
  },
  data() {
    return {
      optCartoonStatus: optCartoonStatus,
      optCartoonSpace: optCartoonSpace,
      classifyDefaultArray: [],
      optionAuthor: [],
      form: {
        name: "",
        authorId: "",
        intro: "",
        classifyIds: [],
        status: EnumCartoonStatus.start,
        space: EnumCartoonSpace.short,
        coverImageUrl: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
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
  mounted() {
    this.getClassifyDefault();
  },

  methods: {
    async getClassifyDefault() {
      let { data: res } = await classifyDefault();
      this.classifyDefaultArray = res?.data || [];
      this.form.classifyIds = this.classifyDefaultArray.map((item) => item.id);
      if (this.row.id) {
        this.remoteMethod(this.row.authorNickName);
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
      this.form.classifyIds = this.row.classifyIds;
      this.form.status = this.row.status;
      this.form.space = this.row.space;
      this.form.coverImageUrl = this.row.coverImageUrl;
    },
  },
};
</script>
