<template>
  <div>
    <el-form inline label-width="90px" label-position="left" v-if="details">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户ID:">
            {{ details.id }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册时间:">
            {{ details.createTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号:"> {{ details.mobile }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号状态:"> {{ convertedStatus }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录密码:"> {{ details.password }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP地址:"> {{ details.ip }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="头像:">
            <div v-if="details.avatarFileUrl">
              <img :src="details.avatarFileUrl" alt="" width="100" height="50" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="背景图:">
            <div v-if="details.bgImgFileUrl">
              <img :src="details.bgImgFileUrl" alt="" width="100" height="50" />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="注册来源：">
            {{ details.userType == 1 ? "App注册" : details.userType == 2 ? "web端创建" : "" }}</el-form-item
          >
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称:"> {{ details.nickName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简介:"> {{ details.introduce }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="性别:">
            {{
              details.gender === "MALE"
                ? "男"
                : details.gender === "FEMALE"
                ? "女"
                : details.gender === "SECRECY"
                ? "保密"
                : ""
            }}</el-form-item
          >
        </el-col>
        <el-col :span="24">
          <el-form-item label="年龄:"> {{ details.age }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地区:"> {{ details.address }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会员状态:"> {{ details.vipType }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-button type="primary" @click="goback">返 回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserDetailInfo } from "@/api/system";
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute();

const details: any = ref({});

const getDetails = () => {
  const id = route.query.id;
  getUserDetailInfo(id).then((res) => {
    const { data } = res;
    if (data.code == 200) {
      details.value = data.data;
    }
  });
};
const goback = () => {
  router.go(-1);
};
const convertedStatus = computed(() => {
  const statusMap: any = {
    ENABLE: "正常",
    DISABLE: "封禁",
    LOGOFF: "已注销",
  };
  return statusMap[details.status] || "";
});
onMounted(() => {
  getDetails();
});
</script>
