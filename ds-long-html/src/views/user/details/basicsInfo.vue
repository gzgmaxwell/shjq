<template>
  <div class="mt10">
    <basic-container>
      <el-form inline label-width="85px" label-position="left" v-if="details">
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
            <el-form-item label="账号状态:">
              {{ convertedStatus }}</el-form-item
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP地址:"> {{ details.ip }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像:">
              <div v-if="details.avatarFileUrl">
                <img
                  :src="details.avatarFileUrl"
                  alt=""
                  width="78"
                  height="78"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="背景图:">
              <div v-if="details.bgImgFileUrl">
                <img
                  :src="details.bgImgFileUrl"
                  alt=""
                  width="100"
                  height="50"
                />
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="注册来源：">
              {{
                details.userType == 1
                  ? "App注册"
                  : details.userType == 2
                  ? "web端创建"
                  : ""
              }}</el-form-item
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称:"> {{ details.nickName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="display: flex" label="简介:">{{
              details.introduce
            }}</el-form-item>
          </el-col>

          <el-col :span="12">
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
          <el-col :span="12">
            <el-form-item label="创建用户:">
              {{ details.bindUserNick }}</el-form-item
            >
          </el-col>
          <el-col :span="24">
            <el-form-item label="年龄:"> {{ details.age }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地区:"> {{ details.address }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会员状态:"> {{ vipStatus }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
    <!-- <div :style="{ margin: '10px' }">
      <el-button type="primary" @click="goback">返 回</el-button>
    </div> -->
  </div>
</template>

<script>
import { userVipInfo } from "@/util/util";
import { dsUserGetUserDetailInfo } from "@/api/userList";
export default {
  components: {},
  data() {
    return {
      details: {},
    };
  },
  computed: {
    convertedStatus() {
      const statusMap = {
        ENABLE: "正常",
        DISABLE: "封禁",
        LOGOFF: "已注销",
      };
      return statusMap[this.details.status] || "";
    },
    vipStatus() {
      return (
        userVipInfo.find((item) => item.id === this.details.vipType)?.name || ""
      );
    },
  },

  mounted() {
    this.getDetails();
  },

  methods: {
    getDetails() {
      const id = this.$route.query.id;
      dsUserGetUserDetailInfo(id).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.details = data.data;
        }
      });
    },
    // goback() {
    //   this.$router.push("/user/userList/index");
    // },
  },
};
</script>

<style lang="scss" scoped></style>
