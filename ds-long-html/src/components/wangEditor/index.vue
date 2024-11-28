<template>
  <div id="editorDom"></div>
</template>

<script>
import E from "wangeditor";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    height: {
      type: Number,
      required: false,
      default: () => {
        return 300;
      },
    },
    editorDom: {
      type: String,
      required: false,
      default: () => {
        return "editorDom";
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
    strLenConfig: {
      type: Number,
      required: false,
      default: () => {
        return 500;
      },
    },
  },
  data() {
    return {
      editor: "",
      timer: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      const dom = document.getElementById(`${this.editorDom}`);
      this.editor = new E(dom);
      this.editor.config.focus = false; // 取消光标自动定位
      this.editor.config.menus = this.menus;
      this.editor.config.height = this.height;
      this.editor.create();
      this.editor.config.onchange = () => {
        if (!this.editor?.txt) {
          return;
        }
        const textLen = this.editor.txt.text().length;
        const fun = (ms) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            return this.$message({
              type: "warning",
              message: `内容最大长度为${this.strLenConfig}`,
              duration: 1000,
            });
          }, ms);
        };
        if (textLen > this.strLenConfig) {
          fun(500);
        }
        this.row.onChange && this.row.onChange(this.editor);
      };
    },
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy();
    this.editor = null;
  },
  watch: {
    row: {
      handler(val) {
        if (val.htmlContent) {
          this.editor.txt.html(val.htmlContent);
        }
      },
      deep: true,
    },
  },
};
</script>
