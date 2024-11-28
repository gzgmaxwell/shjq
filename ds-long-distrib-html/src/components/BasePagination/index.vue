<template>
  <div class="pagination-warp">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total || 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
const props = defineProps({
  callback: {
    type: Function,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  tablePage: {
    type: Object,
    default: () => ({
      total: 1,
      current: 1,
      size: 10,
      pagination: () => {},
    }),
  },
});

const currentPage = ref(1);
const pageSize = ref(10);

const handleSizeChange = () => {
  commParams();
};
const handleCurrentChange = () => {
  commParams();
};
const commParams = () => {
  const params = {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  };
  props.callback(params);
};
watch(
  () => props.tablePage.current,
  (current) => {
    currentPage.value = current;
  }
);
</script>

<style scoped lang="scss">
.pagination-warp {
  display: flex;
  justify-content: end;
  margin-top: 20px;
}
</style>
