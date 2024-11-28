<template>
  <basic-container>
    <template>
      <div class="mb10">
        <el-button
          type="primary"
          @click="getWork(false)"
          v-if="!onlineStatus && permissions.vm_vl_start_work"
          >开始工作</el-button
        >
        <el-button type="primary" @click="getWork(false)" v-if="onlineStatus"
          >停止分配</el-button
        >
        <el-button type="primary" @click="getList()" v-if="onlineStatus"
          >刷新页面</el-button
        >
        <el-button type="primary" @click="this.maskBack" v-if="compBack"
          >任务回退</el-button
        >
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane name="first" lazy>
          <span slot="label">供应商</span>
          <span slot="label">({{ totalList.total_supplyVideoList }})</span>
          <videoList
            ref="videoList"
            :params="params"
            :webPageMenu="menuEnum.supplyVideoList"
          />
        </el-tab-pane>
        <el-tab-pane name="second" lazy>
          <span slot="label">三方</span>
          <span slot="label">({{ totalList.total_triateralVideoList }})</span>
          <videoList
            ref="videoList"
            :params="params"
            :webPageMenu="menuEnum.triateralVideoList"
          />
        </el-tab-pane>
        <el-tab-pane label="用户" name="third" lazy>
          <span slot="label">用户</span>
          <span slot="label">({{ totalList.total_consumerVideoList }})</span>
          <videoList
            ref="videoList"
            :params="params"
            :webPageMenu="menuEnum.consumerVideoList"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import { menuEnum, channelEnum } from "@/util/util";
import videoList from "./components/index.vue";
import {
  editorWork,
  substancepreRollback,
  countByChannel,
} from "@/api/video-manage/await-examine.js";
import { mapGetters } from "vuex";

export default {
  components: {
    videoList,
  },
  data() {
    return {
      activeName: "first",
      menuEnum: menuEnum,
      onlineStatus: false,
      totalList: {
        total_supplyVideoList: 0,
        total_triateralVideoList: 0,
        total_consumerVideoList: 0,
      },
      params: {
        callback: (val) => {
          this.selectionData = val;
        },
        totalCallback: ({ value, type }) => {
          if (type === menuEnum.supplyVideoList) {
            this.totalList.total_supplyVideoList = value;
          }
          if (type === menuEnum.triateralVideoList) {
            this.totalList.total_triateralVideoList = value;
          }
          if (type === menuEnum.consumerVideoList) {
            this.totalList.total_consumerVideoList = value;
          }
        },
      },
      selectionData: [],
    };
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
    selectedTimeLength() {
      return videoLength(this.searchData.tiemData, optionsTimeType);
    },
    compBack() {
      const item = this.selectionData.every((item) => item.type === "20");
      return (
        this.permissions.vm_vl_mask_back && this.selectionData.length && item
      );
    },
  },
  mounted() {
    this.getWork(true);
    countByChannel().then((res) => {
      const APP = res.data.data.find((v) => v.channel === channelEnum.APP);
      const BK = res.data.data.find((v) => v.channel === channelEnum.BK);
      const THIRD = res.data.data.find((v) => v.channel === channelEnum.THIRD);
      this.totalList.total_consumerVideoList = APP?.videoCount || 0;
      this.totalList.total_triateralVideoList = THIRD?.videoCount || 0;
    });
  },
  methods: {
    getWork(onlyGet) {
      editorWork({
        onlyGet: onlyGet,
      }).then((res) => {
        this.onlineStatus = res.data.data;
        if (!onlyGet) {
          this.getList();
        }
      });
    },
    getList() {
      this.$refs.videoList.getList();
    },
    maskBack() {
      if (!this.selectionData.length) {
        return this.$message.warning("请选择需要退回的任务！");
      }
      const params = this.selectionData.map((item) => {
        return item.preId;
      });
      substancepreRollback(params).then(() => {
        this.getList();
      });
    },
  },
};
</script>
