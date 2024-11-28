<template>
  <basic-container>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="false"
    >
      <template #content="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="(item, i) in row.btnList"
          :class="item.class"
          :key="i"
          >{{ item.name }}</span
        >
      </template>
    </tableSearch>
    <el-dialog
      :visible.sync="in8nVisible"
      width="30%"
      title="国际化"
      :close-on-click-modal="false"
    >
      <createIn18n v-if="in8nVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>
<script>
import { refuseQueryPage } from "@/api/admin/index";
import createIn18n from "@/views/content/navigation/component/createIn18n.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { optionsDismiss } from "@/util/util";
export default {
  components: {
    tableSearch,
    createIn18n,
  },
  data() {
    return {
      bigImage: "",
      loading: false,
      in8nVisible: false,
      row: {},
      tableData: [],
      tableLabel: [
        {
          prop: "sort",
          label: "排序",
        },
        {
          prop: "refuseType",
          label: "违规类型",
          type: "filter",
          filter: (row) => {
            const item = optionsDismiss.find((v) => v.id === row.refuseType);
            return item?.name;
          },
        },
        {
          prop: "refuseReason",
          label: "违规原因",
        },
        {
          label: "操作",
          type: "slot",
          slotName: "content",
          width: "150",
        },
      ],
      tablePage: {
        total: 1,
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

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      refuseQueryPage(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records.map((v) => {
              v.btnList = this.getBtnList();
              return v;
            });
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    getBtnList() {
      const btnList = [
        {
          name: "国际化",
          class: "comBtn link",
          callback: ({ row }) => {
            this.in8nVisible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.in8nVisible = false;
              },
            };
          },
        },
      ];
      return btnList;
    },
  },
};
</script>
