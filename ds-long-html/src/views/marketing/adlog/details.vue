<template>
  <basic-container>
    <el-form inline label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="广告类型：">
            {{ compuLocation(this.details.location) }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="广告格式：">
            {{ compuAdvertFormat(this.details.advertFormat) }}</el-form-item
          >
        </el-col>
        <el-col :span="12">
          <el-form-item label="视频/图片：">
            <div v-if="this.details.adFileUrl">
              <img
                :src="this.details.adFileUrl"
                alt=""
                width="100"
                height="50"
              />
            </div>
            <div v-else>
              <img
                :src="this.details.coverFileUrl"
                alt=""
                width="100"
                height="50"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="跳转地址：">
            {{ this.details.jumpAdress }}</el-form-item
          >
        </el-col>
        <el-col :span="12">
          <el-form-item label="权重：">
            {{ this.details.sortWeight }}</el-form-item
          >
        </el-col>
        <el-col :span="12">
          <el-form-item label="展示时间：">
            {{ this.details.startTime }} -
            {{ this.details.endTime }}</el-form-item
          >
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：">
            {{ compuStatus(this.details.status) }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="广告位名称">
            {{ this.details.advertLocationName }}
          </el-form-item>
        </el-col>
        <el-col :span="24" :style="{ 'margin-left': 40 + 'px' }">
          <el-form-item>
            <el-button @click="goback">返回</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import { advertQueryAdById } from "@/api/marketing/index";
import { seat } from "@/api/content/advertising";
import {
  optionAdvertFormat,
  optionAdType,
  optionComStatus,
} from "@/util/util";
export default {
  data() {
    return {
      details: {
        location: "",
      },
      optionAdPos: [],
    };
  },
  computed: {
    compuAdvertFormat() {
      return (val) => {
        const item = optionAdvertFormat.find((v) => v.id === val) || {};
        return item.name;
      };
    },
    compuLocation() {
      return (val) => {
        const item = optionAdType.find((v) => v.id === val) || {};
        return item.name;
      };
    },
    compuStatus() {
      return (val) => {
        const item = optionComStatus.find((v) => v.id === val) || {};
        return item.name;
      };
    },
  },

  mounted() {
    this.adLocation();
  },

  methods: {
    adLocation() {
      seat().then((res) => {
        const { data } = res;
        this.optionAdPos = data.data;
        this.getDetails(this.$route.query.adId);
      });
    },
    changeAdPos(val) {
      const item = this.optionAdPos.find((v) => v.id === val);
      this.details.location = item?.location;
    },
    getDetails(id) {
      advertQueryAdById({ adId: id }).then((res) => {
        const { data } = res;
        this.details = data.data;
        this.changeAdPos(this.details.locationId);
      });
    },
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
