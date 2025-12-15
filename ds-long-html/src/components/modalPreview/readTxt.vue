<template>
  <div id="fileContent">Loading...</div>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
      default: "",
    },
  },

  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    if (this.url) {
      this.getTxt(this.url);
    }
  },

  methods: {
    getTxt(url) {
      fetch(url)
        .then((response) => response.text())
        .then((text) => {
          // console.log(text); // 文件的文本内容
          // const lines = text.split("\n");
          // console.log(222, lines);
          document.getElementById("fileContent").innerText = text;
        })
        .catch((error) => console.error("Error reading the file:", error));
    },
  },
};
</script>
<style lang="scss" scoped></style>
