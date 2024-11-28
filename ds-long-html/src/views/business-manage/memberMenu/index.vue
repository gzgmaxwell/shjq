<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="超级会员" lazy name="first">
        <vipMenu
          :vipLevel="ENUM_USER_VIPINFO.svip"
          v-if="activeName == 'first'"
        ></vipMenu>
      </el-tab-pane>
      <!-- <el-tab-pane label="VIP" lazy name="second">
        <vipMenu
          :vipLevel="ENUM_USER_VIPINFO.vip"
          v-if="activeName == 'second'"
        ></vipMenu>
      </el-tab-pane> -->
    </el-tabs>
  </basic-container>
</template>

<script>
import { ENUM_USER_VIPINFO } from "@/util/util";
import vipMenu from "@/views/business-manage/memberMenu/vipMenu.vue";
export default {
  components: {
    vipMenu,
  },
  data() {
    return {
      ENUM_USER_VIPINFO: ENUM_USER_VIPINFO,
      activeName: "first",
    };
  },

  methods: {
    handleClick(tab) {
      if (tab.name == "first") {
      } else if (tab.name == "second") {
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.mend {
  width: 100%;
  background-color: #fff;
  padding: 0 30px 50px;
}
</style>
