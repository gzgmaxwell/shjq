<template>
  <div style="margin-top: -20px">
    <el-form :model="form" ref="form" label-width="90px" class="demo-ruleForm">
      <el-row class="p10 border">
        <el-col :span="12">
          <el-form-item label="作品名称:" prop="name">
            <el-input
              disabled
              placeholder="请输入作品名称..."
              v-model="form.name"
              maxlength="80"
              minlength="1"
              type="textarea"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者:" prop="authorId">
            <el-select
              v-model="form.authorId"
              remote
              filterable
              clearable
              reserve-keyword
              disabled
              placeholder="请输入作者名"
            >
              <template v-for="(result, i) in optionAuthor">
                <el-option
                  v-if="optionAuthor.length"
                  :key="i"
                  :label="result.nickName"
                  :value="result.id"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容简介:" prop="intro">
            <el-input
              disabled
              :autosize="{ minRows: 10, maxRows: 10 }"
              placeholder="请输入内容简介..."
              show-word-limit
              maxlength="800"
              type="textarea"
              v-model="form.intro"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="mt20 p10">
        <el-col :span="12">
          <el-form-item label="漫画封面图:">
            <div>
              <img
                v-if="row.coverImageUrl"
                class="ml10"
                :src="row.coverImageUrl"
                alt=""
                width="160"
                height="90"
                style="object-fit: cover"
              />
              <!-- <img
                class="ml10"
                v-if="row.verticalCoverUrl"
                :src="row.verticalCoverUrl"
                alt=""
                width="67"
                height="90"
              /> -->
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP标签" prop="classifyId">
            <el-select v-model="form.classifyId" clearable multiple disabled>
              <el-option
                v-for="item in optionClassify"
                :key="item.id"
                :value="item.id"
                :label="item.classifyName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { classifyDefault } from "@/api/admin/index";
import { dsUserList } from "@/api/userList";
// import sidVideoPlayer from "@/components/video-player";
import { mapGetters } from "vuex";
export default {
  components: {
    // sidVideoPlayer,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    webPageMenu: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      optionAuthor: [],
      optionClassify: [],
      form: {
        name: "",
        intro: "",
        authorId: "",
        classifyId: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      adminTag: "adminTag",
    }),
  },
  mounted() {
    this.optionClassify = this.classifyOptions || [];
    this.getClassifyDefault();
  },
  methods: {
    getClassifyDefault() {
      classifyDefault().then((res) => {
        this.classifyDefaultArray = res.data?.data || [];
        this.getInfo();
      });
    },
    async getAuthorName() {
      let { data: res } = await dsUserList({
        current: 1,
        size: 20,
      });
      this.optionAuthor = res.data.records;
      this.comHandleAuthor(this.optionAuthor);
    },
    comHandleAuthor(arr) {
      const isTrue = arr.some((v) => v.id === this.row.authorId);
      if (!isTrue && this.row.authorId) {
        const v = {
          id: this.row.authorId,
          nickName: this.row.authorNickName,
        };
        this.optionAuthor.push(v);
      }
    },
    getInfo() {
      let classifyIdArr;
      if (this.row.classifyId) {
        classifyIdArr = this.row.classifyId?.split(",");
      } else {
        classifyIdArr = this.classifyDefaultArray.map((item) => item.id);
      }
      this.form.name = this.row.name;
      this.form.intro = this.row.intro;
      this.form.authorId = this.row.authorId;
      this.form.classifyId = classifyIdArr;
      this.getAuthorName();
    },
  },
};
</script>
