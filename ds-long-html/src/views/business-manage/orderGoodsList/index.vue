<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        label="金币"
        lazy
        name="first"
        v-if="permissions.sys_business_order_coin"
      >
        <shopOrderList
          :shopOrder="ENUM_SHOPORDER.RECHARGE"
          v-if="activeName == 'first'"
        ></shopOrderList>
      </el-tab-pane>
      <el-tab-pane
        label="超级会员"
        lazy
        name="second"
        v-if="permissions.sys_business_order_vip"
      >
        <shopOrderList
          :shopOrder="ENUM_SHOPORDER.BUY_SVIP"
          v-if="activeName == 'second'"
        ></shopOrderList>
      </el-tab-pane>
      <el-tab-pane
        label="充电"
        lazy
        name="third"
        v-if="permissions.sys_business_order_charge"
      >
        <shopOrderList
          :shopOrder="ENUM_SHOPORDER.CHARGE"
          v-if="activeName == 'third'"
        ></shopOrderList>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import { ENUM_SHOPORDER } from "@/util/util";
import shopOrderList from "@/views/business-manage/orderGoodsList/shopOrderList.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    shopOrderList,
  },
  data() {
    return {
      ENUM_SHOPORDER: ENUM_SHOPORDER,
      activeName: "first",
    };
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
  },

  methods: {
    handleClick(tab) {
      if (tab.name == "first") {
      } else if (tab.name == "second") {
      }
    },
  },
  mounted() {
    if (this.permissions.sys_business_order_coin) {
      this.activeName = "first";
      return;
    }
    if (this.permissions.sys_business_order_vip) {
      this.activeName = "second";
      return;
    }
    if (this.permissions.sys_business_order_charge) {
      this.activeName = "third";
      return;
    }
  },
};
</script>
