<template>
  <basic-container>
    <template>
      <div class="mb10">
        <el-button type="primary" @click="getWork(false)" v-if="!onlineStatus"
          >开始工作</el-button
        >
        <el-button type="primary" @click="getWork(false)" v-if="onlineStatus"
          >停止分配</el-button
        >
        <el-button type="primary" @click="getList()" v-if="onlineStatus"
          >刷新页面</el-button
        >
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane name="first" lazy>
          <span slot="label">小说</span>
          <tab
            ref="videoList"
            :type="EnumCartoonType.novel"
            v-if="activeName === 'first'"
          />
        </el-tab-pane>
        <el-tab-pane name="second" lazy>
          <span slot="label">漫画</span>
          <tab
            ref="videoList"
            :type="EnumCartoonType.comic"
            v-if="activeName === 'second'"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import { EnumCartoonType } from "@/util/util";
import { userWork } from "@/api/graphicManagement/index";
import { mapGetters } from "vuex";
import tab from "./tab.vue";

export default {
  components: { tab },
  data() {
    return {
      activeName: "first",
      onlineStatus: false,
      EnumCartoonType: EnumCartoonType,
    };
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
  },
  mounted() {
    if (this.$route.query.back === "NOVEL") {
      this.activeName = "first";
    } else if (this.$route.query.back === "COMIC") {
      this.activeName = "second";
    }
    this.getWork(true);
  },
  methods: {
    getWork(onlyGet) {
      userWork({
        onlyGet: onlyGet,
        workContent: "INK_LORE_INFO_EXAMINE",
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
  },
};
</script>
