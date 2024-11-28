<template>
  <div class="langBox">
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ compuLang(this.$store.state.common.lang)
        }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="language in optionlanguage"
          :key="language.code"
          :disabled="$store.state.common.lang === language.code"
          :command="language.code"
        >
          {{ language.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { optionlanguage } from "@/util/util";
export default {
  data() {
    return {
      optionlanguage: optionlanguage,
    };
  },

  computed: {
    compuLang() {
      return (lang) => {
        const item = optionlanguage.find((v) => v.code === lang);
        return item.name;
      };
    },
  },
  methods: {
    handleCommand(lang) {
      const item = optionlanguage.find((v) => v.code === lang);
      this.$i18n.locale = lang;
      this.$store.commit("SET_LANG", lang);
      if (lang == "zh-cn") {
        this.$message.success(`切换${item.name}成功!`);
      } else if (lang == "zh-tw") {
        this.$message.success(`切换${item.name}成功!`);
      } else if (lang == "en") {
        this.$message.success(`Switch ${item.name} Successful!`);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.langBox {
  width: 80px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
