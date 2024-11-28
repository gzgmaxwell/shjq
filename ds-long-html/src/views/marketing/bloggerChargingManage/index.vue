<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="博主申请表" lazy name="first" v-if="showFirstTab">
        <applicationForm></applicationForm>
      </el-tab-pane>
      <el-tab-pane label="博主档案表" lazy name="second" v-if="showSecondTab">
        <fileSheetForm></fileSheetForm>
      </el-tab-pane>
      <el-tab-pane label="黑名单" lazy name="third" v-if="showThirdTab">
        <blacklist></blacklist>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import applicationForm from "@/views/marketing/bloggerChargingManage/components/applicationForm.vue";
import fileSheetForm from "@/views/marketing/bloggerChargingManage/components/fileSheetForm.vue";
import blacklist from "@/views/marketing/bloggerChargingManage/components/blacklist.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    applicationForm,
    fileSheetForm,
    blacklist,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  mounted() {
    this.setActiveTab();
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
    showFirstTab() {
      return this.permissions.sys_charging_manage_apply;
    },
    showSecondTab() {
      return this.permissions.sys_charging_manage_record;
    },
    showThirdTab() {
      return this.permissions.sys_charging_manage_black_list;
    },
  },
  methods: {
    setActiveTab() {
      const tabOptions = [
        { name: "first", show: this.showFirstTab },
        { name: "second", show: this.showSecondTab },
        { name: "third", show: this.showThirdTab },
      ];
      const visibleTabs = tabOptions.filter((tab) => tab.show);
      this.activeName = visibleTabs.length > 0 ? visibleTabs[0].name : "";
    },
  },
};
</script>
