<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane lazy name="first">
        <span slot="label">已上架</span>
        <span slot="label">({{ listingTotal }})</span>
        <listingPage
          :webPageMenu="webPageMenu"
          :failure="false"
          v-if="activeName == 'first'"
          @getListingTotal="getListingTotal"
        ></listingPage>
      </el-tab-pane>
      <el-tab-pane lazy name="second">
        <span slot="label">已下架</span>
        <span slot="label">({{ delistTotal }})</span>
        <listingPage
          :webPageMenu="webPageMenu"
          :failure="true"
          v-if="activeName == 'second'"
          @getDelistTotal="getDelistTotal"
        ></listingPage>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import listingPage from "@/views/content/management/listingPage.vue";
import { countByFailure } from "@/api/content/management";
export default {
  props: {
    webPageMenu: {
      type: String,
      required: false,
      default: () => {
        return "";
      },
    },
  },
  components: {
    listingPage,
  },
  data() {
    return {
      activeName: "first",
      listingTotal: 0,
      delistTotal: 0,
    };
  },
  mounted() {
    this.getTotal();
  },
  methods: {
    getTotal() {
      countByFailure({}).then((res) => {
        this.listingTotal = res.data.data.onlineCount || 0;
        this.delistTotal = res.data.data.failureCount || 0;
        this.getListingTotal();
      });
    },
    getListingTotal(val) {
      this.listingTotal = val || 0;
    },
    getDelistTotal(val) {
      this.delistTotal = val || 0;
    },
  },
};
</script>
