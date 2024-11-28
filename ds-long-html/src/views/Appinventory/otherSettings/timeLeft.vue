<template>
  <div>
    <el-divider></el-divider>
    <div class="permit">
      <span class="title">超级会员视频、付费视频观影，充电倒计时提示</span>
      <el-switch
        v-model="dictionaryKey"
        @input="changePromoteSharing"
        active-value="0"
        inactive-value="1"
      >
      </el-switch>
    </div>
  </div>
</template>

<script>
import { updateDictByKey } from "@/api/admin/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dictionaryKey: "0",
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
    }),
  },
  mounted() {
    this.dictionaryKey = this.dictionary.EXTENSION_SHARE[0].dictionaryValue;
  },
  methods: {
    changePromoteSharing() {
      const params = {
        dictionaryKey: "EXTENSION_SHARE_SWITCH",
        dictionaryValue: this.dictionaryKey,
      };
      updateDictByKey(params).then(() => {
        this.$message.success("操作成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.permit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
::v-deep .el-divider--horizontal {
  margin: 10px 0 30px 0;
}
</style>
