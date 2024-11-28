<template>
  <div>
    <el-form
      ref="ruleForm"
      label-width="180px"
      style="margin-bottom: 30px"
      class="demo-ruleForm"
    >
      <div class="titleBox">
        <div class="title">观影卡</div>
        <el-form-item style="text-align: right">
          <el-button
            :disabled="!data.length"
            type="primary"
            @click="submitCapture"
            >保存</el-button
          >
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-button type="primary" @click="add">添加</el-button>
      <el-form-item class="mark">
        <div v-for="(item, index) in data" :key="index" class="mt10">
          <span>视频时长</span>
          <el-input-number
            class="ml10"
            style="width: 130px"
            :min="0"
            :precision="0"
            :step="1"
            disabled
            :max="9999999999999"
            v-model="item.minTime"
          />
          <span class="ml10">--</span>
          <el-input-number
            class="ml10"
            style="width: 130px"
            :min="0"
            :precision="0"
            :step="1"
            :max="9999999999999"
            @change="(val) => changeMaxTime(val, item, index)"
            v-model="item.maxTime"
          />
          <span class="ml10">秒，</span>
          <span>观影卡</span>
          <el-input-number
            class="ml10"
            style="width: 130px"
            :min="1"
            :precision="0"
            :step="1"
            :max="9999999999999"
            v-model="item.videoCard"
          />
          <span class="ml10">张</span>

          <span
            class="ml10 must pointer"
            @click="del(index)"
            v-if="index === data.length - 1"
            >删除</span
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  videoCard_saveVideoCard,
  videoCard_getVideoCardList,
} from "@/api/admin/index";

import { debounceCallBack } from "@/util/util";
const initTime = 60;
const initTimeVideoCard = 1;
export default {
  data() {
    return {
      data: [],
    };
  },

  mounted() {
    this.getInfo();
  },

  methods: {
    add() {
      if (!this.data.length) {
        const item = {
          minTime: 0,
          maxTime: initTime,
          videoCard: initTimeVideoCard,
        };
        this.data.push(item);
        return;
      }
      const lastItem = this.data[this.data.length - 1];
      const item = {
        minTime: lastItem.maxTime + 1,
        maxTime: lastItem.maxTime + 1 + initTime,
        videoCard: initTimeVideoCard,
      };
      this.data.push(item);
    },
    del(index) {
      this.data.splice(index, 1);
    },
    changeMaxTime(val, item, index) {
      if (index > this.data.length - 2) return;
      this.data[index + 1].minTime = val + 1;
    },
    getInfo() {
      videoCard_getVideoCardList().then((res) => {
        this.data = res.data.data;
      });
    },
    submitCapture() {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].minTime - this.data[i].maxTime >= 0) {
          this.$message.error("最小时间只能小于最大时间");
          return;
        }
      }
      const comSubmit = () => {
        return videoCard_saveVideoCard(this.data).then(() => {
          this.$message.success("保存成功");
          this.getInfo();
          Promise.resolve();
        });
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>
<style lang="scss" scoped>
.mark {
  ::v-deep .el-form-item__content {
    margin: 0 !important;
    .permit {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px 0;
    }
  }
}
::v-deep .el-divider--horizontal {
  margin: 0;
  margin-bottom: 15px;
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
.titleBox {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 20px;
  .title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .question {
      margin-left: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>
