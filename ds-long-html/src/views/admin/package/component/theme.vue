<template>
  <div class="box">
    <div v-for="item in tableData" :key="item.id" class="wrap">
      <div ref="title" class="title">
        <div v-if="item.isOverflow">
          <el-tooltip :content="item.name" placement="top">
            <span>{{ item.name }}</span>
          </el-tooltip>
        </div>
        <span v-else>{{ item.name }}</span>
      </div>
      <img
        style="width: 100%; height: 150px; margin-top: 5px"
        :src="item.imgUrl"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { versionStyle_page } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  mounted() {
    this.getList();
  },

  methods: {
    isTextOverflow(el) {
      return el.scrollWidth > el.clientWidth;
    },
    // 检测标题是否超出 超出就显示tooltip
    checkTitleOverflow() {
      this.$refs.title.forEach((titleElement, index) => {
        if (titleElement) {
          this.$set(
            this.tableData[index],
            "isOverflow",
            this.isTextOverflow(titleElement)
          );
        }
      });
    },
    getList() {
      const params = {
        current: 1,
        size: 999,
      };
      this.loading = true;
      versionStyle_page(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records.filter(
            (v) => v.status === true
          );
          this.$nextTick(() => {
            this.checkTitleOverflow();
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  flex-wrap: wrap;
}

.wrap {
  width: 25%;
  padding: 5px;
  text-align: center;
}
.title {
  min-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
