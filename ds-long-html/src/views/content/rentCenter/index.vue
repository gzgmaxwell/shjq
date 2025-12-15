<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频" lazy name="first">
        <rentCenterVideo v-if="activeName == 'first'"></rentCenterVideo>
      </el-tab-pane>

      <el-tab-pane label="漫画" lazy name="second">
        <rentCenterComicBook
          v-if="activeName == 'second'"
          :type="EnumCartoonType.comic"
        ></rentCenterComicBook>
      </el-tab-pane>
      <el-tab-pane label="小说" lazy name="third">
        <rentCenterComicNovel
          v-if="activeName == 'third'"
          :type="EnumCartoonType.novel"
        ></rentCenterComicNovel>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import { EnumCartoonType } from "@/util/util";
import rentCenterVideo from "./rentCenterVideo.vue";
import rentCenterComicBook from "./rentCenterComicBook.vue";
import rentCenterComicNovel from "./rentCenterComicNovel.vue";
export default {
  components: {
    rentCenterVideo,
    rentCenterComicBook,
    rentCenterComicNovel,
  },
  data() {
    return {
      activeName: "first",
      EnumCartoonType: EnumCartoonType,
    };
  },
};
</script>
