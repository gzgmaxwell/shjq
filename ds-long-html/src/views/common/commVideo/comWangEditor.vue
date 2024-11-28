<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="5px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <!-- <span slot="label"><span class="must"></span></span> -->
        <div id="znRow">
          <wangEditor
            :row="znRow"
            editorDom="znRow"
            :strLenConfig="strLenConfig"
            :height="230"
            :menus="menus"
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
import wangEditor from "@/components/wangEditor/index.vue";

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
    strLenConfig: {
      type: Number,
      required: false,
      default: () => {
        return 500;
      },
    },
    menus: {
      type: Array,
      required: false,
      default: () => {
        return [
          "head",
          "bold",
          "fontSize",
          "fontName",
          "italic",
          "underline",
          "strikeThrough",
          "indent",
          "lineHeight",
          "foreColor",
          "backColor",
          "link",
          "list",
          "todo",
          "justify",
          "quote",
          "emoticon",
          "image",
          "video",
          "table",
          "code",
          "splitLine",
          "undo",
          "redo",
        ];
      },
    },
  },
  data() {
    return {
      znStrLen: 0,
      znRow: {
        onChange: (event) => {
          this.ruleForm.zn = event.txt.html();
          this.znStrLen = event.txt.text().length;
        },
        htmlContent: "",
      },
      ruleForm: {
        zn: "",
      },
    };
  },
  mounted() {
    this.znRow.htmlContent = this.row.htmlContent;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.znStrLen > this.strLenConfig) {
          return this.$message.warning(`内容最大长度为${this.strLenConfig}`);
        }
        if (valid) {
          this.row.callback(this.ruleForm.zn);
        }
      });
    },
  },
};
</script>
