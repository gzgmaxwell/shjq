<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isSelection="true"
    >
      <template #content="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList.slice(0, 2)"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
        <el-dropdown v-if="row.btnList.length > 2">
          <span class="el-dropdown-link ml5 link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="item.callback({ row, index })"
              v-for="item in row.btnList.slice(2)"
              :class="item.class"
              :key="item.name"
              >{{ item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </tableSearch>
    <el-dialog
      title="埋点事件"
      :visible.sync="visible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog
      title="回传属性"
      :visible.sync="attriVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <attriCreate v-if="attriVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>
<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import create from "./create.vue";
import attriCreate from "./attriCreate.vue";
import { createParams, optTrigger, optCallbackImme } from "@/util/util";
import { eventPage, deleteEvent, relationList } from "@/api/burialevent";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
    create,
    attriCreate,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      row: {},
      visible: false,
      attriVisible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "eventId",
          placeholder: "事件ID",
          clearable: true,
        },
        {
          type: "input",
          prop: "name",
          placeholder: "事件名称",
          clearable: true,
        },
        {
          type: "input",
          prop: "description",
          placeholder: "中文名称",
          clearable: true,
        },
      ],
      searchData: {
        eventId: "",
        name: "",
        description: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visible = false;
              },
            };
          },
        },
        {
          label: "批量删除",
          type: "danger",
          disabled: () => this.selectionData.length === 0,
          callback: () => {
            this.$confirm(`确定要删除吗？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const data = this.selectionData.map((item) => item.id);
                deleteEvent({ ids: data }).then((res) => {
                  if (res.data.code == 200) {
                    if (this.tableData.length && this.tablePage.current > 1) {
                      this.tablePage.current--;
                    }
                    this.$message.success("删除成功");
                    this.getList();
                  }
                });
              })
              .catch(() => {});
          },
          auth: () => true,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "事件ID",
          prop: "eventId",
        },
        {
          label: "事件名称",
          prop: "name",
        },
        {
          label: "中文名称",
          prop: "description",
        },
        {
          label: "触发方式",
          type: "filter",
          filter: (row) =>
            optTrigger.find((v) => v.id === row.triggerMode)?.name,
        },
        {
          label: "及时回传",
          type: "filter",
          filter: (row) =>
            optCallbackImme.find((v) => v.id === row.uploadImmediately)?.name,
        },
        {
          label: "页面",
          prop: "moduleName",
        },
        {
          label: "操作",
          type: "slot",
          slotName: "content",
          width: "260",
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
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      levelData: "levelData",
    }),
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const data = createParams({
        ...this.searchData,
      });

      const params = {
        ...data,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      eventPage(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = data.data.total;
        }
      });
    },
    getBtnList(row) {
      const btnList = [
        {
          name: "编辑",
          class: "comBtn link",
          callback: ({ row }) => {
            this.row = {
              ...row,
              callback: (data) => {
                this.visible = false;
                if (data) {
                  this.getList();
                }
              },
            };
            this.visible = true;
          },
        },
      ];

      if (row) {
        btnList.push({
          name: "回传属性",
          class: "comBtn link",
          callback: () => {
            relationList({ eventTrackingId: row.id }).then((res) => {
              const data = (res.data.data || []).map((v) => {
                v.name = v.propertyName;
                return v;
              });
              this.row = {
                ...row,
                relationList: data,
                callback: (data) => {
                  this.attriVisible = false;
                  if (data) {
                    this.getList();
                  }
                },
              };
              this.attriVisible = true;
            });
          },
        });
      }
      return btnList;
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.eventId = "";
      this.searchData.name = "";
      this.searchData.description = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
