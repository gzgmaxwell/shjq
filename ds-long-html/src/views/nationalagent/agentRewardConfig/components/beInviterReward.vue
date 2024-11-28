<template>
  <div class="mt10">
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isSelection="false"
      :isIndex="false"
    >
      <template #count="{ row }">
        <div v-if="!row.showEditInput">
          <span>{{ row.num }}</span
          >&nbsp;<span>{{ comptUnit(row) }}</span
          ><i class="el-icon-edit editStyle" @click="edit(row)"></i>
        </div>
        <div style="display: flex; align-items: center" v-else>
          <el-input
            ref="editInput"
            v-model="oldCount"
            placeholder="请输入数量"
            @blur="handleBlur(row)"
          ></el-input
          >&nbsp;<span>{{ comptUnit(row) }}</span>
        </div>
      </template>
    </tableSearch>
  </div>
</template>

<script>
import { optProps } from "@/util/util";
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import {
  clearingAppSchemeDetailList,
  detailUpdateSchemeDetail,
} from "@/api/admin/index";
import configEdit from "./configEdit.vue";
export default {
  components: {
    tableSearch,
    search,
    configEdit,
  },
  data() {
    return {
      oldCount: "",
      loading: false,
      tableData: [],
      tableLabel: [
        {
          prop: "type",
          label: "类型",
          align: "left",
          type: "filter",
          filter: (row) => {
            const item = optProps.find((v) => v.id === row.type) || {};
            return item.name;
          },
        },
        {
          label: "数量",
          type: "slot",
          slotName: "count",
          width: "400",
        },
      ],

      tablePage: {
        total: 0,
        current: 1,
        size: 10,
        pagination: (val) => {
          this.tablePage.current = val.page;
          this.tablePage.size = val.limit;
          this.getList();
        },
      },
    };
  },
  computed: {
    comptUnit() {
      return (row) => {
        const item = optProps.find((v) => v.id === row.type) || {};
        return item.unit;
      };
    },
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      clearingAppSchemeDetailList(1)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    edit(row) {
      this.oldCount = row.num;
      this.$set(row, "showEditInput", true);
      this.$nextTick(() => {
        const input = this.$refs.editInput.$refs.input;
        if (input) input.focus();
      });
    },
    handleBlur(row) {
      const reg = /^[0-9]\d*$/;
      if (!this.oldCount) {
        this.$message.error("请输入数量");
        this.$nextTick(() => {
          const input = this.$refs.editInput.$refs.input;
          if (input) input.focus();
        });
        return;
      }
      if (!reg.test(this.oldCount)) {
        this.$message.error("请输入正整数");
        return;
      }
      if (this.oldCount !== row.num) {
        const params = {
          id: row.id,
          inviteType: row.inviteType,
          num: this.oldCount,
          type: row.type,
          userNum: row.userNum,
        };
        detailUpdateSchemeDetail(params).then(() => {
          this.$message.success("编辑成功");
          this.getList();
        });
      } else {
        row.num = this.oldCount;
      }
      this.$set(row, "showEditInput", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.editStyle {
  cursor: pointer;
  color: #409eff;
  margin-left: 5px;
  font-size: 14px;
}
</style>
