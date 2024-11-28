<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <span slot="label"><span class="must">*</span>简体中文</span>
        <div id="znRow">
          <wangEditor
            :row="znRow"
            editorDom="znRow"
            :height="230"
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
            ]"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <span slot="label"><span class="must">*</span>繁体中文</span>
        <div id="twRow">
          <wangEditor
            :row="twRow"
            editorDom="twRow"
            :height="230"
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
            ]"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <span slot="label"><span class="must">*</span>英文</span>
        <div id="enRow">
          <wangEditor
            :row="enRow"
            editorDom="enRow"
            :height="230"
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
            ]"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { langSaveBatch } from "@/api/content/navigation";
import { langPageConfig } from "@/api/language/index";
import upload from "@/components/upload/index.vue";
import wangEditor from "@/components/wangEditor/index.vue";
import { debounceCallBack, ENUM_DIC_TYPE } from "@/util/util";
import { mapGetters } from "vuex";
let strLenConfig = 500;

export default {
  components: {
    upload,
    wangEditor,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
    langKey: {
      type: String,
      required: true,
      default: "",
    },
  },
  data() {
    return {
      znStrLen: 0,
      twStrLen: 0,
      enStrLen: 0,
      znRow: {
        onChange: (event) => {
          this.ruleForm.zn = event.txt.html();
          this.znStrLen = event.txt.text().length;
          if (this.znStrLen > strLenConfig) {
            // return this.$message.warning(`更新内容最大长度为${strLenConfig}`);
          }
        },
        htmlContent: "",
      },
      twRow: {
        onChange: (event) => {
          this.ruleForm.tw = event.txt.html();
          this.twStrLen = event.txt.text().length;
          if (this.twStrLen > strLenConfig) {
            // return this.$message.warning(`更新内容最大长度为${strLenConfig}`);
          }
        },
        htmlContent: "",
      },
      enRow: {
        onChange: (event) => {
          this.ruleForm.en = event.txt.html();
          this.enStrLen = event.txt.text().length;
          if (this.enStrLen > strLenConfig) {
            // return this.$message.warning(`更新内容最大长度为${strLenConfig}`);
          }
        },
        htmlContent: "",
      },
      loading: false,
      ruleForm: {
        zn: "",
        tw: "",
        en: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
    }),
  },
  mounted() {
    if (!this.langKey) {
      return;
    }
    langPageConfig({
      langKey: this.langKey,
    }).then((res) => {
      const list = res.data.data.records;
      this.znRow.htmlContent = list.find(
        (v) => v.dictionaryValue === "zh_CN"
      )?.langValue;
      this.twRow.htmlContent = list.find(
        (v) => v.dictionaryValue === "zh_MO"
      )?.langValue;
      this.enRow.htmlContent = list.find(
        (v) => v.dictionaryValue === "en_US"
      )?.langValue;
    });
  },
  methods: {
    comSubmit() {
      const langArr = this.dictionary[ENUM_DIC_TYPE.language_select];
      const params = {
        langConfigList: [
          {
            dictionaryId: langArr.find((v) => v.dictionaryValue === "zh_CN")
              ?.id,
            langValue: this.ruleForm.zn,
          },
          {
            dictionaryId: langArr.find((v) => v.dictionaryValue === "zh_MO")
              ?.id,
            langValue: this.ruleForm.tw,
          },
          {
            dictionaryId: langArr.find((v) => v.dictionaryValue === "en_US")
              ?.id,
            langValue: this.ruleForm.en,
          },
        ],
        langKey: this.langKey,
      };
      return langSaveBatch(params).then(() => {
        this.$message.success("保存成功");
        this.row.callback(true);
        return Promise.resolve();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.znStrLen > strLenConfig) {
          return this.$message.warning(
            `简体中文更新内容最大长度为${strLenConfig}`
          );
        }
        if (this.twStrLen > strLenConfig) {
          return this.$message.warning(
            `繁体中文更新内容最大长度为${strLenConfig}`
          );
        }
        if (this.enStrLen > strLenConfig) {
          return this.$message.warning(`英文更新内容最大长度为${strLenConfig}`);
        }
        if (valid) {
          debounceCallBack(() => this.comSubmit())();
        }
      });
    },
  },
};
</script>
