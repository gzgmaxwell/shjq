<template>
  <div>
    <el-row class="content" :gutter="20">
      <el-col :span="8" v-for="(item, index) in levelDatas" :key="index">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>{{ item.levelName }}</h3>
            <h5>{{ item.count ? item.count : 0 }}个视频</h5>
            <div class="bottom" @click="edit(item.level)">
              <el-button type="text">修改</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <levelVideo v-if="visible" :levelRow="row" />
    </el-dialog>
  </div>
</template>

<script>
import videoLibrary from "@/views/content/referralPool/component/videoLibrary.vue";
import levelVideo from "@/views/content/referralPool/component/levelVideo.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    levelVideo,
    videoLibrary,
  },
  data() {
    return {
      row: {},
      levelDatas: [],
      visible: false,
    };
  },
  watch: {
    levelData: {
      handler(newValue) {
        this.levelDatas = newValue;
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters({
      levelData: "levelData",
    }),
  },
  mounted() {
    this.getLevel();
  },
  methods: {
    ...mapActions({
      getLevel: "getLevel",
    }),
    async getAndSetLevelData() {
      await this.getLevel();
      this.levelDatas = this.levelData;
    },
    edit(level) {
      this.visible = true;
      this.row = {
        level,
        callback: () => {
          this.getAndSetLevelData();
          this.visible = false;
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .el-col {
    text-align: center;
    margin-bottom: 15px;
  }
  .bottom {
    cursor: pointer;
    background-color: #e8e8e8;
    .el-button {
      font-size: 16px;
    }
  }
}
.el-card {
  border-radius: 4px;
  border: 1px solid #ebeef5 !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
</style>
