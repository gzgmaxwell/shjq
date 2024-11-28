<template>
  <div>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="{}"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
    >
      <el-button class="mb10" type="primary" @click="addAttri"
        >添加属性</el-button
      >
      <template #content="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
      </template>
    </tableSearch>
    <div>
      <el-button class="mb10" type="primary" @click="sure">确定</el-button>
      <el-button
        class="mb10 mt10"
        @click="() => row.callback && row.callback()"
        >取消</el-button
      >
    </div>
  </div>
</template>
<script>
import tableSearch from "@/components/tableSearch/table.vue";
import {
  propertyList,
  deleteProperty,
  saveOrUpdateRelationBatch,
} from "@/api/burialevent";
export default {
  components: {
    tableSearch,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      optAttri: [],
      tableData: [],
      tableLabel: [
        {
          label: "属性名称",
          prop: "propertyName",
          type: "option",
          option: [],
          callback: ({ val, row }) => {
            row.propertyDesc = this.optAttri.find(
              (v) => v.id === val
            )?.propertyDesc;
            row.id = this.optAttri.find((v) => v.id === val)?.id;
            this.disabledOptAttri();
          },
        },
        {
          label: "属性中文名称",
          prop: "propertyDesc",
        },
        {
          label: "操作",
          type: "slot",
          slotName: "content",
          width: "260",
        },
      ],
      tablePage: {
        total: 0,
      },
    };
  },
  mounted() {
    const data = [...this.row.relationList];
    data.forEach((v) => {
      v.btnList = [
        {
          name: "删除",
          class: "comBtn danger",
          callback: ({ row, index }) => {
            this.tableData.splice(index, 1);
          },
        },
      ];
    });
    this.tableData = data;
    this.getList();
  },

  methods: {
    disabledOptAttri() {
      const arrIds = this.tableData.map((v) => v.id);
      this.optAttri.forEach((v) => {
        if (arrIds.includes(v.id)) {
          v.disabled = true;
        } else {
          v.disabled = false;
        }
      });
      this.tableLabel.forEach((v) => {
        if (v?.option) {
          v.option = this.optAttri;
        }
      });
    },
    getList() {
      const params = {
        current: 1,
        publicProperty: false,
        size: 999,
      };
      this.loading = true;
      propertyList(params).then((res) => {
        this.loading = false;
        const data = res.data.data || [];
        data.forEach((v) => {
          v.name = v.propertyName;
          v.disabled = false;
        });
        this.optAttri = data;
        this.disabledOptAttri();
      });
    },
    addAttri() {
      const item = {
        propertyName: "",
        propertyDesc: "",
        id: "",
        btnList: [
          {
            name: "删除",
            class: "comBtn link",
            callback: ({ row, index }) => {
              this.tableData.splice(index, 1);
            },
          },
        ],
      };
      this.tableData.push(item);
    },
    sure() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].id) {
          this.$message.warning("请删除空行数据");
          return false;
        }
      }

      const params = {
        eventTrackingId: this.row.id,
        propertyIds: this.tableData.map((v) => v.id) || [],
      };
      saveOrUpdateRelationBatch(params).then((res) => {
        this.$message.success("操作成功");
        this.row.callback(true);
      });
    },
  },
};
</script>
