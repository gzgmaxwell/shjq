<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div
        class="avue-breadcrumb"
        :class="[{ 'avue-breadcrumb--active': isCollapse }]"
        v-if="showCollapse"
      >
        <i class="icon-navicon" @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show" v-if="showMenu">
        <top-menu></top-menu>
      </div>
    </div>
    <div class="top-bar__right">
      <warningInfo />
      <el-select
        v-model="BusPlatformId"
        @change="change"
        disabled
        size="mini"
        :placeholder="$t('please_select')"
        style="margin-right: 20px; width: 120px"
      >
        <el-option
          v-for="item in options"
          :key="item.busPlatformId"
          :label="item.name"
          :value="item.busPlatformId"
        >
        </el-option>
      </el-select>
      <!-- <languageSelect></languageSelect> -->
      <gs-top-lock style="cursor: pointer" class="nx-help"></gs-top-lock>
      <el-tooltip
        v-if="showFullScren"
        effect="dark"
        :content="$t(isFullScreen ? 'exit_full_screen' : 'full_screen')"
        placement="bottom"
        popper-class="toop"
      >
        <div class="top-bar__item">
          <i
            :class="isFullScreen ? 'icon-zuixiaohua' : 'icon-quanpingzuidahua'"
            @click="handleScreen"
          ></i>
        </div>
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">{{ $t("home_page") }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">
              {{ $t("personal_information") }}</router-link
            >
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>
            {{ $t("exit_system") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import languageSelect from "@/components/languageSelect/index.vue";
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/util";
import topMenu from "./top-menu";
import gsTopLock from "@/components/gs-top-lock";
import { orderOffline } from "@/api/login";
import { switchPlatform, tenant_getByUser } from "@/api/admin/index";
import warningInfo from "./warningInfo";

export default {
  components: {
    topMenu,
    gsTopLock,
    languageSelect,
    warningInfo,
  },
  name: "top",
  data() {
    return {
      BusPlatformId: localStorage.getItem("BusPlatformId"),
    };
  },
  mounted() {
    listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      showLock: (state) => state.common.showLock,
      showFullScren: (state) => state.common.showFullScren,
      showCollapse: (state) => state.common.showCollapse,
      showMenu: (state) => state.common.showMenu,
      options: (state) => [state.common.busPlatformInfo],
    }),
    ...mapGetters([
      "userInfo",
      "isFullScreen",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "permissions",
    ]),
  },
  methods: {
    change(val) {
      if (val) {
        switchPlatform(val).then(() => {
          this.$message.success(this.$t("platform_switch_successful"));
          this.$store.commit("DEL_ALL_TAG");
          localStorage.setItem("BusPlatformId", val);
          this.$router.push("/wel/index");
          this.$store.dispatch("GetMenu", { type: true, id: -1 });
        });
      }
    },
    // 点击切换全屏
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },
    // 退出登录
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        orderOffline()
          .then(() => {
            this.$store.dispatch("LogOut").then(() => {
              this.$router.push({ path: "/login" });
            });
          })
          .catch(() => {
            this.$store.dispatch("LogOut").then(() => {
              this.$router.push({ path: "/login" });
            });
          });
      });
    },
  },
};
</script>
<style>
.el-tooltip__popper.is-dark.toop {
  margin-top: -8px !important;
}
</style>
